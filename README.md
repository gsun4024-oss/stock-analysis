# 股识 StockWise — 智能股票分析平台

> 融合 AI 技术 × 投资大师智慧，读懂市场，智慧投资

一个支持 A 股与美股的智能股票分析网站，结合道氏理论、波浪理论、价值投资等经典理论，运用量化模型分析涨跌走势，提供短期预测参考。

## ✨ 功能特色

| 功能 | 说明 |
|------|------|
| **K 线图分析** | 基于 TradingView Lightweight Charts，支持 MA、EMA、MACD、RSI、布林带、KDJ 等 10+ 技术指标 |
| **AI 智能预测** | 基于量化模型综合分析趋势、动能、波动率，给出短期价格预测与支撑/阻力位 |
| **A 股 + 美股** | 同时支持沪深 A 股（.SS/.SZ）与美股市场，一站式查询分析 |
| **投资理论库** | 融合 10 大经典投资理论与 6 位投资大师的核心思想 |
| **趋势分析** | 自动识别强势上涨/下跌/横盘等趋势，给出置信度评分 |

## 🎨 设计风格

**樱花渐变轻盈风** — 以玫瑰粉 `#E8728A` 为主色，薰衣草紫 `#9B7FD4` 为辅色，毛玻璃卡片效果，符合女性审美的专业金融界面。

## 📚 理论体系

### 技术分析
- **道氏理论** — 查尔斯·道（1900年代）
- **艾略特波浪理论** — 拉尔夫·纳尔逊·艾略特（1930年代）
- **量化投资理论** — 詹姆斯·西蒙斯（1980年代至今）

### 基本面分析
- **价值投资理论** — 本杰明·格雷厄姆（1930-1970年代）
- **护城河投资理论** — 沃伦·巴菲特（1960年代至今）
- **成长股投资理论** — 彼得·林奇（1970-1990年代）

### 行为金融
- **反身性理论** — 乔治·索罗斯（1980年代至今）
- **选美理论** — 约翰·梅纳德·凯恩斯（1930年代）

### 宏观经济
- **有效市场假说** — 尤金·法玛（1960年代）
- **全天候投资组合** — 瑞·达利欧（1990年代至今）

## 🛠 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 4 + 自定义 CSS
- **图表**: TradingView Lightweight Charts v5
- **动画**: Framer Motion
- **路由**: Wouter
- **数据**: Yahoo Finance API（通过 Manus Data API 代理）

---

## 🚀 GitHub Pages 部署指南

### 方法一：自动部署（推荐）

本项目已配置 GitHub Actions 自动部署工作流，只需以下步骤：

#### 第一步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **"+"** → **"New repository"**
3. 仓库名填写：`stock-analysis`（或自定义名称）
4. 选择 **Public**（GitHub Pages 免费版需要公开仓库）
5. 点击 **"Create repository"**

#### 第二步：修改仓库名配置

如果你的仓库名**不是** `stock-analysis`，需要修改 `vite.github.config.ts`：

```typescript
// 将此处改为你的实际仓库名
const REPO_NAME = "你的仓库名";
```

如果使用 `username.github.io` 格式的仓库（个人主页），改为：
```typescript
const REPO_NAME = "";  // 空字符串，base 将为 "/"
```

#### 第三步：推送代码到 GitHub

```bash
# 在项目根目录执行
git init
git add .
git commit -m "feat: 初始化股识 StockWise 股票分析平台"
git branch -M main
git remote add origin https://github.com/你的用户名/stock-analysis.git
git push -u origin main
```

#### 第四步：启用 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择 **"GitHub Actions"**
3. 保存后，GitHub Actions 会自动触发构建

#### 第五步：访问网站

构建完成后（约 2-3 分钟），访问：
```
https://你的用户名.github.io/stock-analysis/
```

---

### 方法二：手动部署

如果不想使用 GitHub Actions，可以手动构建并推送：

```bash
# 1. 安装依赖
pnpm install

# 2. 构建 GitHub Pages 版本
pnpm run build:github

# 3. 将 dist-github 目录内容推送到 gh-pages 分支
# 安装 gh-pages 工具
npm install -g gh-pages

# 推送到 gh-pages 分支
gh-pages -d dist-github
```

然后在仓库 Settings → Pages 中，Source 选择 **"Deploy from a branch"**，Branch 选择 **"gh-pages"**。

---

## 💡 配置 API 密钥（可选）

本项目使用 Yahoo Finance 数据，通过 Manus Data API 代理。如果你有 Manus API 密钥：

1. 在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 Secrets：
   - `VITE_FRONTEND_FORGE_API_KEY`：你的 API 密钥
   - `VITE_FRONTEND_FORGE_API_URL`：API 端点 URL

---

## 📱 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本（Manus 部署）
pnpm build

# 构建 GitHub Pages 版本
pnpm run build:github
```

---

## ⚠️ 免责声明

本网站提供的所有股票分析、趋势判断、价格预测均**仅供学习参考**，不构成任何投资建议。股票投资有风险，入市需谨慎，请根据自身风险承受能力做出独立投资决策。

---

*股识 StockWise — 让每一位投资者都能读懂市场*
