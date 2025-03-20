This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Required

Node.js v22.13.0

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Run development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Please add a `.env.local` to include both public & server env vars for local development.

## Logging

We use [`pino`](https://github.com/pinojs/pino) for api server logging.
It's recommanded to use [`pino-pretty`](https://github.com/pinojs/pino-pretty) to prettier your log when local developent.

```bash
// install pino-pretty cli
npm install -g pino-pretty

// pipe log into pino-pretty
yarn dev | pino-pretty -c
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
