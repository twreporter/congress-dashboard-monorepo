import styled from 'styled-components'

import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const Avatar = styled.span<{ $size: 36 | 40 }>`
  display: inline-flex;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${colorGrayscale.gray400};
  border-radius: 50%;
  background: ${colorGrayscale.gray700};
  color: ${colorGrayscale.gray100};
  font-size: ${({ $size }) => ($size === 40 ? 16 : 12)}px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
`

type MemberAvatarProps = {
  name?: string
  email?: string
  size?: 36 | 40
}

function MemberAvatar({ name, email, size = 36 }: MemberAvatarProps) {
  const initial = (name || email)?.trim().slice(0, 1) || '?'

  return (
    <Avatar $size={size} aria-hidden>
      {initial}
    </Avatar>
  )
}

export default MemberAvatar
