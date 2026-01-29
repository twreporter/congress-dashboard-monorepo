import { InternalRoutes } from '@/constants/routes'
// @twreporter
import {
  CITY_LABEL,
  type City,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'

export const getOptions = (citys: City[]) => {
  return citys.map((city) => ({
    label: `${CITY_LABEL[city]}議會`,
    value: `${InternalRoutes.Council}/${city}`,
  }))
}
