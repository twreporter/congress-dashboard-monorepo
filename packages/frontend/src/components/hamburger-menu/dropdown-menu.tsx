'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
import { redirect } from 'next/navigation'
// @twreporter
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { Arrow } from '@twreporter/react-components/lib/icon'

const Container = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0px;
  cursor: pointer;
  svg {
    transition: rotate 300ms ease-in-out;
  }

  ${(props) =>
    props.$isActive
      ? `
    p {
      color: ${colorBrand.heavy};
    }
    svg {
      background-color: ${colorBrand.heavy};
      rotate: 180deg;
    }
  `
      : `
    p {
      color: ${colorGrayscale.gray800};
    }
    svg {
      background-color: ${colorGrayscale.gray800};
      rotate: 0deg;
    }
  `}
`

const P2Gray800 = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const ArrowIcon = styled(Arrow)`
  background-color: ${colorGrayscale.gray800};
`

const Menu = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  max-height: ${(props) => (props.$isActive ? '100%' : '0')};
  transition: max-height 300ms ease-in-out;
  overflow: hidden;
`

const Item = styled.div`
  padding: 8px 0px;
`

type DropdownMenuProps = {
  label: string
  options: {
    label: string
    value: string
  }[]
  isActive?: boolean
  onClick?: () => void
}
const DropdownMenu: FC<DropdownMenuProps> = ({
  label,
  options,
  isActive = false,
  onClick = () => {},
}) => {
  const handleItemClick = (value: string) => {
    redirect(value)
  }
  return (
    <>
      <Container $isActive={isActive} onClick={onClick}>
        <P1 text={label} weight={P1.Weight.BOLD} />
        <ArrowIcon direction={Arrow.Direction.DOWN} />
      </Container>
      <Menu $isActive={isActive}>
        {options.map(({ label, value }) => (
          <Item
            key={`dropdown-menu-item-${value}`}
            onClick={() => handleItemClick(value)}
          >
            <P2Gray800 text={label} weight={P2.Weight.BOLD} />
          </Item>
        ))}
      </Menu>
    </>
  )
}

export default DropdownMenu
