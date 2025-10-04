---
id: module-12-development-cicd-and-deployment-12-03-Deployment-with-GithubActions-Schemachange
title: Deployment with Schemachange
---

# 🚀 Snowflake CI/CD Deployment using Schemachange & GitHub Actions

---

## 📌 1. Introduction

In **Snowflake**, deployment means executing **SQL changes in a controlled, versioned, and repeatable way**.  

[**Schemachange**](https://github.com/Snowflake-Labs/schemachange) enables this by managing database migrations, similar to **Flyway** or **Liquibase**, but tailored for Snowflake.

### ✅ Why Schemachange for CI/CD?
- Tracks migration history automatically  
- Enforces strict **ordered execution** using change IDs  
- Works seamlessly with Git + GitHub Actions  
- Reduces manual intervention and risks  
- Ensures **versioned and auditable** deployments  

Typical promotion:  
**Development → Testing/UAT → Production**

---

## 📌 2. Example Git Repository Structure

```

sf-deployment-schemachange/
│
├── migrations/
│   ├── V1.0.0\_\_create\_employees\_table.sql
│   ├── V1.0.1\_\_create\_sales\_view\.sql
│   └── V1.0.2\_\_add\_proc\_calculate\_bonus.sql
│
├── rollback/
│   └── R1.0.2\_\_drop\_proc\_calculate\_bonus.sql
│
├── schemachange-config/
│   └── config.yml
│
├── .github/
│   └── workflows/
│       └── deploy-to-snowflake\_schemachange.yml
│
└── README.md

````

### 🔑 Best Practices
- Use sequential naming (`V1.0.0__...`, `V1.0.1__...`) for versioned migrations  
- Store rollback scripts in `rollback/`  
- Keep migrations atomic (one logical change per file)  
- Always maintain **change history table** in a utility database  

---

## 📌 3. Schemachange Configuration

### Step 1 – Create `config.yml`
Example (`schemachange-config/config.yml`):

```yaml
root_folder: ./migrations
modules_folder: ./modules
snowflake_account: ".snowflakecomputing.com"
snowflake_user: ""
snowflake_password: ""
snowflake_role: "SCHEMACHANGE_DEPLOYER"
snowflake_warehouse: "COMPUTE_WH"
snowflake_database: "DEV_DB"
snowflake_schema: "PUBLIC"
change_history_table: "UTIL_DB.CHANGE_HISTORY"
````

⚠️ **Do NOT commit credentials** — inject from **GitHub Secrets**.

### Step 2 – Test Locally

```bash
schemachange -f schemachange-config/config.yml --dry-run
```

---

## 📌 4. Writing Change Scripts

Example `V1.0.0__create_employees_table.sql`:

```sql
CREATE OR REPLACE TABLE employees (
    id INT,
    name STRING,
    department STRING,
    hire_date DATE
);
```

### Script Prefix Types in Schemachange

| Prefix | Meaning    | Behavior                                                                | Example                    |
| ------ | ---------- | ----------------------------------------------------------------------- | -------------------------- |
| **V**  | Versioned  | Run **once**, ordered by version number                                 | `V1.0.0__create_table.sql` |
| **R**  | Repeatable | Run again **if checksum changes** (safe to run multiple times)          | `R__update_views.sql`      |
| **A**  | Always     | Run **every time**, regardless of changes (e.g., grants, stats refresh) | `A__grant_permissions.sql` |

### Execution Order

1. **Versioned (V)** scripts – strictly ordered, only once
2. **Repeatable (R)** scripts – rerun on checksum change
3. **Always (A)** scripts – run every execution

📌 **Naming convention:**
`[Prefix][Version(if applicable)]__Description.sql`

---

## 📌 5. Running Schemachange Locally

```bash
schemachange \
  -f schemachange-config/config.yml \
  --snowflake-account $SNOWFLAKE_ACCOUNT \
  --snowflake-user $SNOWFLAKE_USER \
  --snowflake-password $SNOWFLAKE_PASSWORD \
  --snowflake-role $SNOWFLAKE_ROLE \
  --snowflake-warehouse $SNOWFLAKE_WAREHOUSE \
  --snowflake-database $SNOWFLAKE_DATABASE \
  --snowflake-schema $SNOWFLAKE_SCHEMA
```

✅ Use **environment variables** for credentials, never hardcode.

---

## 📌 6. GitHub Actions – Schemachange Deployment

### Example Workflow

```yaml
name: Deploy to Snowflake (schemachange)

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install schemachange
        run: pip install schemachange

      - name: Generate connections.toml
        run: |
          cat << EOF > connections.toml
          [ci_connection]
          account = "${{ secrets.SNOWFLAKE_ACCOUNT }}"
          user = "${{ secrets.SNOWFLAKE_USER }}"
          password = "${{ secrets.SNOWFLAKE_PASSWORD }}"
          role = "${{ secrets.SNOWFLAKE_ROLE }}"
          warehouse = "${{ secrets.SNOWFLAKE_WAREHOUSE }}"
          database = "${{ secrets.SNOWFLAKE_DATABASE }}"
          schema = "${{ secrets.SNOWFLAKE_SCHEMA }}"
          EOF
          chmod 600 connections.toml

      - name: Run schemachange
        run: |
          schemachange \
            -f ./migrations \
            --connection-name ci_connection \
            --connections-file-path ./connections.toml \
            --create-change-history-table
```

---

## 📌 7. Setting GitHub Secrets

Go to **Repository → Settings → Secrets and variables → Actions** and add:

* `SNOWFLAKE_ACCOUNT`
* `SNOWFLAKE_USER`
* `SNOWFLAKE_PASSWORD`
* `SNOWFLAKE_ROLE`
* `SNOWFLAKE_WAREHOUSE`
* `SNOWFLAKE_DATABASE`
* `SNOWFLAKE_SCHEMA`

---

## 📌 8. Rollback Strategy

Rollback scripts live in `rollback/`:

Example `R1.0.0__drop_employees_table.sql`:

```sql
DROP TABLE IF EXISTS employees;
```

### Best Practices for Rollback

* Always **pair a rollback script** with each migration
* Ensure rollback scripts are **tested in DEV** before UAT/Prod
* Add **rollback job** in CI/CD for failed prod deployments
* For destructive DDL, consider **backups** (`CREATE TABLE AS SELECT ...`)

---

## 📌 9. Best Practices for Freshers

1. ❌ Never commit plain-text credentials
2. ✅ Test migrations in **DEV** before UAT/PROD
3. ✅ Keep migrations **small & modular**
4. ✅ Always provide rollback scripts
5. ✅ Follow strict **versioned file naming**
6. ✅ Enforce **Pull Requests & Code Reviews**
7. ✅ Monitor deployments via **CHANGE\_HISTORY** table

---


