'use client'

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useRouter, usePathname } from 'next/navigation'
// components
import Tab from '@/components/header/tab'
// constants
import { options } from '@/components/header/constants'
import { InternalRoutes } from '@/constants/routes'

const Container = styled.div`
  display: flex;
  gap: 32px;
`

const Tabs = () => {
  const router = useRouter()
  const pathname = usePathname()
  const isCongressRoute = pathname?.startsWith(InternalRoutes.Home)
  const isCouncilRoute = pathname?.startsWith(InternalRoutes.Council)

  const handleDropdownItemClick = useCallback(
    (option: { label: string; value: string }) => {
      router.push(option.value)
    },
    [router]
  )

  const handleMainTabClick = useCallback(() => {
    router.push(InternalRoutes.Home)
  }, [router])

  return (
    <Container>
      <Tab
        label="立法院"
        isSelected={isCongressRoute}
        onClick={handleMainTabClick}
        type={Tab.Type.single}
      />
      <Tab
        label="地方議會"
        isSelected={isCouncilRoute}
        onClick={() => {}}
        type={Tab.Type.dropdown}
        dropdownOptions={options}
        onDropdownItemClick={handleDropdownItemClick}
        currentDropdownValue={pathname || ''}
      />
    </Container>
  )
}

export default Tabs
