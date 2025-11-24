import { ValuesOf, createOptions } from '../utils'

export const CITY = {
  taipei: 'taipei',
  keelung: 'keelung',
  newTaipei: 'new-taipei',
  lienchiang: 'lienchiang',
  yilan: 'yilan',
  hsinchuCity: 'hsinchu-city',
  hsinchuCounty: 'hsinchu-county',
  taoyuan: 'taoyuan',
  miaoli: 'miaoli',
  taichung: 'taichung',
  changhua: 'changhua',
  nantou: 'nantou',
  chiayiCity: 'chiayi-city',
  chiayiCounty: 'chiayi-county',
  yunlin: 'yunlin',
  tainan: 'tainan',
  kaohsiung: 'kaohsiung',
  penghu: 'penghu',
  kinmen: 'kinmen',
  pingtung: 'pingtung',
  taitung: 'taitung',
  hualien: 'hualien',
}

export type City = ValuesOf<typeof CITY>

export const CITY_LABEL: Readonly<Record<City, string>> = {
  [CITY.taipei]: '台北市',
  [CITY.keelung]: '基隆市',
  [CITY.newTaipei]: '新北市',
  [CITY.lienchiang]: '連江縣',
  [CITY.yilan]: '宜蘭縣',
  [CITY.hsinchuCity]: '新竹市',
  [CITY.hsinchuCounty]: '新竹縣',
  [CITY.taoyuan]: '桃園市',
  [CITY.miaoli]: '苗栗縣',
  [CITY.taichung]: '台中市',
  [CITY.changhua]: '彰化縣',
  [CITY.nantou]: '南投縣',
  [CITY.chiayiCity]: '嘉義市',
  [CITY.chiayiCounty]: '嘉義縣',
  [CITY.yunlin]: '雲林縣',
  [CITY.tainan]: '台南市',
  [CITY.kaohsiung]: '高雄市',
  [CITY.penghu]: '澎湖縣',
  [CITY.kinmen]: '金門縣',
  [CITY.pingtung]: '屏東縣',
  [CITY.taitung]: '台東縣',
  [CITY.hualien]: '花蓮縣',
}

export const CITY_OPTIONS = createOptions(CITY, CITY_LABEL)

export default {
  CITY,
  CITY_LABEL,
  CITY_OPTIONS,
}
