## 前情提要

目前系統的搜尋功能是使用第三方服務 [Algolia](https://dashboard.algolia.com/) 實作。
可以使用帳號 `developer@twreporter.org` 登入 Algolia dashboard（密碼與 OTP 請見 1Password）。

在 Algolia 上，我們有兩個應用（Applications）：
- `staging-lawmaker`：對應 staging 環境資料
- `prod-lawmaker`：對應 production 環境資料

---

## 三個搜尋索引：`legislator`、`topic`、`speech`

根據搜尋功能需求，我們在每個應用中建立了三個索引（indices）：
- `legislator`（立委）
- `topic`（議題）
- `speech`（發言全文）

這些索引的設定（configuration）可以透過 Algolia dashboard 查看與編輯。

**初期建置時是手動透過 Web UI 設定，但為了提升維護效率與團隊協作，建議後續避免直接修改 `prod-lawmaker` 的設定。**

建議的流程如下：

1. 在 `staging-lawmaker` 上透過 dashboard UI 調整設定。
2. 使用 `@algolia/cli` CLI 工具，匯出該 index 的設定檔。
3. 將變更後的設定 JSON 檔提交 PR，讓其他工程師審查。
4. 確認無誤後，再使用 CLI 套用到 `prod-lawmaker` 上。

- 註：因為不確定 configuration 的改動頻率為何，初期先不建置 CI/CD 等自動部署，如果之後改動頻繁，可以考慮建置自動化部署。

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
  ├── staging/legislator.settings.json   # staging 的立委索引設定
  ├── staging/topic.settings.json        # staging 的議題索引設定
  ├── staging/speech.settings.json       # staging 的發言全文索引設定 
  ├── prod/legislator.settings.json      # prod 的立委索引設定
  ├── prod/topic.settings.json           # prod 的議題索引設定
  └── prod/speech.settings.json
```

