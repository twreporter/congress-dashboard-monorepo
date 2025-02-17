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
`

export default GlobalStyles
