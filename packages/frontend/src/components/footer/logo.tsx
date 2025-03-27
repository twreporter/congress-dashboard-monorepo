'use client'
import React, { useState } from 'react'
// next
import Link from 'next/link'
// @twreporter
import predefinedPropTypes from '@twreporter/core/lib/constants/prop-types'
import releaseBranchConsts from '@twreporter/core/lib/constants/release-branch'
import origins from '@twreporter/core/lib/constants/request-origins'
import { LogoFooter } from '@twreporter/react-components/lib/logo'

type LogoProps = {
  releaseBranch: typeof predefinedPropTypes.releaseBranch
}

const Logo: React.FC<LogoProps> = ({
  releaseBranch = releaseBranchConsts.release,
}) => {
  const mainOrigin = origins.forClientSideRendering[releaseBranch].main
  const [over, setOver] = useState(false)
  return (
    <Link
      href={mainOrigin}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      target="_blank"
    >
      <LogoFooter
        releaseBranch={releaseBranch}
        type={over ? LogoFooter.Type.DEFAULT : LogoFooter.Type.WHITE}
      />
    </Link>
  )
}

export default Logo
