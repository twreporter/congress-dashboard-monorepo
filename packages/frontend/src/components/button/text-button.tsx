import { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const P1Button = styled(P1)`
  color: ${colorGrayscale.gray800};
  line-height: 180% !important;
  text-decoration-line: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  text-decoration-color: ${colorGrayscale.gray300};
  cursor: pointer;

  &:hover {
    text-decoration-color: ${colorGrayscale.gray800};
  }
`

type TextButtonProps = {
  text: string
  className?: string
  onClick?: () => void
}
const TextButton: FC<TextButtonProps> = ({ text, className, onClick }) => {
  const hanldeClick = () => {
    if (typeof onClick !== 'function') {
      return
    }
    onClick()
  }
  return (
    <P1Button
      text={text}
      weight={P1.Weight.BOLD}
      className={className}
      onClick={hanldeClick}
    />
  )
}

export default TextButton
