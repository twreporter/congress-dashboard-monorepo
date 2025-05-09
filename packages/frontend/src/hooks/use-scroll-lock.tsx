import { useEffect } from 'react'

export const useBodyScrollLock = ({
  toLock,
  lockID = '',
}: {
  toLock: boolean
  lockID?: string
}) => {
  useEffect(() => {
    const className = lockID ? `scroll-lock--${lockID}` : `scroll-lock`

    if (toLock) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }

    return () => {
      document.body.classList.remove(className)
    }
  }, [toLock, lockID])
}
