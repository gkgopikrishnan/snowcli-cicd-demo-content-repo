---
id: module-12-development-cicd-and-deployment-12-04-Deployment-with-DBT
title: Deployment with DBT
---

# 🚀 Snowflake Deployment Guide

This guide covers **how to deploy SQL code** (like tables, views, procedures, etc.) into a Snowflake environment, including how to **integrate with Git** and use **SnowSQL** for deployments.

---

## 1️⃣ Deployment Overview

In Snowflake, deployment typically means **executing SQL scripts** that:

✅ Create/modify database objects (tables, views, procedures, UDFs).  
✅ Populate or refresh data.  
✅ Configure security and access controls.

---

## 2️⃣ Storing Deployment Scripts in Git

### ✅ Why Use Git?
- **Version control** – Track changes and maintain history.
- **Collaboration** – Enable teamwork with code reviews and merge control.
- **Auditability** – Know who changed what and when.

### ✅ Example Repo Structure
```

my-repo/
├── deploy/
│   ├── deploy.sql
│   ├── 001\_create\_tables.sql
│   ├── 002\_create\_views.sql
│   ├── 003\_create\_procs.sql
└── .gitignore

````

- **deploy.sql**: An orchestrator script that **calls** individual SQL scripts in order.

---

## 3️⃣ Fetching Scripts from Git

✅ Deployment scripts should be **cloned or pulled** from the Git repository to your target environment (like a deployment server or CI/CD pipeline agent).

```bash
git clone https://github.com/myorg/my-repo.git
````

or, in a CI/CD pipeline:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

---



---

## 5️⃣ How SnowSQL Executes the SQL

✅ The `-f deploy.sql` parameter:
SnowSQL **reads the SQL file** line by line and **sends the statements to Snowflake** for execution.

✅ Example of **deploy.sql**:

```sql
-- deploy.sql
-- Create tables
!source 001_create_tables.sql;

-- Create views
!source 002_create_views.sql;

-- Create procedures
!source 003_create_procs.sql;
```

✅ `!source` is a SnowSQL command to include **other SQL scripts**.

---

## 6️⃣ Deployment Flow Example

Here’s a typical **deployment flow** using CI/CD:

1️⃣ **Checkout code from Git**:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

2️⃣ **Install SnowSQL (if needed)**:

```yaml
- name: Install SnowSQL
  run: |
    curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.24-linux_x86_64.bash
    bash snowsql-1.2.24-linux_x86_64.bash
```

3️⃣ **Run deployment script**:

```yaml
- name: Run SnowSQL deploy script
  run: |
    snowsql -a myaccount -u myuser -f deploy/deploy.sql -o exit_on_error=true
```

---

## 🟦 7️⃣ Best Practices

✅ **Use a dedicated deployment role** (e.g., `DEPLOYER`) with minimum required privileges.
✅ **Test scripts in a dev environment** before deploying to production.
✅ **Keep scripts modular** – separate `CREATE TABLE`, `CREATE VIEW`, and `GRANT` statements.
✅ Use **transaction blocks** for critical scripts:

```sql
BEGIN;
-- your DDL/DML
COMMIT;
```

✅ Monitor deployments using **Snowflake’s Query History**.

---

## 8️⃣ Roles & Privileges

🔑 To run deployment scripts:

* **CREATE/ALTER privileges** on the target schema/database.
* **USAGE privileges** on the database and schema.
* **OWNERSHIP privileges** if modifying critical objects.

Typical role: `SYSADMIN` or a custom `DEPLOYER` role with appropriate rights.

---

## 🟦 9️⃣ Advantages

✅ Centralized version control via Git.
✅ Repeatable deployments – run the same script multiple times in different environments.
✅ Auditability of deployment changes.
✅ Easy rollback – revert to previous script versions if needed.

---

## 🟦 🔷 Disadvantages

❌ Human error if scripts are not properly tested.
❌ Risk of data loss if `DROP` or `DELETE` statements are misused.
❌ No built-in transactional rollback for certain DDL operations (some DDL auto-commits).
❌ Manual step for Git clone unless automated in CI/CD.

---

## 🟦 🔷 Use Case Example

A retail company’s analytics team regularly **deploys new dashboards** and views in Snowflake.
They:

* Store the deployment scripts in **Git**.
* Use **GitHub Actions** to automate deployments to **development**, then **staging**, then **production**.
* Use **SnowSQL** to execute the `deploy.sql` script in each environment.

✅ This ensures **consistent deployments** with minimal risk of human error.

---

## 🟦 🔷 Impact on Performance Tuning

* Deployment itself **doesn’t directly impact performance**, but:

  * Scripts that create/modify large tables **can** cause temporary spikes in warehouse usage.
  * Using **transaction blocks** minimizes the impact of partial deployments.
  * Deployments done during **low-traffic hours** help maintain performance for users.

