---
id: module-12-development-cicd-and-deployment-12-02-05-Deployment-with-GithubActions-Set-up-SnowCLI-Dockerized
title: Dockerized SnowCLI Deployment
---

# 🚀 Snowflake Deployment Guide with GitLab

This guide explains how to **automate Snowflake deployments** using **GitLab CI/CD** and **SnowSQL**.  
It also includes a **multi-environment example (Dev → UAT → Prod)** to ensure smooth and safe deployments across all stages.

---

##  1️⃣ Prerequisites

✅ **SnowSQL installed**  
✅ **Snowflake user account** with roles/privileges  
✅ **GitLab repository** with a `deploy/` directory containing your SQL scripts (e.g., `deploy/deploy.sql`)  
✅ **GitLab CI/CD variables** set for secure credentials

---

##  2️⃣ Example SQL Script

Here’s a simple deployment script, **`deploy/deploy.sql`**:

```sql
USE ROLE SYSADMIN;
USE DATABASE MY_DATABASE;
USE SCHEMA PUBLIC;

-- Example DDL
CREATE OR REPLACE TABLE my_table (
  id INT,
  name STRING
);

-- Example DML
INSERT INTO my_table (id, name) VALUES (1, 'example');
````

---

##  3️⃣ Basic .gitlab-ci.yml (Single Environment)

For a **single environment** (e.g., Dev only):

```yaml
stages:
  - deploy

deploy:
  stage: deploy
  image: alpine:3.18
  before_script:
    - apk update && apk add --no-cache bash curl
    - curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    - bash snowsql-1.2.24-linux_x86_64.bash
  script:
    - snowsql -a $SNOWSQL_ACCOUNT -u $SNOWSQL_USER -p $SNOWSQL_PWD -r SYSADMIN -d MY_DATABASE -s PUBLIC -f deploy/deploy.sql -o exit_on_error=true
  only:
    - main
```

✅ **Environment variables** to define in **GitLab → Settings → CI/CD → Variables**:

* `SNOWSQL_ACCOUNT`
* `SNOWSQL_USER`
* `SNOWSQL_PWD`

---

##  4️⃣ Multi-Environment Example (Dev → UAT → Prod)

Here’s an **enhanced** `.gitlab-ci.yml` for **multi-environment deployments**:

```yaml
stages:
  - deploy_dev
  - deploy_uat
  - deploy_prod

variables:
  SNOWSQL_ROLE: "SYSADMIN"
  SNOWSQL_DATABASE: "MY_DATABASE"
  SNOWSQL_SCHEMA: "PUBLIC"

# Dev Deployment
deploy_dev:
  stage: deploy_dev
  image: alpine:3.18
  environment:
    name: development
  before_script:
    - apk update && apk add --no-cache bash curl
    - curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    - bash snowsql-1.2.24-linux_x86_64.bash
  script:
    - snowsql -a $SNOWSQL_ACCOUNT_DEV -u $SNOWSQL_USER_DEV -p $SNOWSQL_PWD_DEV -r $SNOWSQL_ROLE -d $SNOWSQL_DATABASE -s $SNOWSQL_SCHEMA -f deploy/deploy.sql -o exit_on_error=true
  only:
    - develop

# UAT Deployment
deploy_uat:
  stage: deploy_uat
  image: alpine:3.18
  environment:
    name: uat
  before_script:
    - apk update && apk add --no-cache bash curl
    - curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    - bash snowsql-1.2.24-linux_x86_64.bash
  script:
    - snowsql -a $SNOWSQL_ACCOUNT_UAT -u $SNOWSQL_USER_UAT -p $SNOWSQL_PWD_UAT -r $SNOWSQL_ROLE -d $SNOWSQL_DATABASE -s $SNOWSQL_SCHEMA -f deploy/deploy.sql -o exit_on_error=true
  only:
    - uat

# Prod Deployment
deploy_prod:
  stage: deploy_prod
  image: alpine:3.18
  environment:
    name: production
  before_script:
    - apk update && apk add --no-cache bash curl
    - curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    - bash snowsql-1.2.24-linux_x86_64.bash
  script:
    - snowsql -a $SNOWSQL_ACCOUNT_PROD -u $SNOWSQL_USER_PROD -p $SNOWSQL_PWD_PROD -r $SNOWSQL_ROLE -d $SNOWSQL_DATABASE -s $SNOWSQL_SCHEMA -f deploy/deploy.sql -o exit_on_error=true
  only:
    - main
```

✅ **Branch-based triggers**:

* `develop` branch → **Dev**
* `uat` branch → **UAT**
* `main` branch → **Prod**

✅ **Separate credentials for each environment**:

* Dev: `SNOWSQL_ACCOUNT_DEV`, `SNOWSQL_USER_DEV`, `SNOWSQL_PWD_DEV`
* UAT: `SNOWSQL_ACCOUNT_UAT`, `SNOWSQL_USER_UAT`, `SNOWSQL_PWD_UAT`
* Prod: `SNOWSQL_ACCOUNT_PROD`, `SNOWSQL_USER_PROD`, `SNOWSQL_PWD_PROD`

✅ **Environment dashboards** in GitLab for visibility and deployment history.

---

##  5️⃣ Optional: Manual Approval for Production

To ensure **extra safety in production**, add manual gating:

```yaml
deploy_prod:
  stage: deploy_prod
  image: alpine:3.18
  environment:
    name: production
  before_script:
    - apk update && apk add --no-cache bash curl
    - curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    - bash snowsql-1.2.24-linux_x86_64.bash
  script:
    - snowsql -a $SNOWSQL_ACCOUNT_PROD -u $SNOWSQL_USER_PROD -p $SNOWSQL_PWD_PROD -r $SNOWSQL_ROLE -d $SNOWSQL_DATABASE -s $SNOWSQL_SCHEMA -f deploy/deploy.sql -o exit_on_error=true
  only:
    - main
  when: manual
```

✅ This requires a **manual confirmation** before production deployment proceeds.

---

##  6️⃣ CI/CD Variable Setup

✅ In **GitLab → Settings → CI/CD → Variables**, create:
🔐 For **Dev**:

* `SNOWSQL_ACCOUNT_DEV`
* `SNOWSQL_USER_DEV`
* `SNOWSQL_PWD_DEV`

🔐 For **UAT**:

* `SNOWSQL_ACCOUNT_UAT`
* `SNOWSQL_USER_UAT`
* `SNOWSQL_PWD_UAT`

🔐 For **Prod**:

* `SNOWSQL_ACCOUNT_PROD`
* `SNOWSQL_USER_PROD`
* `SNOWSQL_PWD_PROD`

✅ Mark passwords as **Protected** and **Masked** for security.

---

##  7️⃣ Benefits of Multi-Environment Setup

✅ Safer deployments — **Dev → UAT → Prod**
✅ Branch-based safety and visibility
✅ Clear **audit trail** of who deployed when and where
✅ Avoids accidental overwrites in Prod
✅ GitLab’s **Environments dashboard** helps track deployments

---

##  8️⃣ Summary

✅ Basic pipeline for a **single environment**
✅ **Multi-environment** example (Dev → UAT → Prod)
✅ **Manual approvals** for Prod
✅ **Secure variables** for credentials
✅ **Deployments automated and auditable** with GitLab!

---

### 🚀 Next Steps

Would you like me to:
✅ Create a **visual diagram** for this pipeline?
✅ Provide rollback job examples?
✅ Integrate **unit tests** or **SQL linting** in the pipeline?

Let me know how you’d like to customize this further! 🚀

