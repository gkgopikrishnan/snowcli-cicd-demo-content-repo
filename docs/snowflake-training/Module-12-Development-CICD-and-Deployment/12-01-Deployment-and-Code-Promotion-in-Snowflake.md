---
id: module-12-development-cicd-and-deployment-12-01-Deployment-and-Code-Promotion-in-Snowflake
title: Deployment Overview
---

# 🚀 1. What is Deployment?

**Deployment** is the process of moving code, SQL scripts, and database object changes (like tables, views, procedures) from **Development** to **Production** environments.

In Snowflake, this means:

- Promoting scripts
- Managing environment-specific configurations
- Ensuring safe rollouts of features

---

# 🏗️ 2. Environment Overview: Dev → UAT → Prod

### 🧪 **Development (Dev)**
- 👩‍💻 Developers create and test new code
- ✅ Fast iteration
- ❌ No production data

### 🧪 **User Acceptance Testing (UAT)**
- 👥 Business/QA teams validate changes
- ✅ Stable version
- ✅ May mirror prod data (if compliant)

### 🟩 **Production (Prod)**
- 🚀 Live environment for users
- ✅ Only well-tested, approved changes are deployed

---

# 🔄 3. Code Promotion Strategies in Snowflake

### 🚚 Manual Promotion
- Manual copy-paste of SQL scripts between environments  
- ✅ Good for small teams  
- ❌ Error-prone, lacks audit trails  

### 🤖 Automated Promotion (CI/CD)
- Uses pipelines to test and deploy changes  
- ✅ Fast, consistent, and reliable  

### 💚 Blue-Green Deployment
- Two prod environments (Blue & Green)  
- ✅ Switch traffic to updated one after verification  

### 🐤 Canary Release
- Deploy to a small user group before full rollout  
- ✅ Reduces risk from bugs  

### 🌿 Feature Branch Deployment
- Use Git branches for features  
- Merge after test approval → triggers deployment  

---

# 📌 3. Branch & Promotion Workflow in Snowflake

Snowflake deployments typically follow a **branch-based, PR-driven promotion flow** across environments.

```mermaid
graph TD
    DEV[Dev Branch] -->|Deployed to| DEV_ENV[Snowflake DEV]
    DEV_ENV -->|Multiple features tested| DEV

    DEV -->|PR + Merge| UAT[UAT Branch]
    UAT -->|Deployed to| UAT_ENV[Snowflake UAT]
    UAT_ENV -->|Validated by QA/Business| UAT

    UAT -->|PR + Approval| PROD[Prod Branch]
    PROD -->|Auto Deployment| PROD_ENV[Snowflake PROD]
````

## 🔹 Explanation

* **Dev Branch** → Developers build & test changes locally and in Dev
* **UAT Branch** → Stable, merged changes promoted for QA/business validation
* **Prod Branch** → Final, approved changes promoted into Production

✅ **Key Characteristics:**

* Development happens in **feature branches**
* Integration occurs through **Pull Requests (PRs)**
* **Automated pipelines** handle deployments for each environment
* **No direct pushes to Prod** — everything flows via UAT → Prod

📌 **Benefits:**

* Ensures **quality gates** at every stage
* Provides **auditability** (all changes tied to PRs)
* Reduces production risk with **staged rollouts**

---

# 🧠 4. What is CI/CD?

CI/CD = **Continuous Integration** + **Continuous Delivery/Deployment**

### ✅ **Continuous Integration (CI)**
* Developers push code frequently to Git  
* Code is automatically linted, validated, and tested  

### ✅ **Continuous Delivery (CD)**
* Tested code is prepared for staging/production  
* Requires manual approval to go live  

### ✅ **Continuous Deployment (CD – Extended)**
* Fully automated deployment to production  
* ✅ No human intervention  
* ✅ Requires automated testing & rollback  

---

# 📌 5. High-Level CI/CD Deployment Flow

## 🔹 Flow Diagram

```mermaid
flowchart LR
    A[👨‍💻 Developer] -->|Commit Code| B[📂 GitHub Repository]
    B -->|Trigger Workflow| C[⚡ GitHub Actions + SnowCLI]
    C -->|Deploy| D[❄️ Snowflake DEV]
    D -->|Promotion| E[🧪 Snowflake UAT]
    E -->|Approval & Deploy| F[🏭 Snowflake PROD]
    F -.->|Cycle Restart| A
````

## 🔹 Explanation (Step-by-step)

| Step | Description                                           |
| ---- | ----------------------------------------------------- |
| 1️⃣  | Developer commits changes to GitHub                   |
| 2️⃣  | Workflow is triggered automatically in GitHub Actions |
| 3️⃣  | SnowCLI executes SQL/DDL deployment                   |
| 4️⃣  | Code is deployed to **DEV** environment               |
| 5️⃣  | Once stable, promoted to **UAT** for business testing |
| 6️⃣  | Upon approval, merged & deployed to **PROD**          |
| 7️⃣  | Cycle restarts for the next change                    |



