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

  body.scroll-lock, body[class*='scroll-lock--'] {
    overflow: hidden;
  }

  @media print {
    .hidden-print {
      display: none !important;
    }
  }
`

export default GlobalStyles
