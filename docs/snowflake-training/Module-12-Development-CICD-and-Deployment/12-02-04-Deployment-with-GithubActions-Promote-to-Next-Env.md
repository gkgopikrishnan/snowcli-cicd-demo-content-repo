---
id: module-12-development-cicd-and-deployment-12-02-04-Deployment-with-GithubActions-Promote-to-Next-Env
title: Promote to Higer environment
---
***

## 🚀 Promote Code to UAT Environment

Follow these steps to cleanly promote code from the development branch to the UAT branch, ensuring every environment is up-to-date and changes are traceable.

***

### 🌿 Synchronize and Prepare Dev & UAT Branches

- 📥 **Fetch and merge the latest development changes:**

  ```bash
  git fetch origin
  git merge origin/emp_dev_main
  ```

- 🔄 **Switch to Dev branch and ensure it's updated:**

  ```bash
  git checkout emp_dev_main
  git pull origin emp_dev_main
  ```

- 🌱 **Create UAT branch if it doesn’t exist:**

  ```bash
  git checkout -b emp_uat_main
  git push -u origin emp_uat_main
  ```

- 🛠️ **Switch to UAT branch and pull latest changes:**

  ```bash
  git checkout emp_uat_main
  git pull origin emp_uat_main
  ```

***

### ⬆️ Promote Dev Changes Into UAT

- 🌟 **Merge development changes into the UAT branch (with a clear message):**

  ```bash
  git merge --no-ff origin/emp_dev_main -m "Promote emp_dev_main → emp_uat_main"
  ```

- 🚀 **Push updated UAT branch to remote:**

  ```bash
  git push origin emp_uat_main
  ```

***

## ⚙️ 📝 Sample GitHub Actions Workflow for UAT

This workflow will automatically deploy updates from the `emp_uat_main` branch to your Snowflake UAT environment. **Always use GitHub Secrets for all Snowflake credentials**:

***

`deploy-to-snowflake-uat.yml`:

```yaml
name: Deploy to Snowflake UAT (SnowCLI)

on:
  push:
    branches:
      - emp_uat_main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python & Install SnowCLI
        run: |
          python3 -m pip install --upgrade pip
          pip install snowflake-cli-labs
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Create Snowflake config.toml
        run: |
          mkdir -p ~/.snowflake
          cat <<'EOF' > ~/.snowflake/config.toml
          [connections.default]
          account   = "${{ secrets.SNOWFLAKE_ACCOUNT_UAT }}"
          user      = "${{ secrets.SNOWFLAKE_USER_UAT }}"
          password  = "${{ secrets.SNOWFLAKE_PASSWORD_UAT }}"
          role      = "${{ secrets.SNOWFLAKE_ROLE_UAT }}"
          warehouse = "${{ secrets.SNOWFLAKE_WAREHOUSE_UAT }}"
          database  = "${{ secrets.SNOWFLAKE_DATABASE_UAT }}"
          schema    = "${{ secrets.SNOWFLAKE_SCHEMA_UAT }}"
          EOF
          chmod 600 ~/.snowflake/config.toml

      - name: Run Snowflake Deployment
        run: |
          snow sql -c default -f scripts/main_deploy.sql -o exit-on-error=true
```

***

- 🔐 **Ensure all Snowflake UAT environment credentials are set as GitHub secrets** (`SNOWFLAKE_ACCOUNT_UAT`, etc.).  
- 📂 **Use a dedicated workflow file (e.g., `deploy-to-snowflake-uat.yml`) for UAT deployments**.  
- ✅ Test deployment in UAT before promoting to PROD for safe, auditable release cycles.  