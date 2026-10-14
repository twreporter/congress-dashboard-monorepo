// mock data for following sections, to be replaced by real API data

export const MOCK_AVATAR = 'https://lawmaker.twreporter.org/images/110007.jpg'
export const MOCK_PARTY_AVATAR =
  'https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png'

export type MockFollowingInfo = {
  title: string
  description: string
  billCount: number
  speechCount: number
  latestDataDate: string
}

export type MockFollowingPeople = {
  type: 'legislator' | 'councilor'
  avatar: string
  party: string
  name: string
  description: string
  count: number
  latestDate: string
  destrict?: string
}

export type MockFollowingArticle = {
  place: string
  title: string
  summary: string
  attendee: string[]
  date: string
}

export const MOCK_COMBO_LIST: MockFollowingInfo[] = [
  {
    title: '苗博雅 ✕ 社會住宅政策',
    description: '台北市議會｜第 14 屆｜全部會期',
    billCount: 10,
    speechCount: 5,
    latestDataDate: '2024/06/01',
  },
  {
    title: '王美惠 ✕ 食品安全',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 8,
    speechCount: 12,
    latestDataDate: '2024/05/28',
  },
  {
    title: '黃捷 ✕ 性別平權',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 6,
    speechCount: 9,
    latestDataDate: '2024/05/24',
  },
  {
    title: '范雲 ✕ 勞工權益',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 14,
    speechCount: 7,
    latestDataDate: '2024/05/20',
  },
  {
    title: '洪孟楷 ✕ 交通安全',
    description: '立法院｜第 11 屆｜第 1-3 會期',
    billCount: 5,
    speechCount: 11,
    latestDataDate: '2024/05/17',
  },
  {
    title: '陳培瑜 ✕ 教育改革',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 9,
    speechCount: 15,
    latestDataDate: '2024/05/13',
  },
  {
    title: '林昶佐 ✕ 文化資產保存',
    description: '台北市議會｜第 14 屆｜全部會期',
    billCount: 4,
    speechCount: 6,
    latestDataDate: '2024/05/09',
  },
  {
    title: '蘇巧慧 ✕ 能源轉型',
    description: '立法院｜第 11 屆｜第 2-5 會期',
    billCount: 11,
    speechCount: 8,
    latestDataDate: '2024/05/06',
  },
  {
    title: '鍾佳濱 ✕ 農業政策',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 7,
    speechCount: 10,
    latestDataDate: '2024/05/02',
  },
  {
    title: '邱議瑩 ✕ 長照服務',
    description: '立法院｜第 11 屆｜第 1-4 會期',
    billCount: 13,
    speechCount: 4,
    latestDataDate: '2024/04/28',
  },
  {
    title: '羅智強 ✕ 財政紀律',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 3,
    speechCount: 18,
    latestDataDate: '2024/04/24',
  },
  {
    title: '吳沛憶 ✕ 居住正義',
    description: '立法院｜第 11 屆｜第 1-2 會期',
    billCount: 12,
    speechCount: 5,
    latestDataDate: '2024/04/20',
  },
  {
    title: '李坤城 ✕ 兒少保護',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 6,
    speechCount: 13,
    latestDataDate: '2024/04/16',
  },
  {
    title: '牛煦庭 ✕ 數位治理',
    description: '立法院｜第 11 屆｜第 3-5 會期',
    billCount: 9,
    speechCount: 6,
    latestDataDate: '2024/04/12',
  },
  {
    title: '張雅琳 ✕ 動物保護',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 5,
    speechCount: 14,
    latestDataDate: '2024/04/08',
  },
]

