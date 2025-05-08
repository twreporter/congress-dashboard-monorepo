// constants
import { SNACK_BAR_ID } from '@/constants'

const getSnackBarBox = () => {
  const snackBarBoxComponent = document.getElementById(SNACK_BAR_ID)
  if (!snackBarBoxComponent) {
    throw `cannot find snack bar component with id: ${SNACK_BAR_ID}`
  }
  return snackBarBoxComponent
}

type toastrParams = {
  text: string
  timeout?: number
}
const toastr = ({ text, timeout = 3000 }: toastrParams) => {
  const snackBarBox = getSnackBarBox()
  const snackBarList = Array.from(snackBarBox.getElementsByTagName('p'))
  snackBarList.forEach((p) => {
    p.textContent = text
  })
  snackBarBox.style.opacity = '1'

  window.setTimeout(() => {
    snackBarList.forEach((p) => {
      p.textContent = ''
    })
    snackBarBox.style.opacity = '0'
  }, timeout)
}

export default toastr