---

## 🟦 🔷 Conclusion

Snowflake deployments using SnowSQL and Git provide a **structured, auditable, and repeatable** way to manage database objects.

✅ **Steps:**
1️⃣ Store scripts in Git
2️⃣ Clone to target environment
3️⃣ Run `snowsql -f deploy.sql`
4️⃣ Monitor and validate

✅ **Tip**: Integrate into CI/CD for **automated, reliable deployments** across environments!

---

# 🔷 Comparison of CI/CD Tools for Snowflake Deployments

| Feature / Tool                      | **GitHub Actions**                                                                                 | **GitLab CI/CD**                                                               | **Azure DevOps Pipelines**                                                       | **Jenkins**                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Integration with Git**            | ✅ Built-in for GitHub repositories<br/>✅ Automatic triggers for commits/PRs                        | ✅ Built-in for GitLab repositories<br/>✅ Automatic triggers                    | ✅ Built-in for Azure Repos<br/>✅ Supports GitHub and other repos via connectors  | ✅ Supports all Git-based repositories (GitHub, GitLab, Bitbucket, etc.)<br/>✅ Webhooks or polling for triggers |
| **Ease of Setup**                   | ⭐⭐⭐⭐ (native for GitHub users)<br/>👨‍💻 Minimal YAML config                                       | ⭐⭐⭐⭐ (native for GitLab users)<br/>👨‍💻 Uses `.gitlab-ci.yml`                 | ⭐⭐⭐⭐ (native for Azure users)<br/>👨‍💻 Uses YAML pipelines or classic UI        | ⭐⭐⭐ (requires plugins and some setup)<br/>👨‍🔧 Highly flexible but more work                                  |
| **Secrets Management**              | ✅ GitHub Secrets (secure)                                                                          | ✅ GitLab CI/CD Variables (secure)                                              | ✅ Azure Key Vault & Pipeline secrets                                             | ✅ Credentials plugin & external vaults (HashiCorp Vault, etc.)                                                 |
| **Runner/Agent Model**              | 🏃 GitHub-hosted runners or self-hosted runners                                                    | 🏃 GitLab runners (shared or self-hosted)                                      | 🏃 Microsoft-hosted agents or self-hosted agents                                 | 🏃 Self-hosted Jenkins agents/nodes (can be cloud or on-prem)                                                  |
| **Built-in Deployment Templates**   | ✅ Marketplace with pre-made actions (e.g., `actions/checkout`)                                     | ✅ Built-in CI/CD templates for deploys                                         | ✅ Built-in task templates for deploys                                            | ❌ None built-in, but community-shared pipelines                                                                |
| **Typical Deployment to Snowflake** | 1️⃣ YAML workflow in `.github/workflows/deploy.yml`<br/>2️⃣ Checkout, install SnowSQL, run scripts | 1️⃣ `.gitlab-ci.yml` defines stages<br/>2️⃣ Checkout, run SnowSQL commands     | 1️⃣ YAML pipeline or classic pipeline<br/>2️⃣ Tasks to run SnowSQL scripts       | 1️⃣ Freestyle or Pipeline jobs<br/>2️⃣ Groovy-based DSL (declarative or scripted)                              |
| **Ease of Rollback**                | 🔄 Easy – revert commits, re-trigger workflow                                                      | 🔄 Easy – revert commits or pipeline runs                                      | 🔄 Easy – revert commits, re-run pipeline                                        | 🔄 Manual or scripted rollbacks depending on pipeline logic                                                    |
| **Audit Trail**                     | ✅ Logs in Actions tab<br/>✅ Linked to commits/PRs                                                  | ✅ Pipeline history<br/>✅ Linked to commits/MRs                                 | ✅ Run history<br/>✅ Linked to commits                                            | ✅ Build logs<br/>✅ Job history                                                                                 |
| **Pricing / Hosting**               | 💰 Free tier for public & private repos<br/>💰 Paid for extra minutes / runners                    | 💰 Free for public and some private repos<br/>💰 Paid tiers for more resources | 💰 Free basic tier for small teams<br/>💰 Paid for scaling & enterprise features | 💰 Free (self-hosted) but requires hardware<br/>💰 Paid plugins for some advanced features                     |
| **Customizability**                 | ⚙️ Flexible with Marketplace actions<br/>⚙️ YAML-based control                                     | ⚙️ Flexible with `.gitlab-ci.yml`<br/>⚙️ Good for mono-repos & microservices   | ⚙️ Flexible with YAML or classic UI<br/>⚙️ Integrated with Azure ecosystem       | ⚙️ Extremely flexible (Groovy DSL)<br/>⚙️ Many plugins for custom needs                                        |

---
