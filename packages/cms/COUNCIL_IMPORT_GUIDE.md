# 縣市議會資料匯入說明文件

本文件說明如何使用 CMS 的「縣市議會資料匯入」功能，包含各項資料的 JSON 格式規範與欄位值限制。

## 目錄

- [使用方式](#使用方式)
- [匯入項目類型](#匯入項目類型)
  - [1. 縣市議員 (Councilor)](#1-縣市議員-councilor)
  - [2. 議員屆資 (CouncilMember)](#2-議員屆資-councilmember)
  - [3. 議案資料 (CouncilBill)](#3-議案資料-councilbill)
  - [4. 縣市議題 (CouncilTopic)](#4-縣市議題-counciltopic)
  - [5. 縣市議題－立法院相關議題關聯](#5-縣市議題立法院相關議題關聯)
  - [6. 縣市議題－縣市議會相關議題關聯](#6-縣市議題縣市議會相關議題關聯)
  - [7. 縣市議題－同縣市議會相關議題關聯](#7-縣市議題同縣市議會相關議題關聯)
- [欄位值限制說明](#欄位值限制說明)

---

## 使用方式

1. 進入 CMS 後台，選擇「縣市議會資料匯入」
2. 輸入「紀錄名稱」以識別本次匯入
3. 選擇要匯入的「項目類型」
4. 上傳符合格式的 JSON 檔案
5. 系統會自動驗證資料格式與關聯資料是否存在
6. 驗證通過後即可完成匯入

> ⚠️ **注意事項**：
> - JSON 檔案必須為陣列格式 `[{...}, {...}]`
> - 必填欄位不可為空
> - 關聯資料（如議員、政黨、議會屆期等）必須事先建立

---

## 匯入項目類型

### 1. 縣市議員 (Councilor)

匯入縣市議員基本資料。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `name` | ✅ | string | 議員姓名 |
| `slug` | ✅ | string | 唯一識別碼（用於網址） |
| `imageLink` | ❌ | string | 議員照片連結 |
| `externalLink` | ❌ | string | 外部連結 |
| `meetingTermCount` | ❌ | number | 任期屆數 |
| `meetingTermCountInfo` | ❌ | string | 任期屆數說明 |

#### JSON 範例

```json
[
  {
    "name": "王小明",
    "slug": "wang-xiao-ming",
    "imageLink": "https://example.com/photo.jpg",
    "externalLink": "https://council.gov.tw/member/123",
    "meetingTermCount": 3,
    "meetingTermCountInfo": "第 1、2、3 屆"
  },
  {
    "name": "李小華",
    "slug": "li-xiao-hua",
    "imageLink": "https://example.com/photo2.jpg",
    "externalLink": null,
    "meetingTermCount": 1,
    "meetingTermCountInfo": "第 3 屆"
  }
]
```

---

### 2. 議員屆資 (CouncilMember)

匯入議員在各屆議會的資料。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `councilor_name` | ❌ | string | 議員姓名（僅供參考） |
| `councilor_slug` | ✅ | string | 議員 slug（須存在於系統） |
| `party_slug` | ✅ | string | 政黨 slug（須存在於系統） |
| `councilMeeting_term` | ✅ | number | 議會屆期 |
| `type` | ✅ | string | 議員類型，[見限制值](#議員類型-type) |
| `constituency` | ❌ | number | 選區編號 |
| `city` | ✅ | string | 縣市代碼，[見限制值](#縣市代碼-city) |
| `administrativeDistrict` | ❌ | array | 行政區陣列，[見限制值](#行政區-administrativedistrict) |
| `tooltip` | ❌ | string | 提示文字 |
| `note` | ❌ | string | 備註 |
| `proposalSuccessCount` | ❌ | number | 提案成功數 |
| `relatedLink` | ❌ | array | 相關連結陣列，[見格式說明](#相關連結-relatedlink) |

#### JSON 範例

```json
[
  {
    "councilor_name": "王小明",
    "councilor_slug": "wang-xiao-ming",
    "party_slug": "dpp",
    "councilMeeting_term": 3,
    "type": "constituency",
    "constituency": 1,
    "city": "taipei",
    "administrativeDistrict": ["zhongzheng-dist", "datong-dist"],
    "tooltip": "第一選區",
    "note": "",
    "proposalSuccessCount": 15,
    "relatedLink": [
      {
        "url": "https://council.gov.tw/member/123",
        "label": "議會個人頁面"
      }
    ]
  }
]
```

---

### 3. 議案資料 (CouncilBill)

匯入議案資料。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `slug` | ✅ | string | 議案唯一識別碼 |
| `councilMeeting_city` | ✅ | string | 議會所屬縣市，[見限制值](#縣市代碼-city) |
| `councilMeeting_term` | ✅ | number | 議會屆期 |
| `councilor_slug` | ✅ | array | 議員 slug 陣列（須存在於系統） |
| `date` | ✅ | string | 日期（ISO 8601 格式） |
| `title` | ✅ | string | 議案標題 |
| `summary` | ❌ | string | 議案摘要 |
| `content` | ❌ | string | 議案內容 |
| `attendee` | ❌ | string | 出席者 |
| `sourceLink` | ❌ | string | 資料來源連結 |

> ⚠️ **注意**：`councilor_slug` 陣列中的每位議員必須已有該屆期的「議員屆資」資料

#### JSON 範例

```json
[
  {
    "slug": "taipei-3-bill-001",
    "councilMeeting_city": "taipei",
    "councilMeeting_term": 3,
    "councilor_slug": ["wang-xiao-ming", "li-xiao-hua"],
    "date": "2024-03-15",
    "title": "關於改善社區公園設施之提案",
    "summary": "建議市府編列預算改善社區公園設施",
    "content": "## 提案背景\n\n本市社區公園設施老舊，亟需改善。\n\n## 提案內容\n\n1. 更新兒童遊樂設施\n2. 增設無障礙設施\n3. 改善照明設備\n\n## 預期效益\n\n提升市民休閒品質，打造**友善城市**環境。",
    "attendee": "王小明、李小華",
    "sourceLink": "https://council.gov.tw/bill/001"
  }
]
```

---

### 4. 縣市議題 (CouncilTopic)

匯入縣市議題資料。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `title` | ✅ | string | 議題名稱 |
| `slug` | ✅ | string | 唯一識別碼 |
| `city` | ✅ | string | 所屬縣市，[見限制值](#縣市代碼-city) |
| `type` | ✅ | string | 議題類型，[見限制值](#議題類型-type) |
| `relatedTwreporterArticle` | ❌ | array | 相關報導者文章，[見格式說明](#相關報導者文章-relatedtwreporterarticle) |
| `relatedCouncilBill` | ❌ | array | 相關議案 slug 陣列（須存在於系統） |

#### JSON 範例

```json
[
  {
    "title": "社會住宅政策",
    "slug": "taipei-social-housing",
    "city": "taipei",
    "type": "twreporter",
    "relatedTwreporterArticle": [
      {
        "type": "www-article",
        "slug": "social-housing-policy-2024"
      }
    ],
    "relatedCouncilBill": [
      "taipei-3-bill-001",
      "taipei-3-bill-002"
    ]
  },
  {
    "title": "交通建設議題",
    "slug": "taipei-traffic",
    "city": "taipei",
    "type": "general",
    "relatedTwreporterArticle": [],
    "relatedCouncilBill": []
  }
]
```

---

### 5. 縣市議題－立法院相關議題關聯

建立縣市議題與立法院議題的關聯。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `councilTopic_title` | ❌ | string | 縣市議題標題（僅供參考） |
| `councilTopic_slug` | ✅ | string | 縣市議題 slug（須存在於系統） |
| `legislativeTopic_slug` | ✅ | array | 立法院議題 slug 陣列（須存在於系統） |

#### JSON 範例

```json
[
  {
    "councilTopic_title": "社會住宅政策",
    "councilTopic_slug": "taipei-social-housing",
    "legislativeTopic_slug": [
      "housing-justice",
      "urban-renewal"
    ]
  }
]
```

---

### 6. 縣市議題－縣市議會相關議題關聯

建立不同縣市間的議題關聯。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `councilTopic_title` | ❌ | string | 縣市議題標題（僅供參考） |
| `councilTopic_slug` | ✅ | string | 縣市議題 slug（須存在於系統） |
| `relatedCouncilTopic_slug` | ✅ | array | 相關縣市議題 slug 陣列（須存在於系統） |

> ⚠️ **注意**：`relatedCouncilTopic_slug` 不可包含與 `councilTopic_slug` 相同的值

#### JSON 範例

```json
[
  {
    "councilTopic_title": "社會住宅政策",
    "councilTopic_slug": "taipei-social-housing",
    "relatedCouncilTopic_slug": [
      "new-taipei-social-housing",
      "taoyuan-social-housing"
    ]
  }
]
```

---

### 7. 縣市議題－同縣市議會相關議題關聯

建立同一縣市內的議題關聯。

#### 欄位說明

| 欄位名稱 | 必填 | 類型 | 說明 |
|---------|------|------|------|
| `councilTopic_title` | ❌ | string | 縣市議題標題（僅供參考） |
| `councilTopic_slug` | ✅ | string | 縣市議題 slug（須存在於系統） |
| `relatedCityCouncilTopic_slug` | ✅ | array | 同縣市相關議題 slug 陣列（須存在於系統） |

> ⚠️ **注意**：`relatedCityCouncilTopic_slug` 不可包含與 `councilTopic_slug` 相同的值

#### JSON 範例

```json
[
  {
    "councilTopic_title": "社會住宅政策",
    "councilTopic_slug": "taipei-social-housing",
    "relatedCityCouncilTopic_slug": [
      "taipei-urban-renewal",
      "taipei-rent-subsidy"
    ]
  }
]
```

---

## 欄位值限制說明

### 縣市代碼 (city)

以下為系統接受的縣市代碼：

| 代碼 | 縣市名稱 |
|------|---------|
| `taipei` | 台北市 |
| `keelung` | 基隆市 |
| `new-taipei` | 新北市 |
| `lienchiang` | 連江縣 |
| `yilan` | 宜蘭縣 |
| `hsinchu-city` | 新竹市 |
| `hsinchu-county` | 新竹縣 |
| `taoyuan` | 桃園市 |
| `miaoli` | 苗栗縣 |
| `taichung` | 台中市 |
| `changhua` | 彰化縣 |
| `nantou` | 南投縣 |
| `chiayi-city` | 嘉義市 |
| `chiayi-county` | 嘉義縣 |
| `yunlin` | 雲林縣 |
| `tainan` | 台南市 |
| `kaohsiung` | 高雄市 |
| `penghu` | 澎湖縣 |
| `kinmen` | 金門縣 |
| `pingtung` | 屏東縣 |
| `taitung` | 台東縣 |
| `hualien` | 花蓮縣 |

詳細資訊請參考[city](https://github.com/twreporter/congress-dashboard-monorepo/blob/master/packages/shared/src/constants/city.ts)

---

### 議員類型 (type)

議員屆資的 `type` 欄位只接受以下值：

| 值 | 說明 |
|----|------|
| `constituency` | 區域 |
| `highland-aboriginal` | 山地原住民 |
| `lowland-aboriginal` | 平地原住民 |

詳細資訊請參考[council-member](https://github.com/twreporter/congress-dashboard-monorepo/blob/master/packages/shared/src/constants/council-member.ts)

---

### 議題類型 (type)

縣市議題的 `type` 欄位只接受以下值：

| 值 | 說明 |
|----|------|
| `general` | 基本議題 |
| `twreporter` | 精選議題（報導者編輯） |

---

### 行政區 (administrativeDistrict)

行政區必須為陣列格式，且陣列內的值必須為對應縣市的有效行政區代碼。

#### 台北市行政區範例

```json
["zhongzheng-dist", "datong-dist", "zhongshan-dist", "songshan-dist", "daan-dist", "wanhua-dist", "xinyi-dist", "shilin-dist", "beitou-dist", "neihu-dist", "nangang-dist", "wenshan-dist"]
```

> 💡 每個縣市的行政區代碼不同，請參考系統內的 [city-district](https://github.com/twreporter/congress-dashboard-monorepo/blob/master/packages/shared/src/constants/city-district.ts) 常數定義。

---

### 相關連結 (relatedLink)

`relatedLink` 必須為陣列格式，陣列內每個物件須包含 `url` 和 `label` 兩個欄位：

```json
[
  {
    "url": "https://example.com",
    "label": "連結說明文字"
  }
]
```

---

### 相關報導者文章 (relatedTwreporterArticle)

`relatedTwreporterArticle` 必須為陣列格式，陣列內每個物件須包含 `type` 和 `slug` 兩個欄位：

| 欄位 | 說明 |
|------|------|
| `type` | 只能是 `www-article`（文章）或 `www-topic`（專題） |
| `slug` | 報導者文章或專題的 slug |

```json
[
  {
    "type": "www-article",
    "slug": "article-slug-here"
  },
  {
    "type": "www-topic",
    "slug": "topic-slug-here"
  }
]
```

---

## 常見錯誤訊息

| 錯誤訊息 | 說明 |
|---------|------|
| `JSON 檔案格式錯誤或資料為空` | 上傳的檔案不是有效的 JSON 陣列格式 |
| `缺少欄位 XXX` | JSON 物件缺少必要的欄位 |
| `必填欄位 "XXX" 為空` | 必填欄位的值為空 |
| `找不到 slug 為 "XXX" 的議員` | 議員資料尚未建立，請先匯入議員 |
| `找不到 slug 為 "XXX" 的政黨` | 政黨資料尚未建立 |
| `city 欄位值 "XXX" 非有效的縣市代碼` | 縣市代碼錯誤 |
| `找不到 XXX 市第 X 屆的議會` | 該縣市屆期的議會資料尚未建立 |

---

## 建議的匯入順序

由於資料間有關聯性，建議按以下順序匯入：

1. **政黨資料**（需透過 CMS 手動建立或其他匯入方式）
2. **議會資料**（需透過 CMS 手動建立）
3. **縣市議員** (Councilor)
4. **議員屆資** (CouncilMember)
5. **議案資料** (CouncilBill)
6. **縣市議題** (CouncilTopic)
7. **議題關聯**（可依需求選擇匯入）
   - 立法院相關議題關聯
   - 縣市議會相關議題關聯
   - 同縣市議會相關議題關聯
