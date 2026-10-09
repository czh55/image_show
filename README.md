# Image Show

把自己精选的照片进行编辑式排版，做成个人图片画廊。通过 GitHub Pages 托管。

对齐 `history_draw` / `daily-design`：`docs/` 放网站，Actions 部署 Pages。

## 项目结构

```
image_show/
├── docs/                         # GitHub Pages 源
│   ├── index.html                # 画廊首页
│   ├── photos.json               # 作品与系列索引
│   ├── assets/                   # 样式与脚本
│   ├── images/                   # 上线用图片（可先用占位 SVG）
│   └── .nojekyll
├── raw/                          # 原始大图（默认不入库）
├── .github/workflows/
│   └── deploy-pages.yml
└── README.md
```

## 本地预览

```bash
cd ~/Projects/image_show
python3 -m http.server 8080 --directory docs
# 打开 http://localhost:8080
```

## 添加照片

1. 将优化后的图片放入 `docs/images/`（建议 webp/jpg，单张控制体积）
2. 原始大图可放 `raw/`（已被 gitignore）
3. 在 `docs/photos.json` 增加条目：`id` / `series` / `title` / `src` / `aspect` 等
4. 需要新系列时，同步改 `series` 数组

## 部署到 GitHub Pages

1. 推送到 `main`
2. 仓库 **Settings → Pages** → Source 选 **GitHub Actions**
3. 等待 `Deploy GitHub Pages` workflow 完成

网站地址（推送成功并跑完 Actions 后）：

- `https://czh55.github.io/image_show/`
- 若账号已绑自定义域：`http://chenzhiheng.cn/image_show/`

本地已就绪；若 `git push` / `gh` 因网络卡住，属正常现象。稍后在 GitHub 网页新建空仓库 `czh55/image_show`，再推送并启用 Pages（workflow 已就绪）：

```bash
cd ~/Projects/image_show
git remote add origin https://github.com/czh55/image_show.git
git push -u origin main
```
