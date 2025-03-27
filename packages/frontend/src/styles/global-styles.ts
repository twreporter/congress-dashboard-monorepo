'use client'
import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  main {
    margin-top: 64px; // header height
  }

  @media print {
    .hidden-print {
      display: none !important;
    }
  }
`

export default GlobalStyles