export const MOCK_TOPIC_LIST: MockFollowingInfo[] = [
  {
    title: '社會住宅政策',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 10,
    speechCount: 5,
    latestDataDate: '2024/06/01',
  },
  {
    title: '能源轉型',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 8,
    speechCount: 3,
    latestDataDate: '2024/05/29',
  },
  {
    title: '長照 2.0',
    description: '立法院｜第 11 屆｜第 2-5 會期',
    billCount: 12,
    speechCount: 9,
    latestDataDate: '2024/05/25',
  },
  {
    title: '全民健保財務',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 7,
    speechCount: 11,
    latestDataDate: '2024/05/21',
  },
  {
    title: '食品安全',
    description: '台北市議會｜第 14 屆｜全部會期',
    billCount: 5,
    speechCount: 6,
    latestDataDate: '2024/05/18',
  },
  {
    title: '交通事故防制',
    description: '立法院｜第 11 屆｜第 1-4 會期',
    billCount: 9,
    speechCount: 8,
    latestDataDate: '2024/05/14',
  },
  {
    title: '校園霸凌防治',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 4,
    speechCount: 13,
    latestDataDate: '2024/05/10',
  },
  {
    title: '原住民族權益',
    description: '立法院｜第 11 屆｜第 1-3 會期',
    billCount: 6,
    speechCount: 7,
    latestDataDate: '2024/05/07',
  },
  {
    title: '數位中介服務',
    description: '立法院｜第 11 屆｜第 3-5 會期',
    billCount: 11,
    speechCount: 4,
    latestDataDate: '2024/05/03',
  },
  {
    title: '氣候變遷因應',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 14,
    speechCount: 10,
    latestDataDate: '2024/04/29',
  },
  {
    title: '勞工退休金制度',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 3,
    speechCount: 16,
    latestDataDate: '2024/04/25',
  },
  {
    title: '治安與詐騙防制',
    description: '台北市議會｜第 14 屆｜全部會期',
    billCount: 13,
    speechCount: 5,
    latestDataDate: '2024/04/21',
  },
  {
    title: '幼兒托育補助',
    description: '立法院｜第 11 屆｜第 1-2 會期',
    billCount: 8,
    speechCount: 12,
    latestDataDate: '2024/04/17',
  },
  {
    title: '國防預算',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 6,
    speechCount: 9,
    latestDataDate: '2024/04/13',
  },
  {
    title: '動物保護',
    description: '立法院｜第 11 屆｜第 1-5 會期',
    billCount: 5,
    speechCount: 7,
    latestDataDate: '2024/04/09',
  },
]

export const MOCK_PEOPLE_LIST: MockFollowingPeople[] = [
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '王美惠',
    description: '第 11 屆｜嘉義市選舉區',
    count: 5,
    latestDate: '2024/06/01',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '林思銘',
    description: '第 11 屆｜新竹縣第 2 選舉區',
    count: 8,
    latestDate: '2024/05/29',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '陳培瑜',
    description: '第 11 屆｜全國不分區',
    count: 12,
    latestDate: '2024/05/25',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '吳沛憶',
    description: '第 11 屆｜台北市第 3 選舉區',
    count: 6,
    latestDate: '2024/05/21',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '洪孟楷',
    description: '第 11 屆｜新北市第 1 選舉區',
    count: 9,
    latestDate: '2024/05/18',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '張雅琳',
    description: '第 11 屆｜全國不分區',
    count: 4,
    latestDate: '2024/05/14',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '賴士葆',
    description: '第 11 屆｜台北市第 8 選舉區',
    count: 15,
    latestDate: '2024/05/10',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '邱議瑩',
    description: '第 11 屆｜高雄市第 3 選舉區',
    count: 7,
    latestDate: '2024/05/07',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '黃捷',
    description: '第 11 屆｜高雄市第 5 選舉區',
    count: 11,
    latestDate: '2024/05/03',
  },
  {
    type: 'legislator',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '范雲',
    description: '第 11 屆｜全國不分區',
    count: 3,
    latestDate: '2024/04/29',
  },
  {
    type: 'councilor',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '苗博雅',
    description: '第 14 屆｜台北市第 6 選區',
    count: 10,
    latestDate: '2024/04/25',
    destrict: '台北市',
  },
  {
    type: 'councilor',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '林亮君',
    description: '第 14 屆｜台北市第 4 選區',
    count: 6,
    latestDate: '2024/04/21',
    destrict: '台北市',
  },
  {
    type: 'councilor',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '陳怡君',
    description: '第 14 屆｜台北市第 2 選區',
    count: 13,
    latestDate: '2024/04/17',
    destrict: '台北市',
  },
  {
    type: 'councilor',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '黃郁芬',
    description: '第 14 屆｜新北市第 7 選區',
    count: 5,
    latestDate: '2024/04/13',
    destrict: '新北市',
  },
  {
    type: 'councilor',
    avatar: MOCK_AVATAR,
    party: MOCK_PARTY_AVATAR,
    name: '張之豪',
    description: '第 14 屆｜基隆市第 1 選區',
    count: 8,
    latestDate: '2024/04/09',
    destrict: '基隆市',
  },
]

