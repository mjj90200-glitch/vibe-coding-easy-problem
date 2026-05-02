# 🧮 口算小练习

面向小学生的 **50~100 以内加减法** 在线练习工具。随机出题，即时批改，帮助提升心算速度。

## 预览

打开浏览器后的界面 — 题目以卡片网格排列，填写答案后一键提交批改。

```
┌───────────────────────────────────────┐
│        🧮 口算小练习                    │
│   📝 题数 [10]  🎯 类型 [加减混合]     │
│                    [✨ 生成题目]        │
├─────────────────┬─────────────────────┤
│  🔵加法          │  🟣减法             │
│  25 + 31 = ?    │  79 - 12 = ?       │
│  [ __ ]        │  [ __ ]            │
├─────────────────┴─────────────────────┤
│ 📝 共 10 题  ✅ 正确 8  ❌ 错误 2  80% │
│         [✅ 提交答案] [🔄 换一题]       │
└───────────────────────────────────────┘
```

## 项目结构

```
口算练习/
├── backend/
│   └── server.js          # Node.js 后端（零外部依赖）
├── frontend/
│   └── index.html         # 前端页面（HTML + CSS + JS 一体）
├── .gitignore
└── README.md
```

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/mjj90200-glitch/vibe-coding-easy-problem.git
cd vibe-coding-easy-problem

# 启动服务
cd backend
node server.js
```

浏览器打开 **http://localhost:8000** 即可使用。

> 无需 `npm install`，Node.js 内置模块即可运行。

## 功能

| 功能 | 说明 |
|------|------|
| 随机出题 | 50~100 以内的加减法，加法结果 ∈ [50, 100]，减法被减数 ∈ [50, 100] |
| 题型选择 | 加法 / 减法 / 加减混合 |
| 数量控制 | 1~50 题可调 |
| 批量答题 | 所有题目在同一页面，填写后统一提交 |
| 即时批改 | 提交后立刻显示 ✅ 正确 / ❌ 错误，错题标注正确答案 |
| 统计反馈 | 正确数、错误数、正确率一目了然 |
| 键盘支持 | 按 Enter 键提交答案 |
| 响应式 | 手机和平板也可使用 |

## API 文档

| 端点 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/api/generate` | GET | `count` (1~50), `types` (add/sub/both) | 生成一组题目 |
| `/api/types` | GET | — | 返回支持的题型 |

### 请求示例

```bash
curl "http://localhost:8000/api/generate?count=5&types=both"
```

### 响应示例

```json
{
  "problems": [
    {
      "id": "005e251d",
      "type": "add",
      "operand1": 25,
      "operand2": 31,
      "operator": "+",
      "answer": 56
    },
    {
      "id": "856433a8",
      "type": "sub",
      "operand1": 79,
      "operand2": 12,
      "operator": "-",
      "answer": 67
    }
  ],
  "total": 2
}
```

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 后端 | Node.js `http` 模块 | 零外部依赖，纯标准库 |
| 前端 | HTML + CSS + JavaScript | 单页应用，无需构建工具 |
| 通信 | RESTful JSON | 前后端通过 Fetch API 交互 |

## 扩展指南

- **添加乘法/除法** → 在 `server.js` 的 `generateAddition()` 旁加 `generateMultiplication()` 函数，然后修改 `/api/generate` 的参数和前端选项
- **调整难度** → 修改 `randomInt()` 的 min/max 参数
- **保存成绩** → 接入 `localStorage` 或后端数据库
- **换皮肤** → 修改 `index.html` 的 CSS 变量（`:root` 块）
- **部署到公网** → 用 `nginx` 反向代理，或直接部署到 Vercel / Railway
