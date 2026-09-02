import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
import { getDistrictsByCity } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'
import {
  MEMBER_TYPE,
  MEMBER_TYPE_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-member'
import type { CouncilDistrict } from '@/types/council'

type AdministrativeDistrictParams = {
  city: CouncilDistrict
  administrativeDistrict: string[]
  memberType: string
}

export const formatAdministrativeDistrict = ({
  city,
  administrativeDistrict,
  memberType,
}: AdministrativeDistrictParams): string => {
  let result =
    getDistrictsByCity(city).length === administrativeDistrict.length
      ? `${CITY_LABEL[city]}全區`
      : administrativeDistrict.join('、')

  if (
    memberType === MEMBER_TYPE.highlandAboriginal ||
    memberType === MEMBER_TYPE.lowlandAboriginal
  ) {
    result += `（${MEMBER_TYPE_LABEL[memberType]}）`
  }

  return result
}
