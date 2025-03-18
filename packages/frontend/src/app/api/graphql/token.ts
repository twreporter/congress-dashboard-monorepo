export type Session = {
  token: string
  expiredAt?: Date
}
const session: Session = {
  token: '',
}

const maxAge = 86400 // stateless session expire maxAge (sec)
const second = 1000
async function refreshToken(): Promise<void> {
  const email = process.env.API_AUTH_EMAIL
  const password = process.env.API_AUTH_PASSWORD
  const res = await fetch(`${process.env.API_SERVER_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Host: process.env.API_SERVER_HOST || '',
    },
    body: JSON.stringify({
      query: `
        mutation Mutation($email: String!, $password: String!) {
          authenticateSystemUserWithPassword(email: $email, password: $password) {
            ... on SystemUserAuthenticationWithPasswordSuccess {
              sessionToken
            }
            ... on SystemUserAuthenticationWithPasswordFailure {
              message
            }
          }
        }
      `,
      variables: {
        email,
        password,
      },
    }),
  })

  const data = await res.json()
  const { sessionToken, message } =
    data?.data?.authenticateSystemUserWithPassword
  if (!sessionToken || message) {
    // todo: log error instead of throw err
    throw `refresh token failed: ${message}`
  }
  session.token = sessionToken
  const now = new Date()
  session.expiredAt = new Date(now.getTime() + maxAge * second)
  return
}

async function getValidSession(): Promise<void> {
  const now = new Date()
  if (!session.token || !session.expiredAt || session.expiredAt <= now) {
    await refreshToken()
  }
  return
}

export async function getCookie(): Promise<string> {
  await getValidSession()
  return `keystonejs-session=${session.token}`
}
