---
id: module-12-development-cicd-and-deployment-12-02-02-Deployment-with-GithubActions-Set-up-SnowCLI-in-Local
title: Set up Snow CLI in Local
---

# 🚀 Snowflake CI/CD Deployment using SnowCLI & GitHub Actions

To test **SnowCLI** locally, follow this **step-by-step guide**.

---

## 🐍 1. Install Python (Prerequisite)

SnowCLI requires Python 3.8+. Check installation:

```bash
python3 --version
```

**If not installed:**

- **macOS:**  
```bash
brew install python
```

- **Ubuntu/Linux:**  
```bash
sudo apt update
sudo apt install python3 python3-pip -y
```

---

## ⚡ 2. Install SnowCLI

```bash
pip3 install --upgrade pip
pip3 install snowflake-cli-labs
```

### 📝 About `snowflake-cli-labs`

- Python-based CLI for running, debugging, and deploying Snowflake scripts  
- Supports SQL, Snowpark, stored procedures, and apps (e.g., Streamlit)  
- Ideal for automation and CI/CD pipelines  
- Streamlines Snowflake DevOps workflows
- Open-source and licensed under the Apache 2.0 License, meaning it's free to use, modify, and distribute. However, support is provided on a best-effort basis by the project contributors 
-  In October 2024, Snowflake officially migrated the snowflake-cli-labs PyPI repository to the new snowflake-cli repository, reflecting its transition to a more stable and supported tool

**Check installation:**

```bash
snow --version
```

Expected output:

```
Snowflake CLI version: 3.11.0
```

---

## 🔌 3. Snowflake Connection Profile Setup

| Tool      | Config File                     |
|----------|---------------------------------|
| SnowCLI  | `~/.snowflake/config.toml`      |
| SnowSQL  | `~/.snowsql/config` (INI format)|

---

### 3.1 SnowCLI – `config.toml`

```bash
mkdir -p ~/.snowflake
```

Create `config.toml`:

```toml
[connections.default]
account    = "BDXRNPG-JN71181"
user       = "SFTRAINING"
password   = "GoodSuperluck2025"
role       = "ACCOUNTADMIN"
warehouse  = "COMPUTE_WH"
database   = "CICD_DEV_EMP_DB"
schema     = "CICD_DEV_EMP_DB_SCH"
authenticator = "snowflake"
```

Secure it:

```bash
chmod 600 ~/.snowflake/config.toml
```

> SnowCLI expects either a **connection profile** or **environment variables**.

---

### 3.2 SnowSQL – `config` (INI)

```ini
[connections.dev]
accountname   = BDXRNPG-JN71181
username      = SFTRAINING
password      = GoodSuperluck2025
rolename      = ACCOUNTADMIN
warehousename = COMPUTE_WH
dbname        = EMP_DB_DEV
schemaname    = EMP_DB_DEV_SCH

[connections.uat]
accountname   = BDXRNPG-JN71181
username      = SFTRAINING
password      = GoodSuperluck2025
rolename      = ACCOUNTADMIN
warehousename = COMPUTE_WH
dbname        = EMP_DB_UAT
schemaname    = EMP_DB_UAT_SCH
```

- Supports multiple environments (DEV/ UAT/ PROD)  
- Can execute `!source` to include other SQL scripts

---

## ✅ 4. Test SnowCLI Connection

```bash
snow sql --connection default --query "SELECT current_version();"
```

Expected output:

```
SELECT current_version();
+-------------------+
| CURRENT_VERSION() |
|-------------------|
| 9.28.1            |
+-------------------+
```

---

## 🗂️ 5. Organize Scripts Locally

After successful testing (✅ connection working, ✅ able to run SQL), structure your **SQL scripts**:

- Keep scripts organized by type (tables, views, procedures)  
- Execute them in a defined order  
- Mirror the same structure in **GitHub** for CI/CD

> **Important:** Keep the **same folder structure** locally and in GitHub.

---

### 5.1 Local → GitHub → Deployment Flow

```
            💻 Local Machine
            ┌───────────────────────────┐
            │ SnowCLI Testing           │
            │ - Run SQL scripts         │
            │ - Validate connection     │
            └───────────────┬───────────┘
                            │
                            ▼
            🌿 GitHub Repository
            ┌───────────────────────────┐
            │ Organized Scripts         │
            │ - scripts/                │
            │ - rollback/               │
            │ - .github/workflows/      │
            └───────────────┬───────────┘
                            │
                            ▼
            ⚙️ CI/CD Deployment
            ┌───────────────────────────┐
            │ GitHub Actions Workflow   │
            │ - Picks scripts           │
            │ - Runs SnowCLI/SnowSQL    │
            └───────────────────────────┘
```

---

### 5.2 Example Git Repository Structure

# 📂 Create Snowflake CI/CD Project Structure in local

Run the following commands in your terminal to create the folder structure and placeholder files:

