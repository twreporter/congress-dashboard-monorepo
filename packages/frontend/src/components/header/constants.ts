import { InternalRoutes } from '@/constants/routes'
// @twreporter
import {
  CITY,
  CITY_LABEL,
  type City,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'

// just for six main cities currently
export const SIX_MAIN_CITIES = [
  CITY.taipei,
  CITY.newTaipei,
  CITY.taoyuan,
  CITY.taichung,
  CITY.tainan,
  CITY.kaohsiung,
]

export const getOptions = (cities: City[]) => {
  return cities.map((city) => ({
    label: `${CITY_LABEL[city]}議會`,
    value: `${InternalRoutes.Council}/${city}`,
  }))
}
