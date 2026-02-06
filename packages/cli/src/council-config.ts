export const councilNames = [
  'taipei',
  'newtaipei',
  'taoyuan',
  'taichung',
  'tainan',
  'kaohsiung',
] as const

export type CouncilName = (typeof councilNames)[number]

export const councilDisplayNames: Record<CouncilName, string> = {
  taipei: '台北市議會',
  newtaipei: '新北市議會',
  taoyuan: '桃園市議會',
  taichung: '台中市議會',
  tainan: '台南市議會',
  kaohsiung: '高雄市議會',
}

export function isValidCouncilName(name: string): name is CouncilName {
  return councilNames.includes(name as CouncilName)
}
