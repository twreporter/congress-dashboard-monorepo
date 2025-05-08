import React, { FC } from 'react'
import styled from 'styled-components'
// component
import RadioButton from '@/components/feedback/radio-button'
// type
import type { RadioButtonProps } from '@/components/feedback/radio-button'
// style
import { FlexColumn } from '@/styles/cheetsheet'
// @twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Container = styled.div<{ $selected: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
  border-radius: 4px;
  border: 1px solid
    ${(props) =>
      props.$selected ? colorGrayscale.gray600 : colorGrayscale.gray300};
  max-width: 100%;
  width: 432px;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};

  ${mq.tabletAndBelow`
    width: 327px;
  `}

  ${(props) =>
    props.$selected
      ? ''
      : `
    &:hover { 
      border: 1px solid ${colorGrayscale.gray600};
    }
  `}
`

const Radio = styled(RadioButton)`
  padding-top: 3px;
`

const Title = styled(H5)`
  color: ${colorGrayscale.gray800};
`

const Description = styled(P1)`
  color: ${colorGrayscale.gray800};
`

type SelectCardProps = RadioButtonProps & {
  title: string
  description?: string
}

const SelectCard: FC<SelectCardProps> = ({
  title,
  description,
  ...radioProps
}) => {
  return (
    <Container $selected={radioProps.checked} $disabled={radioProps.disabled}>
      <Radio {...radioProps} />
      <FlexColumn>
        <Title text={title} />
        <Description text={description} />
      </FlexColumn>
    </Container>
  )
}

export default SelectCard
