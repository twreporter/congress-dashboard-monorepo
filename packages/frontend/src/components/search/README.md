## 前情提要

目前系統的搜尋功能是使用第三方服務 [Algolia](https://dashboard.algolia.com/) 實作。
可以使用帳號 `developer@twreporter.org` 登入 Algolia dashboard（密碼與 OTP 請見 1Password）。

在 Algolia 上，我們有兩個應用（Applications）：

- `staging-lawmaker`：對應 staging 環境資料
- `prod-lawmaker`：對應 production 環境資料

---

## 搜尋索引

每個應用使用以下七個索引（indices）。搜尋欄位以版本控制中的設定檔為準：

| 索引 | 資料類型 | 搜尋欄位 |
| --- | --- | --- |
| `legislator` | 立委 | 姓名（`name`） |
| `councilor` | 議員 | 姓名（`name`） |
| `topic` | 立法院議題 | 議題名稱（`name`）、說明（`desc`） |
| `council-topic` | 議會議題 | 議題名稱（`name`）、說明（`desc`） |
| `speech` | 立法院發言全文 | 立委姓名（`legislatorName`）、摘要（`summary`）、標題（`title`） |
| `council-speech` | 議會發言全文 | 全部關聯議員姓名（`councilorNames`）、摘要（`summary`）、標題（`title`） |
| `council-bill` | 議會議案 | 標題（`title`）、提案人（`councilor`）、摘要（`summary`） |

「發言全文」是搜尋結果的類型名稱；兩種發言索引都不搜尋逐字稿內文 `content`。
議會發言每筆逐字稿是一筆結果，卡片顯示全部關聯議員，連到 `/council/a/{slug}`。
沒有摘要或議員時省略對應資訊，不依 `speechGroup` 合併結果。

資料同步方式與議員最新發言日期的計算，請見 [CLI 文件](../../../../cli/README.md#feed-algolia-council)。

---

## 搜尋範圍與呈現

| 搜尋範圍 | Tabs | 「全部」的載入順序 |
| --- | --- | --- |
| 立法院與六都議會 | 全部 | 立委 → 議員 → 立法院議題 → 議會議題 → 立法院發言全文 → 議會發言全文 → 議會議案 |
| 立法院 | 全部、發言全文 | 立委 → 立法院議題 → 發言全文 |
| 六都議會或單一議會 | 全部、發言全文、議案 | 議員 → 議會議題 → 發言全文 → 議案 |

「全部」依類型分階段載入，不跨類型按日期或相關性混合排序。
議會發言與議案 tabs 沿用六都／單一縣市篩選；立法院發言 tab 提供屆期與會期篩選。
搜尋框的即時建議只包含立委、議員、立法院議題與議會議題，不包含發言或議案。

---

## 索引設定管理

這些索引的設定（configuration）可以透過 Algolia dashboard 查看與編輯。

**初期建置時是手動透過 Web UI 設定，但為了提升維護效率與團隊協作，建議後續避免直接修改 `prod-lawmaker` 的設定。**

建議的流程如下：

1. 在 `staging-lawmaker` 上透過 dashboard UI 調整設定。
2. 使用 `@algolia/cli` CLI 工具，匯出該 index 的設定檔。
3. 將變更後的設定 JSON 檔提交 PR，讓其他工程師審查。
4. 確認無誤後，再使用 CLI 套用到 `prod-lawmaker` 上。

- 註：因為不確定 configuration 的改動頻率為何，初期先不建置 CI/CD 等自動部署，如果之後改動頻繁，可以考慮建置自動化部署。

### 新索引上線順序

1. 在 staging 建立索引並套用對應設定，確認 CLI write key 與 frontend search key 可存取該索引。
2. 依 [CLI 操作說明](../../../../cli/README.md)同步資料，確認姓名、標題或摘要等預期欄位可以搜尋。
3. 部署使用新索引的前端，完成下方驗收；避免前端先查詢尚未建立的索引。
4. 確認 staging 結果後，再依相同順序上線 production。

索引設定與資料同步是兩個獨立步驟，部署 frontend 不會自動完成這些操作。
遠端設定及資料寫入應由具權限的操作人員執行。

### 本機測試與驗收

本機 frontend 可透過 `packages/frontend/.env.local` 的 `NEXT_PUBLIC_ALGOLIA_APP_ID`
與 `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` 讀取 staging 索引；只使用 search-only key，
不要將 write key 放入 `NEXT_PUBLIC_*`。若使用獨立測試 application，須準備搜尋範圍內的全部索引。
完整搜尋需要 Algolia 中已有資料；CLI dry-run 不會建立索引資料。
點進逐字稿頁時會讀取 CMS，因此 frontend 的 CMS 資料來源也應包含對應紀錄。

驗收時確認：

- 手機與桌面的 tab 順序、六都／單一城市篩選正確。
- 切換範圍及關鍵字後結果重置，前置類型無結果時仍可載入後續類型。
- 更多結果、姓名高亮與逐字稿連結正常，多位議員的姓名皆可搜尋。
- 更新議員索引後，最新發言日期與 CMS 的 `speech.date` 一致；無發言時不顯示日期。

---

## `@algolia/cli` 安裝與使用

### 安裝

```bash
# 安裝 Algolia CLI 工具（全域或專案內）
yarn add @algolia/cli
```

### 使用方式

#### 匯出 index 設定

```bash
yarn algolia getsettings -a <ALGOLIA_APP_ID> -k <ALGOLIA_API_KEY> -n <INDEX_NAME>
```

#### 套用 index 設定

```bash
yarn algolia setsettings -a <ALGOLIA_APP_ID> -k <ALGOLIA_API_KEY> -n <INDEX_NAME> -s <SOURCE_FILEPATH>
```

`<ALGOLIA_APP_ID>` 與 `<ALGOLIA_API_KEY>` 可以在 Algolia dashboard 的  
**Settings > Team and Access > API Keys** 頁面找到。

---

## 資料夾結構

```
algolia-config/
  ├── staging/
  │   ├── legislator.settings.json
  │   ├── councilor.settings.json
  │   ├── topic.settings.json
  │   ├── council-topic.settings.json
  │   ├── speech.settings.json
  │   ├── council-speech.settings.json
  │   └── council-bill.settings.json
  └── prod/
      ├── legislator.settings.json
      ├── councilor.settings.json
      ├── topic.settings.json
      ├── council-topic.settings.json
      ├── speech.settings.json
      ├── council-speech.settings.json
      └── council-bill.settings.json
```
