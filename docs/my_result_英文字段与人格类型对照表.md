# /user/my_result 英文字段与人格类型对照表

- 数据来源：**测试环境数据库** `smartx_waitlist`（52.77.244.19:13306），读取时间 2026-08-28（第 2 版，同步运营改名）
- 涉及表：`quiz_personas`、`persona_relations`
- 代码来源：`constants/waitlistConstants.js`（dimensions / attributes 中英名）、`config/waitlistConfig.js`（personaImageMap）
- 组装逻辑：`service/resultService.js` → `buildPublicResultView()`；出口：`endpoint/user_app.js` → `GET /user/my_result`

> ⚠️ 结论先行：测试库里 `description_en` / `roast_en` / `color_tag` **9 个人格全部为 NULL**（种子未补录），
> 接口按 `|| ''` 兜底下发为空串 `""`。其余英文字段（`nameEn`、`dimensions[].nameEn`、`sideNameEn`、
> `attributes[].nameEn`、`bestMatch.nameEn`、`naturalRival.nameEn`）均有值。

---

## 1. my_result 解锁态里所有 en 字段一览

| 字段路径 | 来源 | 测试环境状态 |
| --- | --- | --- |
| `nameEn` | `quiz_personas.name_en` | ✅ 9 条齐全（见第 2 节） |
| `descriptionEn` | `quiz_personas.description_en` | ❌ 全部 NULL → 下发 `""` |
| `roastEn` | `quiz_personas.roast_en` | ❌ 全部 NULL → 下发 `""` |
| `colorTag`（非 en，但同批待补录） | `quiz_personas.color_tag` | ❌ 全部 NULL → 下发 `""` |
| `dimensions[].nameEn` | 常量 `dimensionOrder` | ✅ 3 条（见第 3 节） |
| `dimensions[].sideNameEn` | 常量 `dimensionSideNames`（按结果的 side 取） | ✅ 6 个端点（见第 3 节） |
| `attributes[].nameEn` | 常量 `attributeDefs` | ✅ 3 条（见第 4 节） |
| `bestMatch.nameEn` | `persona_relations.best_match_id` → `quiz_personas.name_en` | ✅ 9 条（见第 2 节） |
| `naturalRival.nameEn` | `persona_relations.natural_rival_id` → `quiz_personas.name_en` | ✅ 9 条（见第 2 节） |

---

## 2. 人格类型全表（9 款：8 常规 + 1 隐藏）

| personaId | nameEn | nameZh | risk_side | decision_side | mode_side | is_hidden | descriptionEn | roastEn | colorTag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LQD | The Liquidity Donor | 送钱者 | degen | gut | pack | 0 | *(空)* | *(空)* | *(空)* |
| AIM | The All-In Mystic | 梭哈仙人 | degen | gut | lone | 0 | *(空)* | *(空)* | *(空)* |
| SIG | The Send-It Strategist | 喊单军师 | degen | data | pack | 0 | *(空)* | *(空)* | *(空)* |
| CND | The Candle Prophet | K线教主 | degen | data | lone | 0 | *(空)* | *(空)* | *(空)* |
| DIP | The Dip Ringleader | 抄底带头大哥 | sniper | gut | pack | 0 | *(空)* | *(空)* | *(空)* |
| DOC | The Vibes Doctor | 行情老中医 | sniper | gut | lone | 0 | *(空)* | *(空)* | *(空)* |
| CHN | The Onchain Paparazzi | 链上侦探 | sniper | data | pack | 0 | *(空)* | *(空)* | *(空)* |
| LMT | The Limit Sniper | 潜伏狙击手 | sniper | data | lone | 0 | *(空)* | *(空)* | *(空)* |
| RSK | The Risk Monk | 风控大师 | *(NULL)* | *(NULL)* | *(NULL)* | 1 | *(空)* | *(空)* | *(空)* |

> RSK 三维为 NULL：隐藏款由规则命中覆盖，不参与三维组合唯一索引。

### 2.1 人格英文名 × 三维端点英文名（判型口径）

| personaId | nameEn | Risk posture | Decision basis | Trading mode |
| --- | --- | --- | --- | --- |
| LQD | The Liquidity Donor | Degen | Gut | Pack |
| AIM | The All-In Mystic | Degen | Gut | Lone |
| SIG | The Send-It Strategist | Degen | Data | Pack |
| CND | The Candle Prophet | Degen | Data | Lone |
| DIP | The Dip Ringleader | Sniper | Gut | Pack |
| DOC | The Vibes Doctor | Sniper | Gut | Lone |
| CHN | The Onchain Paparazzi | Sniper | Data | Pack |
| LMT | The Limit Sniper | Sniper | Data | Lone |
| RSK | The Risk Monk | — | — | — |

