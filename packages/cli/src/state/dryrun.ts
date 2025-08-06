let dryrun = true

export const dryrunState = {
  isEnabled: () => dryrun,
  enable: () => {
    dryrun = true
  },
  disable: () => {
    dryrun = false
  },
  reset: () => {
    dryrun = true
  },
}