---
# ⚙️ 6. CI/CD Tools for Snowflake

Snowflake doesn’t have native CI/CD, but integrates with:

* 🧰 **SnowSQL** (Legacy CLI)  
* 🚀 **SnowCLI** (Modern CLI)  
* 🛠️ **dbt (Data Build Tool)**  
* 🌱 **Terraform** (Infrastructure as Code)  

### ✅ Common CI/CD Tools

| Tool                    | Use Case                  | Notes                             |
| ----------------------- | ------------------------- | --------------------------------- |
| **GitHub Actions**      | Native GitHub CI/CD       | Ideal for small to medium teams   |
| **GitLab CI/CD**        | Full pipeline support     | Includes environments & approvals |
| **Jenkins**             | Highly customizable       | Plugin-based, enterprise-friendly |
| **Azure DevOps**        | CI/CD for Microsoft stack | Strong integration with Azure     |
| **Bitbucket Pipelines** | Lightweight, Git-based    | Best for Bitbucket users          |
| **CircleCI**            | High-performance CI/CD    | Fast pipelines and parallel jobs  |

---

# 📌 7. Accounts & Permissions

**Snowflake Setup:**
* Dedicated **deployment role** (e.g., `DEPLOYER`)  
* Privileges:  
  * `CREATE` / `ALTER` on target objects  
  * `USAGE` on database/schema  
  * `OWNERSHIP` if modifying existing objects  

---

# 🎯 8. CI/CD Summary Flow Diagram

```mermaid
flowchart TD
    A[Dev Branch] -->|Push triggers workflow| B[Deploy to Snowflake DEV]
    B -->|Merge to UAT| C[Deploy to Snowflake UAT]
    C -->|Merge to Prod| D[Deploy to Snowflake PROD]
    D -->|Validated by users| E[Production Live]
````

✅ Shows the **end-to-end CI/CD pipeline** across environments.

---

# 🛡️ 9. General Best Practices

* Use **distinct database/schema names** per environment
* Store **secrets in GitHub Secrets**, not in code
* Promote only **tested & reviewed code**
* Keep infra-as-code in SQL/dbt
* Track all changes via Git

---

# 🎯 10. Benefits of Multi-Environment CI/CD

✅ **Consistency** – Same scripts deployed everywhere  
✅ **Security** – Credentials managed securely  
✅ **Auditability** – Git + workflow history  
✅ **Speed** – Faster, fewer manual steps  
✅ **Reliability** – Lower production risks  

---

# 📊 11. CI/CD Tool Comparison

| Feature / Tool                    | **GitHub Actions**          | **GitLab CI/CD**   | **Azure DevOps**               | **Jenkins**              |
| --------------------------------- | --------------------------- | ------------------ | ------------------------------ | ------------------------ |
| **Integration with Git**          | ✅ Built-in GitHub           | ✅ Built-in GitLab  | ✅ Azure/GitHub connectors      | ✅ Supports all Git repos |
| **Ease of Setup**                 | ⭐⭐⭐⭐                        | ⭐⭐⭐⭐               | ⭐⭐⭐⭐                           | ⭐⭐⭐                      |
| **Secrets Management**            | ✅ GitHub Secrets            | ✅ CI/CD Variables  | ✅ Azure Key Vault              | ✅ Credentials Plugin     |
| **Runner/Agent Model**            | GitHub-hosted / Self-hosted | Shared/Self-hosted | Microsoft-hosted / Self-hosted | Self-hosted Agents       |
| **Built-in Deployment Templates** | ✅ Marketplace Actions       | ✅ Templates        | ✅ Tasks                        | ❌ Plugins only           |
| **Ease of Rollback**              | 🔄 Easy                     | 🔄 Easy            | 🔄 Easy                        | 🔄 Manual                |
| **Audit Trail**                   | ✅ PR Linked                 | ✅ MR Linked        | ✅ Commit Linked                | ✅ Logs                   |
| **Customizability**               | ⚙️ High                     | ⚙️ High            | ⚙️ High                        | ⚙️ Very High             |

---

# 📌 12. Best Practices for Deployment

* ✅ Use **dedicated deployment role**
* ✅ **Test scripts locally** before pushing
* ✅ Keep scripts **idempotent** (`CREATE OR REPLACE`)
* ✅ Separate **DDL** & **DML**
* ✅ Deploy in **low traffic hours**
* ✅ Monitor via **Snowflake Query History**

---

# ⚡ 13. Performance Impact

* Deployments don’t slow Snowflake permanently, but:

  * Large DDL can spike **warehouse usage**
  * Avoid during **peak hours**
  * Use **transactions** to avoid partial failures

---