### 2.2 搭档 / 天敌（bestMatch / naturalRival 的英文名）

| personaId | nameEn | bestMatch | bestMatch.nameEn | naturalRival | naturalRival.nameEn |
| --- | --- | --- | --- | --- | --- |
| LQD | The Liquidity Donor | DIP | The Dip Ringleader | LMT | The Limit Sniper |
| AIM | The All-In Mystic | DOC | The Vibes Doctor | CHN | The Onchain Paparazzi |
| SIG | The Send-It Strategist | CHN | The Onchain Paparazzi | DOC | The Vibes Doctor |
| CND | The Candle Prophet | LMT | The Limit Sniper | DIP | The Dip Ringleader |
| DIP | The Dip Ringleader | LQD | The Liquidity Donor | CND | The Candle Prophet |
| DOC | The Vibes Doctor | AIM | The All-In Mystic | SIG | The Send-It Strategist |
| CHN | The Onchain Paparazzi | SIG | The Send-It Strategist | AIM | The All-In Mystic |
| LMT | The Limit Sniper | CND | The Candle Prophet | LQD | The Liquidity Donor |
| RSK | The Risk Monk | CHN | The Onchain Paparazzi | LQD | The Liquidity Donor |

### 2.3 人格卡片图（imageUrl，配置写死，测试图后缀 `_test`）

| personaId | imageUrl |
| --- | --- |
| LQD | https://static.smartx.io/waitlist/lqd_test.png |
| AIM | https://static.smartx.io/waitlist/aim_test.png |
| SIG | https://static.smartx.io/waitlist/sig_test.png |
| CND | https://static.smartx.io/waitlist/cnd_test.png |
| DIP | https://static.smartx.io/waitlist/dip_test.png |
| DOC | https://static.smartx.io/waitlist/doc_test.png |
| CHN | https://static.smartx.io/waitlist/chn_test.png |
| LMT | https://static.smartx.io/waitlist/lmt_test.png |
| RSK | https://static.smartx.io/waitlist/rsk_test.png |

---

## 3. dimensions：三维判型（有序 0/1/2）

| id | key | nameEn | nameZh | 负向端 side | 负向 sideNameEn | 正向端 side | 正向 sideNameEn |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | risk | Risk posture | 风险姿态 | sniper | Sniper | degen | Degen |
| 1 | decision | Decision basis | 决策依据 | gut | Gut | data | Data |
| 2 | mode | Trading mode | 交易模式 | lone | Lone | pack | Pack |

### 3.1 sideNameEn 全量映射

| side | sideNameEn | sideNameZh |
| --- | --- | --- |
| sniper | Sniper | 狙击 |
| degen | Degen | 梭哈 |
| gut | Gut | 直觉 |
| data | Data | 数据 |
| lone | Lone | 独行 |
| pack | Pack | 群体 |

---

## 4. attributes：三项属性（有序 0/1/2）

| id | key | nameEn | nameZh |
| --- | --- | --- | --- |
| 0 | conviction | Conviction | 信仰 |
| 1 | instinct | Instinct | 嗅觉 |
| 2 | resilience | Resilience | 复原力 |

---

## 5. 待办

- [ ] 运营补录 `quiz_personas` 的 `description_en` / `description_zh` / `roast_en` / `roast_zh` / `color_tag`（9 条），否则结果卡片这几项恒为 `""`。
- [ ] 上线前将 `personaImageMap` 的 `*_test.png` 换成正式图。

---

## 6. 变更记录

### 2026-08-28 第 2 版（运营在测试库直接改名，`update_at` 09:30）

| personaId | 字段 | 旧值 | 新值 |
| --- | --- | --- | --- |
| SIG | name_en | The Signal General | The Send-It Strategist |
| DOC | name_en | The Market Doctor | The Vibes Doctor |
| CHN | name_en | The Onchain Detective | The Onchain Paparazzi |

- 仅 `name_en` 变化；`name_zh`、三维 side、`is_hidden`、`persona_relations` 均未动。
- `description_*` / `roast_*` / `color_tag` 9 条**仍全部为 NULL**，接口继续下发 `""`（第 5 节待办未解除）。
- ⚠️ 改名后需删 redis 人格缓存才会立刻生效：`DEL smartxwaitlistquiz_personas:v1`（TTL 24h，见 `service/quizService.js:68`）。
- ⚠️ `docs/sql/smartx_waitlist_init.sql:304` 的种子 INSERT 仍是旧名，新环境初始化会带回旧文案，定稿后需同步。