```bash
# Create scripts directories
mkdir -p scripts/procedures scripts/tables scripts/views

# Create placeholder SQL files
touch scripts/procedures/create_procs.sql
touch scripts/tables/employees.sql
touch scripts/views/create_views.sql

# Create deploy directory and main deploy script
mkdir -p deploy
touch deploy/main_deploy.sql

# Create rollback directory and rollback script
mkdir -p rollback
touch rollback/rollback.sql

# Create GitHub workflows directory and workflow file
mkdir -p .github/workflows
touch .github/workflows/deploy-to-snowflake.yml

# Create README file
touch README.md
```

✅ After running these commands, your project structure will look like this:

```
sf-deployment-cli/
├── scripts/
│   ├── procedures/
│   │   └── create_procs.sql
│   ├── tables/
│   │   └── employees.sql
│   ├── views/
│   │   └── create_views.sql
├── deploy/
│   └── main_deploy.sql
├── rollback/
│   └── rollback.sql
├── .github/
│   └── workflows/
│       └── deploy-to-snowflake.yml
└── README.md
```


- **scripts/** → SQL objects  
- **rollback/** → Rollback scripts  
- **.github/workflows/** → CI/CD workflows  
- **README.md** → Documentation

---

## 🏃 6. Run Deployment Scripts Locally ⚙️

**SnowCLI (direct SQL only):**

```bash
snow sql -c default -f scripts/tables/employees.sql
```

Output:

```
create or replace table employees (
    emp_id int,
    first_name string,
    last_name string,
    hire_date date,
    salary number(10,2),
    doj  date
);
+---------------------------------------+
| status                                |
|---------------------------------------|
| Table EMPLOYEES successfully created. |
+---------------------------------------+

```

> Works because the file contains **direct SQL**.

**Important:** `!source` statements **fail in local SnowCLI**:

```bash
snow sql -c default -f scripts/main_deploy.sql
```

Error:

```
001003 (42000): SQL compilation error: syntax error line 1 at position 0 unexpected '!'
```

Reason: `!source` is **specific to SnowSQL**.

---

## ⚠️ 7. Why `!source` Works in GitHub Workflow but Fails Locally

### Local SnowCLI

```bash
snow sql -c default -f scripts/main_deploy.sql
```

- Interprets file as **pure SQL**  
- `!source` is invalid → ❌ Error  

### GitHub Actions

```yaml
- name: Run Snowflake Deployment
  run: snow sql -c default -f scripts/main_deploy.sql
```

**Why it works:**

1. ✅ **Working directory matches repo structure**  
2. ✅ CI/CD workflow may **run scripts sequentially**  
3. ✅ Sometimes SnowSQL is used in the container for `!source`  

> Key: SnowCLI does not natively support `!source`; GitHub workflow environment makes it appear to work.

---

### Recommended CI/CD Approach

```yaml
- name: Run tables
  run: snow sql -c default -f scripts/tables/employees.sql

- name: Run views
  run: snow sql -c default -f scripts/views/create_views.sql

- name: Run procedures
  run: snow sql -c default -f scripts/procedures/create_procs.sql
```

✅ Works locally and in CI/CD  
✅ Avoids SnowCLI `!source` errors  
✅ Explicit order ensures predictable deployment

---

## 🔄 8. SnowCLI vs SnowSQL – Config & Usage

| Feature / Command         | SnowCLI (`snow sql`)      | SnowSQL (`snowsql`)                   |
| ------------------------- | ------------------------ | ------------------------------------ |
| Purpose                   | CI/CD pipelines, scripting | Local dev, multi-file deployments   |
| Config file               | `~/.snowflake/config.toml` | `~/.snowsql/config` (INI)           |
| Connection profile        | `[connections.default]`  | `[connections.<name>]`               |
| Supports `!source`        | ❌ No                    | ✅ Yes                               |
| Environment variables     | ✅ Yes                   | ✅ Yes                               |
| Direct SQL execution      | ✅ Yes                   | ✅ Yes                               |
| Multiple scripts via `-f` | ✅ Yes                   | ✅ Yes                               |

---

### 8.1 Quick Usage Examples

**SnowCLI – Direct SQL only**

```bash
snow sql -c default -f scripts/tables/employees.sql
```

Fails with `!source`:

```bash
snow sql -c default -f scripts/main_deploy.sql
# ❌ Syntax error: unexpected '!'
```

**SnowSQL – Supports `!source`**

```bash
snowsql -c dev -f scripts/main_deploy.sql -o exit_on_error=true
```


✅ SnowSQL for `!source`  
✅ SnowCLI for CI/CD automation with sequential `-f` calls

---

## 📝 9. Deployment Script Structure Example

```sql
-- main_deploy.sql

-- Create tables
!source scripts/tables/employees.sql

-- Create views
!source scripts/views/create_views.sql

-- Create procedures
!source scripts/procedures/create_procs.sql
```
