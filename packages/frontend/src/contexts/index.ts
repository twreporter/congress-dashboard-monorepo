'use client'

import { createContext } from 'react'
// @twreporter
import {
  BRANCH,
  BRANCH_PROP_TYPES,
} from '@twreporter/core/lib/constants/release-branch'

export type CoreProps = {
  releaseBranch: BRANCH_PROP_TYPES
  toastr: (params?: object) => void
}
export const CoreContext: React.Context<CoreProps> = createContext({
  releaseBranch: BRANCH.master,
  toastr: () => {},
})
