---
description: 如何创建新功能分支并提交代码
---

# 创建新功能分支并提交代码

## 步骤

1. 确保在 main 分支并拉取最新代码

```bash
git checkout main
git pull origin main
```

2. 创建新的功能分支

```bash
git checkout -b feature/your-feature-name
```

3. 开发功能并提交

```bash
# 开发你的功能...

# 格式化代码
npm run format

# 检查构建
npm run build

# 提交代码
git add .
git commit -m "feat: your feature description"
```

4. 推送到远程仓库

```bash
git push origin feature/your-feature-name
```

5. 在 GitHub 上创建 Pull Request

- 访问仓库页面
- 点击 "Compare & pull request"
- 填写 PR 描述
- 提交 PR

6. 等待审核并合并

- 解决所有评论
- 审核通过后合并到 main

7. 清理本地分支

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```
