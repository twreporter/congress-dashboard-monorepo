export const councilNames = [
  'taipei',
  'new-taipei',
  'taoyuan',
  'taichung',
  'tainan',
  'kaohsiung',
] as const

export type CouncilName = (typeof councilNames)[number]

export const councilDisplayNames: Record<CouncilName, string> = {
  taipei: '台北市議會',
  'new-taipei': '新北市議會',
  taoyuan: '桃園市議會',
  taichung: '台中市議會',
  tainan: '台南市議會',
  kaohsiung: '高雄市議會',
}

export const councilRankings: Record<CouncilName, number> = {
  taipei: 1,
  'new-taipei': 2,
  taoyuan: 3,
  taichung: 4,
  tainan: 5,
  kaohsiung: 6,
}

export function isValidCouncilName(name: string): name is CouncilName {
  return councilNames.includes(name as CouncilName)
}
