'use client'
import React, { useMemo } from 'react'
import styled from 'styled-components'
// next
import Link from 'next/link'
// @twreporter
import { SocialMedia } from '@twreporter/react-components/lib/icon'
import { IconButton } from '@twreporter/react-components/lib/button'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const SocialMediaIcons: React.FC = () => {
  const socialMediaLinks = useMemo(
    () => [
      {
        slug: 'facebook',
        icon: 'facebook',
        to: 'https://www.facebook.com/twreporter/',
        target: '_blank',
        ariaLabel: '前往《報導者》Facebook',
      },
      {
        slug: 'instagram',
        icon: 'instagram',
        to: 'https://www.instagram.com/twreporter/',
        target: '_blank',
        ariaLabel: '前往《報導者》Instagram',
      },
      {
        slug: 'youtube',
        icon: 'youtube',
        to: 'https://www.youtube.com/@TwreporterOrg',
        target: '_blank',
        ariaLabel: '前往《報導者》YouTube',
      },
      {
        slug: 'x',
        icon: 'twitter',
        to: 'https://twitter.com/tw_reporter_org',
        target: '_blank',
        ariaLabel: '前往《報導者》X',
      },
      {
        slug: 'medium',
        icon: 'medium',
        to: 'https://medium.com/twreporter',
        target: '_blank',
        ariaLabel: '前往《報導者》Medium',
      },
      {
        slug: 'threads',
        icon: 'threads',
        to: 'https://www.threads.com/@twreporter',
        target: '_blank',
        ariaLabel: '前往《報導者》Threads',
      },
    ],
    []
  )

  return (
    <Container>
      {socialMediaLinks.map((link) => (
        <Link
          key={link.slug}
          href={link.to}
          target={link.target}
          aria-label={link.ariaLabel}
        >
          <IconButton
            iconComponent={
              <SocialMedia
                mediaType={link.icon}
                releaseBranch={releaseBranch}
              />
            }
          />
        </Link>
      ))}
    </Container>
  )
}

export default SocialMediaIcons