export const MOCK_SPEECH_LIST: MockFollowingArticle[] = [
  {
    place: '立法院財政委員會',
    title: '718 億元民生總預算動支進度',
    summary:
      '賴士葆詢問陳淑姿，針對立法院三讀通過的718億元民生總預算是否已准予動支，並強調該預算包含TPASS計畫、包含TPASS計畫包含TPASS計畫',
    attendee: ['賴士葆'],
    date: '2024/06/01',
  },
  {
    place: '立法院社會福利及衛生環境委員會',
    title: '長照 3.0 推動期程與人力缺口',
    summary:
      '邱議瑩質詢衛福部長，關切長照服務人力長期不足，要求說明照服員薪資結構與留任率改善方案，以及偏鄉服務涵蓋率的具體目標。',
    attendee: ['邱議瑩', '陳培瑜'],
    date: '2024/05/29',
  },
  {
    place: '立法院交通委員會',
    title: '行人安全與路口改善工程',
    summary:
      '洪孟楷針對行人地獄問題要求交通部提出路口改善進度，並檢討標線型人行道的安全性與退縮設計的落實狀況。',
    attendee: ['洪孟楷'],
    date: '2024/05/25',
  },
  {
    place: '立法院教育及文化委員會',
    title: '校園霸凌通報機制檢討',
    summary:
      '陳培瑜詢問教育部對校園霸凌事件的通報與調查流程，要求說明調查委員專業訓練與受害學生的後續輔導資源。',
    attendee: ['陳培瑜', '張雅琳', '范雲'],
    date: '2024/05/21',
  },
  {
    place: '立法院經濟委員會',
    title: '再生能源佔比與電網韌性',
    summary:
      '蘇巧慧關切再生能源躉購費率調整對產業的影響，並要求台電說明分散式電網布建與儲能設備採購期程。',
    attendee: ['蘇巧慧'],
    date: '2024/05/18',
  },
  {
    place: '立法院內政委員會',
    title: '社會住宅包租代管成效',
    summary:
      '吳沛憶要求營建署說明社宅包租代管的媒合率偏低原因，並檢討租金補貼與房東參與誘因的設計。',
    attendee: ['吳沛憶', '黃捷'],
    date: '2024/05/14',
  },
  {
    place: '立法院司法及法制委員會',
    title: '詐騙案件偵辦與金流攔阻',
    summary:
      '羅智強質詢法務部，關切詐欺案件起訴率與沒收金流的執行成效，要求提出跨部會打詐的具體 KPI。',
    attendee: ['羅智強'],
    date: '2024/05/10',
  },
  {
    place: '立法院外交及國防委員會',
    title: '國防特別預算執行率',
    summary:
      '牛煦庭詢問國防部有關海空戰力提升特別預算的執行率，並要求說明延宕項目的補救措施與交艦期程。',
    attendee: ['牛煦庭', '林思銘'],
    date: '2024/05/07',
  },
  {
    place: '立法院經濟委員會',
    title: '食安稽查人力與抽驗頻率',
    summary:
      '王美惠關切地方衛生局稽查人力不足，要求食藥署說明高風險食品的抽驗頻率與不合格產品下架流程。',
    attendee: ['王美惠'],
    date: '2024/05/03',
  },
  {
    place: '立法院社會福利及衛生環境委員會',
    title: '健保總額成長率與新藥納保',
    summary:
      '范雲質詢健保署，針對新藥與新醫材納保時程過長提出檢討，要求說明平行審查機制的實施成效。',
    attendee: ['范雲', '邱議瑩', '陳培瑜'],
    date: '2024/04/29',
  },
  {
    place: '台北市議會警察衛生部門質詢',
    title: '社宅周邊公共設施配套',
    summary:
      '苗博雅要求都發局說明社宅完工後周邊托育、長照與交通設施的配套規劃，並檢討里鄰溝通機制。',
    attendee: ['苗博雅'],
    date: '2024/04/25',
  },
  {
    place: '立法院財政委員會',
    title: '統一發票雲端載具推廣',
    summary:
      '李坤城詢問財政部雲端發票普及率與中獎通知機制，要求改善高齡者使用載具的友善設計。',
    attendee: ['李坤城'],
    date: '2024/04/21',
  },
  {
    place: '立法院內政委員會',
    title: '原住民族土地劃設爭議',
    summary:
      '鍾佳濱關切原住民族傳統領域劃設與私有地爭議，要求原民會說明協商機制與補償方案的時程。',
    attendee: ['鍾佳濱', '黃捷'],
    date: '2024/04/17',
  },
  {
    place: '立法院教育及文化委員會',
    title: '幼兒園教保人員薪資與師生比',
    summary:
      '張雅琳要求教育部檢討公共化幼兒園的師生比規範，並說明教保服務人員加薪政策的經費來源。',
    attendee: ['張雅琳'],
    date: '2024/04/13',
  },
  {
    place: '立法院經濟委員會',
    title: '動物收容所認養率與絕育補助',
    summary:
      '黃捷詢問農業部公立收容所的在養數與認養率，並要求擴大遊蕩犬貓絕育補助與源頭管理。',
    attendee: ['黃捷', '范雲'],
    date: '2024/04/09',
  },
]

