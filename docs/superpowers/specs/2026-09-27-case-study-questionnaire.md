# Case-Study Questionnaire

For: Mihir. Companion to the [rebuild design spec](2026-09-27-portfolio-rebuild-design.md).

**Revised 2026-10-10.** Your October resume answered a lot, so this version keeps your answers exactly as you wrote them, marks what's settled, and asks only what's still open. Write "skip" for anything you'd rather not publish, and "private" for anything I may use to shape the writing but must not print. Nothing on the site goes beyond your resume and what you write here.

**What's still open, in priority order:**
1. A7 and A8: short yes/no-style answers that the home page needs (Phase 1).
2. B2, B3, B4: the three remaining stories (Phase 2). Any story left unanswered still ships, built from resume facts only, with fewer sections.

---

## A. General

**A1. Booking link.** *Settled.*

> Answer: No

**A2. Certifications.** *Settled, except Google Cloud Digital Leader (it will show without a date or link until you add them).*

| Certification | Earned (month/year) | Verification URL |
|---|---|---|
| AWS Solutions Architect – Associate (SAA-C03) | June, 2025 | https://www.credly.com/badges/5d3cb6a6-0610-4914-8a2f-52511656e738/public_url |
| AWS Cloud Practitioner (CLF-C02) | March, 2025 | https://www.credly.com/badges/776fad7d-c50e-439c-b05a-7a62f83928d6 |
| Azure Fundamentals (AZ-900) | June, 2025 | https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/77676d8ea945c96?ref=https%3A%2F%2Fwww.linkedin.com%2F |
| Azure AI Fundamentals (AI-900) | April, 2026 | https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/b49e1012070f7cc0?ref=https%3A%2F%2Fwww.linkedin.com%2F |
| Google Cloud Digital Leader | | |

**A3. GitHub repos to feature.** *Settled.*

> Answer: `Rag-Assistant-Chatbot`, `Automatic-Deployment`, and `Natural-Language-to-Robot-Framework`

**A3b. The fork.** `Natural-Language-to-Robot-Framework` is a fork of someone else's repository on GitHub. In one line, what did you add or change in it? The site shows a fork only with that line, labelled "Fork of …", so it's clear which part is yours.

> Answer:

**A4. Repo mapping.** *Settled.* `Rag-Assistant-Chatbot` links from the HR policy assistant story; `Automatic-Deployment` links from the AWS web platform story.

> Answer: Yes both are correct

**A5. Estate topology.** *Settled by the resume and your choices on 2026-10-10:* 5 enterprise clients, 450+ concurrent VDI users, and the 25% saving counted across Azure and AWS. The AWS zone is your Parkar AWS work (the WordPress platform).

> Answer: Made correction, good to go

**A6. Public limits.** *Settled.*

> Answer: No

**A7. Claims from the old site.** These are on the current site but not on your October resume, so they'll be removed. Mark any that are still true and you want kept.

- [ ] The HR policy assistant is in production (used by employees today)
- [ ] Its retrieval answered organisation-specific questions significantly better than keyword search
- [ ] The CI/CD pipeline made daily deployments routine
- [ ] The CI/CD pipeline led to fewer rollback incidents

> Answer:

**A8. Two connections on the home-page diagram.** The diagram only draws a line when it's confirmed.

1. The Grafana dashboards and alert rules you built on the existing Prometheus stack: what were they watching? (The AWS web platform, the VDI estate, something else?)
   > Answer:
2. Where does the HR policy assistant run, and how does it get deployed? (e.g. a VM on Azure or AWS, an on-prem server, a container; deployed by hand or by a pipeline)
   > Answer:

**A9. MTTR (optional).** Your resume says Azure Monitor and Log Analytics reduced mean time to resolution for support incidents. Is there a number (before → after)? If not, the site keeps it as a sentence without a figure.

> Answer:

---

## B. Case studies

### B1. Azure Virtual Desktop automation — *enough to write; two optional follow-ups at the end*

**From your resume:** PowerShell provisioning and Azure VM Image Builder golden-image pipelines made multi-client deployments 40% faster (~8 → ~5 hrs). Azure DevOps pipelines running Terraform and PowerShell, with automated domain join and Key Vault secrets, removed over 70% of manual effort and brought configuration errors near zero across 5 clients. FSLogix profiles and AVD autoscaling for 450+ concurrent users; right-sizing and autoscaling cut monthly cloud spend 25%. Azure Monitor + Log Analytics (KQL) observability reduced MTTR.

1. **Confidentiality.**
   > Answer: Yes, you can
2. **Your role.**
   > Answer: I build the VM provisioning powershell script, which creates an VM inside the host pool end to end with all the other services. We are team of 4 people, operating and supporting the whole VDI infrastruture by resolving day to day VM issues to increase overall effiecincy and user experience. 
