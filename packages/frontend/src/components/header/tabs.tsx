'use client'

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { redirect, usePathname } from 'next/navigation'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorBrand,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { Arrow } from '@twreporter/react-components/lib/icon'
// hooks
import useOutsideClick from '@/hooks/use-outside-click'
// constants
import { options } from '@/components/header/constants'

const Container = styled.div`
  display: flex;
  gap: 32px;
`

const TabWrapper = styled.div`
  position: relative;
`

const Tab = styled.div<{ $selected: boolean }>`
  display: inline-flex;
  padding: 20px 0px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${(props) =>
    props.$selected
      ? `
    padding-bottom: 18px;
    border-bottom: 2px solid ${colorGrayscale.gray800};
    &:hover {
      border-bottom: 2px solid ${colorBrand.dark};
    }
  `
      : `
    border: none;
  `}
  p {
    color: ${colorGrayscale.gray800};
  }
  svg {
    background-color: ${colorGrayscale.gray800};
  }
  &:hover {
    p {
      color: ${colorBrand.dark};
    }
    svg {
      background-color: ${colorBrand.dark};
    }
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  margin-top: 8px;
  width: 160px;
  padding: 8px 0px;
  border-radius: 4px;
  background: ${colorGrayscale.white};
  box-shadow: 0px 2px 16px 0px ${colorOpacity['black_0.2']};
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
`

const DropdownItem = styled.div<{ $selected?: boolean }>`
  padding: 8px 12px;
  &:hover {
    background-color: ${colorGrayscale.gray100};
  }
  ${(props) =>
    props.$selected
      ? `
    background-color: #F0D5BE80;
  `
      : `
    background-color: ${colorGrayscale.white};
  `}
`

const Tabs = () => {
  const pathname = usePathname()
  const isCouncilRoute = pathname?.startsWith('/councils')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const tabRef = useOutsideClick(() => {
    setIsDropdownOpen(false)
  })

  const handleDropdownItemClick = useCallback((option) => {
    redirect(option.value)
  }, [])

  const handleMainTabClick = useCallback(() => {
    redirect('/')
  }, [])

  return (
    <Container>
      <Tab $selected={!isCouncilRoute} onClick={handleMainTabClick}>
        <P1 text="立法院" weight={P1.Weight.BOLD} />
      </Tab>
      <TabWrapper ref={tabRef}>
        <Tab
          $selected={isCouncilRoute}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <P1 text="地方議會" weight={P1.Weight.BOLD} />
          <Arrow
            direction={
              isDropdownOpen ? Arrow.Direction.UP : Arrow.Direction.DOWN
            }
          />
        </Tab>
        {isDropdownOpen ? (
          <DropdownMenu>
            {options.map((option) => (
              <DropdownItem
                key={option.value}
                $selected={pathname === option.value}
                onClick={() => handleDropdownItemClick(option)}
              >
                <P1
                  text={option.label}
                  weight={
                    pathname === option.value
                      ? P1.Weight.BOLD
                      : P1.Weight.NORMAL
                  }
                />
              </DropdownItem>
            ))}
          </DropdownMenu>
        ) : null}
      </TabWrapper>
    </Container>
  )
}

export default Tabs