export const MOCK_BILL_LIST: MockFollowingArticle[] = [
  {
    place: '立法院內政委員會',
    title: '住宅法部分條文修正草案',
    summary:
      '擴大社會住宅包租代管適用範圍，並調整租金補貼申請門檻，強化弱勢家戶的居住協助。',
    attendee: ['吳沛憶', '黃捷', '范雲'],
    date: '2024/06/01',
  },
  {
    place: '立法院經濟委員會',
    title: '再生能源發展條例修正草案',
    summary:
      '明定公有建築物設置太陽光電的義務比率，並增訂儲能設備設置的獎勵與併網規範。',
    attendee: ['蘇巧慧', '牛煦庭'],
    date: '2024/05/29',
  },
  {
    place: '立法院社會福利及衛生環境委員會',
    title: '長期照顧服務法修正草案',
    summary:
      '增訂照顧服務員勞動條件保障與職涯發展機制，並擴大家庭照顧者喘息服務的給付對象。',
    attendee: ['邱議瑩'],
    date: '2024/05/25',
  },
  {
    place: '立法院交通委員會',
    title: '道路交通管理處罰條例修正草案',
    summary:
      '提高行人穿越道未禮讓行人的罰則，並要求主管機關定期公布高風險路口改善進度。',
    attendee: ['洪孟楷', '林思銘'],
    date: '2024/05/21',
  },
  {
    place: '立法院教育及文化委員會',
    title: '校園霸凌防制準則修正草案',
    summary:
      '明定校園霸凌事件的通報時限與調查小組組成方式，並強化受害學生的心理輔導資源。',
    attendee: ['陳培瑜', '張雅琳'],
    date: '2024/05/18',
  },
  {
    place: '立法院司法及法制委員會',
    title: '詐欺犯罪危害防制條例草案',
    summary:
      '建立金融機構與電信業者的通報義務，並增訂境外詐欺集團的管轄與沒收規定。',
    attendee: ['羅智強'],
    date: '2024/05/14',
  },
  {
    place: '立法院經濟委員會',
    title: '食品安全衛生管理法修正草案',
    summary:
      '加重食品標示不實的罰鍰額度，並要求建立高風險食品的全程追溯追蹤系統。',
    attendee: ['王美惠', '李坤城'],
    date: '2024/05/10',
  },
  {
    place: '立法院財政委員會',
    title: '所得稅法部分條文修正草案',
    summary:
      '調高幼兒學前特別扣除額與長期照顧特別扣除額，減輕育兒及照顧家庭的稅負。',
    attendee: ['賴士葆'],
    date: '2024/05/07',
  },
  {
    place: '立法院社會福利及衛生環境委員會',
    title: '全民健康保險法修正草案',
    summary:
      '檢討健保總額成長率的計算方式，並增訂新藥與新醫材納保的審查時限規範。',
    attendee: ['范雲', '邱議瑩', '陳培瑜'],
    date: '2024/05/03',
  },
  {
    place: '立法院內政委員會',
    title: '原住民族土地及海域法草案',
    summary:
      '明定傳統領域劃設程序與諮商同意機制，並增訂爭議調處及補償相關規定。',
    attendee: ['鍾佳濱'],
    date: '2024/04/29',
  },
  {
    place: '立法院外交及國防委員會',
    title: '國防產業發展條例修正草案',
    summary:
      '放寬國內廠商參與軍品研製的資格限制，並增訂關鍵技術保護與輸出管制條款。',
    attendee: ['牛煦庭', '林思銘', '洪孟楷'],
    date: '2024/04/25',
  },
  {
    place: '立法院經濟委員會',
    title: '動物保護法部分條文修正草案',
    summary: '強化寵物繁殖業者的查核與登記制度，並提高虐待動物行為的刑責上限。',
    attendee: ['黃捷'],
    date: '2024/04/21',
  },
  {
    place: '立法院衛生環境委員會',
    title: '氣候變遷因應法修正草案',
    summary:
      '明定碳費徵收對象與費率審議機制，並要求各部會提出階段管制目標的執行報告。',
    attendee: ['蘇巧慧', '范雲'],
    date: '2024/04/17',
  },
  {
    place: '立法院社會福利及衛生環境委員會',
    title: '兒童及少年福利與權益保障法修正草案',
    summary: '增訂托育人員的查核與退場機制，並強化兒虐案件的跨機關資訊通報。',
    attendee: ['李坤城', '張雅琳'],
    date: '2024/04/13',
  },
  {
    place: '台北市議會',
    title: '台北市社會住宅出租管理自治條例修正草案',
    summary: '調整社會住宅租金計算基準與續租年限，並增訂弱勢戶的優先配租比率。',
    attendee: ['苗博雅', '林亮君'],
    date: '2024/04/09',
  },
]
