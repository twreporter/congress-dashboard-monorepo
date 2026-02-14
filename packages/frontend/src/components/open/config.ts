import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
import type { CouncilDistrict } from '@/types/council'
import { InternalRoutes } from '@/constants/routes'

export const getCouncilName = (city: CouncilDistrict) =>
  `${CITY_LABEL[city]}議會`

export const getOpenConfig = (pathname: string) => {
  if (pathname.startsWith(InternalRoutes.Council)) {
    const districtSlug = pathname.replace(
      `${InternalRoutes.Council}/`,
      ''
    ) as CouncilDistrict
    return {
      title: '報導者觀測站',
      description: [
        '你家議員關心什麼？你關注的議題有誰在討論？',
        '點擊你感興趣的人或話題，觀察議員的提案情形',
      ],
      badge: {
        text: getCouncilName(districtSlug),
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