3. **Timeline.**
   > Answer: It went phase by phase, firstly we understood thier whole enviornment, then I built the VM provisioning automation script and then we went through the cost cutting part.
4. **Constraints.**
   > Answer: Provided by the clients, based on their requirements. 
5. **Key decisions.**
   > Answer: Provided by the clients, based on their requirements.
6. **Measurement.**
   > Answer: The numbers are self calculated based on the time consumed during the task execution
7. **Hardest problem.**
   > Answer: In PowerShell script, the last step was to install RDAgent and BootLoader on the VM so it can be assigned an host pool. The script was continuosly failing there, so i dig up and checked what steps are missing and just added those and it worked successfully.
8. **Next.**
   > Answer: N/A
9. **Shareable material.**
   > Answer: N/A
10. **Optional — the fix.** In one line, which steps were missing before the RDAgent and Boot Loader install worked? (e.g. a registration token, a reboot, a prerequisite.) This turns "it kept failing" into a story an interviewer remembers.
    > Answer:
11. **Optional — ownership.** The Image Builder golden-image pipeline and the Azure DevOps pipelines: did you build those yourself, or with the team?
    > Answer:

### B2. AWS web platform (HA WordPress, Terraform, CI/CD, monitoring) — *open*

**From your resume:** Parkar work. A fault-tolerant, multi-AZ WordPress deployment (EC2, Auto Scaling, ALB, RDS, Lambda, S3, CloudFront) with 99.9% uptime. Provisioned with Terraform plan/apply: environment setup under 30 minutes, with one-click replication. An end-to-end CI/CD pipeline with Terraform, Ansible, and GitHub Actions cut feature-delivery time by over 50%. Grafana dashboards and alert rules on an existing Prometheus stack, plus CloudWatch alarms and dashboards. Public repo: `Automatic-Deployment`.

1. **Who it was for.** Internal or a client? (It stays anonymous either way.)
   > Answer:
2. **Your role.** Solo or team? Which parts did you build?
   > Answer:
3. **Timeline.**
   > Answer:
4. **Key decisions.** e.g. why RDS Multi-AZ, how the scaling policy was set, where uploads and sessions live across instances, what the Lambda function does, where Terraform state is kept.
   > Answer:
5. **Measurement.** Over what period and with which tool was 99.9% uptime measured? What did setup take before Terraform? What was the delivery-time baseline behind "over 50% faster"?
   > Answer:
6. **The pipeline.** What does it deploy, and what has to pass before a release goes out? Is `Automatic-Deployment` the full pipeline?
   > Answer:
7. **What broke**, and how you fixed it.
   > Answer:
8. **Next.** What you'd improve.
   > Answer:

### B3. HR policy assistant (RAG) — *open*

**From your resume:** Built at Parkar using retrieval-augmented generation: FAISS semantic retrieval and Llama inference (Python, FastAPI, LangChain) answer HR policy questions in context. Cut query resolution time by ~60%, replacing manual lookups. Public repo: `Rag-Assistant-Chatbot`.

1. **Your role.** Did you build it end to end? Who else was involved?
   > Answer:
2. **Timeline.** When was it built?
   > Answer:
3. **Constraints.** Data privacy (could documents leave the company?), hardware, budget, latency expectations.
   > Answer:
4. **Key decisions.** Which Llama model and size, and why that over a hosted API. Why FAISS. Chunking and embedding choices.
   > Answer:
5. **Measurement.** How was "~60% faster" measured (baseline, sample size, period)?
   > Answer:
6. **What broke**, e.g. hallucinations, stale documents, slow inference, and how you fixed it.
   > Answer:
7. **Next.** e.g. evaluation, guardrails, re-indexing, monitoring.
   > Answer:

### B4. DevSecOps CI/CD pipeline (personal project) — *open*

**From your resume:** Jenkins pipeline with SonarQube (static analysis), OWASP Dependency-Check (dependency scanning), and Trivy (container image scanning) as security gates across build and deploy, deploying a 3-tier Java application to a self-managed Kubernetes cluster. GitHub webhooks trigger it on every push. Also: Docker, Maven.

1. **Why and when.** What made you build it, and when?
   > Answer:
2. **Repo.** Is there a public repo? (It isn't among your current public repos.)
   > Answer:
3. **The application.** Is the 3-tier Java app your own or a sample app?
   > Answer:
4. **The cluster.** How was the self-managed Kubernetes cluster set up, and where does it run?
   > Answer:
5. **The gates.** What makes a build fail: a SonarQube quality gate, a CVE severity threshold, something else?
   > Answer:
6. **What broke**, and how you fixed it.
   > Answer:
7. **Next.** What you'd add or change.
   > Answer:
