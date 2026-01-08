import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import { InternalRoutes } from '@/constants/routes'

const COUNCIL_NAMES: Record<string, string> = {
  taipei: '臺北市議會',
  'new-taipei': '新北市議會',
  taoyuan: '桃園市議會',
  taichung: '臺中市議會',
  tainan: '臺南市議會',
  kaohsiung: '高雄市議會',
}

export const getOpenConfig = (pathname: string) => {
  if (pathname.startsWith(InternalRoutes.Council)) {
    const districtSlug = pathname.replace(`${InternalRoutes.Council}/`, '')
    return {
      title: '報導者觀測站',
      description: [
        '你家議員關心什麼？你關注的議題有誰在討論？',
        '點擊你感興趣的人或話題，觀察議員的發言與提案情形',
      ],
      badge: {
        text: COUNCIL_NAMES[districtSlug],
        textColor: colorGrayscale.white,
        backgroundColor: colorSupportive.main,
      },
    }
  } else {
    return {
      title: '報導者觀測站',
      description: [
        '你家立委關心什麼？你關注的議題有誰在討論？',
        '點擊你感興趣的人或話題，觀察立委的發言與提案情形',
      ],
      badge: {
        text: '立法院',
        textColor: colorGrayscale.white,
        backgroundColor: colorGrayscale.gray800,
      },
    }
  }
}
