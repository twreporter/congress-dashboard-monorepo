import React from 'react'
import styled from 'styled-components'
import { Search as _Search } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

export const Search = styled(_Search)`
  /* overwrite default icon style */
  && {
    background-color: ${colorGrayscale.gray600};
  }
`

const _X = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="10" fill={colorGrayscale.gray400} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.88871 6.18258C6.69345 5.98732 6.37686 5.98732 6.1816 6.18258C5.98634 6.37784 5.98634 6.69442 6.1816 6.88969L9.29198 10.0001L6.18161 13.1104C5.98635 13.3057 5.98635 13.6223 6.18161 13.8175C6.37688 14.0128 6.69346 14.0128 6.88872 13.8175L9.99908 10.7072L13.1094 13.8175C13.3047 14.0128 13.6213 14.0128 13.8166 13.8175C14.0118 13.6223 14.0118 13.3057 13.8166 13.1104L10.7062 10.0001L13.8166 6.88969C14.0118 6.69442 14.0118 6.37784 13.8166 6.18258C13.6213 5.98732 13.3047 5.98732 13.1095 6.18258L9.99908 9.29295L6.88871 6.18258Z"
        fill={colorGrayscale.white}
      />
    </svg>
  )
}

export const X = styled(_X)`
  &:hover {
    rect {
      fill: ${colorGrayscale.gray600};
    }
  }
`

export const Issue = () => {
  return (
    <svg
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.85897 16.9705C3.32309 16.8369 2.99698 16.2941 3.13059 15.7583L3.8183 13H1C0.447715 13 0 12.5523 0 12C0 11.4478 0.447715 11 1 11H4.31695L5.31426 7.00005H2.5C1.94772 7.00005 1.5 6.55233 1.5 6.00005C1.5 5.44776 1.94772 5.00005 2.5 5.00005H5.81292L6.63846 1.68898C6.77207 1.1531 7.3148 0.826995 7.85068 0.960604C8.38656 1.09421 8.71266 1.63694 8.57905 2.17282L7.87415 5.00005H11.8129L12.6385 1.68898C12.7721 1.1531 13.3148 0.826995 13.8507 0.960604C14.3866 1.09421 14.7127 1.63694 14.5791 2.17282L13.8741 5.00005H16.6C17.1523 5.00005 17.6 5.44776 17.6 6.00005C17.6 6.55233 17.1523 7.00005 16.6 7.00005H13.3755L12.3782 11H15.1C15.6523 11 16.1 11.4478 16.1 12C16.1 12.5523 15.6523 13 15.1 13H11.8795L11.0712 16.2421C10.9376 16.778 10.3948 17.1041 9.85897 16.9705C9.32309 16.8369 8.99698 16.2941 9.13059 15.7583L9.81829 13H5.87952L5.07119 16.2421C4.93758 16.778 4.39485 17.1041 3.85897 16.9705ZM10.317 11L11.3143 7.00005H7.37549L6.37818 11H10.317Z"
        fill={colorGrayscale.gray600}
      />
    </svg>
  )
}
