import type { Resume } from "@/types/resume";

/**
 * Single source of truth for all site content.
 * Edit here — every section reads from this file.
 */
export const resume: Resume = {
  name: "Mihir Bhavsar",
  role: "Cloud & DevOps Engineer",
  headline: "Cloud & DevOps Engineer | AI Automation | Infrastructure as Code",
  location: "Ahmedabad, Gujarat, India",
  tagline:
    "I engineer Azure Virtual Desktop environments for enterprise clients, automate everything repeatable with Terraform and PowerShell, and build AI tooling — RAG pipelines, LLM inference — that runs in production.",
  estate: {
    planes: [
      {
        id: "edge",
        label: "Client edge",
        note: "Five-client enterprise estate",
        nodes: [
          { id: "clients", label: "Enterprise clients", meta: "×5", icon: "clients" },
          { id: "users", label: "VDI users", meta: "200+", icon: "users" },
        ],
      },
      {
        id: "azure",
        label: "Azure — virtual desktop",
        note: "Host pools, VM lifecycle, FSLogix",
        nodes: [
          { id: "avd", label: "AVD host pools", icon: "hostpool" },
          { id: "fslogix", label: "FSLogix profiles", icon: "profiles" },
          { id: "vault", label: "Key Vault", icon: "vault" },
          { id: "entra", label: "Entra ID · RBAC", icon: "identity" },
        ],
      },
      {
        id: "aws",
        label: "AWS — workload",
        note: "Multi-AZ, auto-scaled, right-sized",
        nodes: [
          { id: "asg", label: "EC2 · ASG", icon: "compute" },
          { id: "alb", label: "Load balancer", icon: "balancer" },
          { id: "rds", label: "RDS", icon: "database" },
          { id: "cdn", label: "S3 · CloudFront", icon: "edge" },
        ],
      },
      {
        id: "ai",
        label: "AI services",
        note: "Retrieval service, in production",
        nodes: [
          { id: "api", label: "FastAPI", icon: "service" },
          { id: "llama", label: "Llama inference", icon: "model" },
          { id: "langchain", label: "LangChain", icon: "chain" },
          { id: "faiss", label: "FAISS index", icon: "vector" },
        ],
      },
    ],
    rail: {
      label: "Automation & control",
      tools: ["Terraform", "PowerShell", "Ansible", "GitHub Actions"],
    },
    flows: [
      {
        n: 1,
        plane: "azure",
        label: "Provision",
        detail:
          "Host pool design, VM lifecycle and FSLogix configuration for Azure Virtual Desktop, taken off the manual path and driven from code across 3+ client deployments.",
        headline: "40% faster",
        removedLabel: "40% of the time",
        wholeLabel: "~8 hrs by hand",
        remainingLabel: "~5 hrs",
        remaining: 0.6,
      },
      {
        n: 2,
        plane: "azure",
        label: "Automate",
        detail:
          "PowerShell automation for VM provisioning, domain join and Key Vault management, replacing the repeated manual work across the five-client environment and taking configuration errors to near zero.",
        headline: "70%+ eliminated",
        removedLabel: "70%+ of the effort",
        wholeLabel: "All manual effort",
        remainingLabel: "Under 30% left",
        remaining: 0.3,
      },
      {
        n: 3,
        plane: "aws",
        label: "Optimize",
        detail:
          "Right-sizing, auto-scaling and usage-metric-driven resource optimization against the AWS footprint — while holding 200+ concurrent VDI users on it.",
        headline: "25% lower",
        removedLabel: "25% of baseline",
        wholeLabel: "Baseline monthly spend",
        remainingLabel: "75% of baseline",
        remaining: 0.75,
      },
      {
        n: 4,
        plane: "ai",
        label: "Extend",
        detail:
          "HR policy questions answered by semantic retrieval over the policy documents instead of manual lookup — FAISS vector search feeding Llama inference behind FastAPI, running in production.",
        headline: "~60% faster",
        removedLabel: "~60% of the time",
        wholeLabel: "Manual query resolution",
        remainingLabel: "~40% of the time",
        remaining: 0.4,
      },
    ],
  },
  about: [
    "I'm a cloud engineer at Parkar Digital in Ahmedabad, where I design and run Azure Virtual Desktop environments for enterprise clients — host pool design, VM lifecycle, FSLogix — and automate the repetitive parts with PowerShell and Terraform. That automation now eliminates over 70% of the manual effort those environments used to need, across a five-client estate.",
    "Alongside infrastructure, I build AI-native tooling: a retrieval-augmented HR policy chatbot running in production, Llama inference behind FastAPI, FAISS vector search. I like working where infrastructure and AI meet — and I measure everything, because a 25% cloud-spend cut only counts when it shows up on the dashboard.",
  ],
  quickFacts: [
    { label: "Location", value: "Ahmedabad, India" },
    { label: "Current role", value: "Cloud Operations Engineer, Parkar Digital" },
    { label: "Experience", value: "1.5+ years" },
    { label: "Certifications", value: "AWS SAA · AZ-900 · AI-900 · GCP Digital Leader" },
  ],
  email: "mihirbhavsar2001@gmail.com",
  phone: "+91-7096259248", // not rendered publicly; kept here for completeness
  resumeFile: "/MihirBhavsar_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mihirbhavsar3102/" },
  ],
  experience: [
    {
      role: "Cloud Operations Engineer",
      company: "Parkar Digital",
      location: "Ahmedabad, India",
      stamp: "Apr 2025 – Present",
      range: "April 2025 to present",
      current: true,
      bullets: [
        "Engineered Azure Virtual Desktop environments — host pool design, VM lifecycle, FSLogix configuration — cutting provisioning time by 40% (~8 hrs to ~5 hrs) across 3+ client deployments.",
        "Built PowerShell automation for VM provisioning, domain join, and Key Vault management, eliminating over 70% of manual effort and reducing configuration errors to near zero across a 5-client environment.",
        "Optimized monthly AWS cloud spend by 25% via right-sizing, auto-scaling, and usage-metric-driven resource optimization, supporting 200+ concurrent VDI users.",
        "Delivered continuous VDI incident support and troubleshooting, ensuring high availability for enterprise end-users.",
      ],
    },
    {
      role: "Cloud Infrastructure Intern",
      company: "Parkar Digital",
      location: "Ahmedabad, India",
      stamp: "Dec 2024 – Apr 2025",
      range: "December 2024 to April 2025",
      current: false,
      bullets: [
        "Deployed and configured AWS and Azure infrastructure — EC2/VM provisioning, IAM/RBAC, VPC networking, and storage — supporting enterprise-scale environments with zero critical incidents.",
      ],
    },
  ],
  projects: [
    {
      name: "AI-Powered HR Policy Chatbot",
      description:
        "RAG chatbot answering HR policy questions at Parkar Digital — semantic FAISS retrieval over policy documents with Llama inference behind FastAPI.",
      outcome:
        "~60% faster query resolution; vector retrieval significantly outperforms keyword search on org-specific queries.",
      stack: ["Python", "FastAPI", "Llama", "LangChain", "FAISS"],
      flow: ["Policy documents", "FAISS index", "LangChain retrieval", "Llama inference", "FastAPI"],
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
      inProduction: true,
      caseStudy: {
        problem:
          "HR policy answers were spread across long internal documents, so routine questions kept coming back to the team and took real time to resolve.",
        approach:
          "Policy documents are embedded into a FAISS vector index. Semantic retrieval pulls the passages that actually match a question and hands them to a Llama model for inference, with LangChain orchestrating retrieval and prompting behind a FastAPI service.",
        impact: [
          "Cut query resolution time by roughly 60%.",
          "Retrieval accuracy on organization-specific policy questions significantly outperformed keyword search.",
          "Runs in production at Parkar Digital.",
        ],
        metrics: [
          { value: "~60%", label: "Faster resolution" },
          { value: "In production", label: "At Parkar Digital" },
        ],
      },
    },
    {
      name: "AWS High-Availability WordPress",
      description:
        "Fault-tolerant, multi-AZ WordPress on EC2, ASG, ALB, and RDS with S3 and CloudFront — the whole stack described in Terraform with one-click replication.",
      outcome: "99.9% uptime; environment setup went from days to under 30 minutes.",
      stack: ["Terraform", "EC2", "ASG", "ALB", "RDS", "CloudFront"],
      flow: ["S3 · CloudFront", "Application load balancer", "EC2 auto-scaling group", "RDS multi-AZ"],
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
      caseStudy: {
        problem:
          "The deployment had to survive an availability-zone failure and be reproducible on demand, but standing one up by hand took days.",
        approach:
          "A multi-AZ VPC fronts an EC2 auto-scaling group behind an application load balancer, with RDS holding the database and S3 plus CloudFront serving static assets. The whole stack is described in Terraform, so a fresh environment is one command rather than a checklist.",
        impact: [
          "99.9% uptime across the multi-AZ deployment.",
          "Environment setup dropped from days to under 30 minutes.",
          "One-click replication for a new environment.",
        ],
        metrics: [
          { value: "99.9%", label: "Uptime" },
          { value: "<30 min", label: "Environment setup" },
        ],
      },
    },
    {
      name: "Automated CI/CD Pipeline",
      description:
        "End-to-end delivery pipeline with automated testing gates and daily deployments — infrastructure provisioned by Terraform, configuration managed with Ansible.",
      outcome: "Feature delivery timelines cut by over 50%, with fewer rollback incidents.",
      stack: ["Terraform", "Ansible", "GitHub Actions"],
      flow: ["Commit", "GitHub Actions", "Automated test gates", "Terraform provision", "Ansible configure"],
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
      caseStudy: {
        problem:
          "Releases leaned on manual steps, which slowed feature delivery and made rollbacks more frequent than they should have been.",
        approach:
          "GitHub Actions runs the pipeline end to end, with automated testing gates that have to pass before a release moves forward. Terraform provisions the infrastructure and Ansible manages configuration, so environments stay consistent between deployments.",
        impact: [
          "Feature delivery timelines cut by more than 50%.",
          "Daily deployments became routine.",
          "Fewer rollback incidents.",
        ],
        metrics: [
          { value: ">50%", label: "Faster delivery" },
          { value: "Daily", label: "Deployment cadence" },
        ],
      },
    },
  ],
  skillGroups: [
    {
      key: "Cloud",
      skills: ["AWS (EC2, IAM, VPC, S3, RDS, CloudFront, ASG, ALB)", "Azure (AVD, Key Vault, RBAC, EntraID, Files)", "GCP"],
      shipped: ["AWS (EC2, IAM, VPC, S3, RDS, CloudFront, ASG, ALB)", "Azure (AVD, Key Vault, RBAC, EntraID, Files)"],
    },
    {
      key: "IaC & Automation",
      skills: ["Terraform", "Ansible", "CloudFormation", "PowerShell", "Bash", "Linux"],
      shipped: ["Terraform", "Ansible", "PowerShell"],
    },
    {
      key: "CI/CD & Containers",
      skills: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "Helm", "GitOps (ArgoCD)"],
      shipped: ["GitHub Actions"],
    },
    {
      key: "AI / ML",
      skills: ["LangChain", "LLM Inference (Llama)", "RAG Pipelines", "FAISS Vector DB", "FastAPI", "CrewAI"],
      shipped: ["LangChain", "LLM Inference (Llama)", "RAG Pipelines", "FAISS Vector DB", "FastAPI"],
    },
    {
      key: "Observability",
      skills: ["Prometheus", "Grafana", "CloudWatch", "Azure Monitor", "Monitoring & Alerting"],
    },
    {
      key: "Practices",
      skills: ["Agile/Scrum", "Cloud Cost Optimization", "Incident Management"],
      shipped: ["Cloud Cost Optimization", "Incident Management"],
    },
    {
      key: "Languages",
      skills: ["Python", "Java", "C++", "SQL", "HTML/CSS/JS", "MongoDB"],
      shipped: ["Python"],
    },
  ],
  education: [
    {
      degree: "B.E. Computer Science & Engineering",
      institution: "The Maharaja Sayajirao University of Baroda",
      years: "2022 – 2025",
      score: "73.31%",
    },
    {
      degree: "Diploma in Computer Engineering",
      institution: "Gujarat Technological University",
      years: "2019 – 2022",
      score: "CGPA 8.89",
    },
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect – Associate (SAA-C03)", issuer: "Amazon Web Services" },
    { name: "AWS Certified Cloud Practitioner – Foundational (CLF-C02)", issuer: "Amazon Web Services" },
    { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", issuer: "Microsoft" },
    { name: "Microsoft Certified: Azure AI Fundamentals (AI-900)", issuer: "Microsoft" },
    { name: "Google Cloud Digital Leader", issuer: "Google Cloud" },
  ],
  achievements: [
    {
      title: "National Cadet Corps (2019 – 2022)",
      detail: "Letter of Appreciation — Admiral Karambir Singh, former Chief of the Indian Naval Staff.",
    },
  ],
};
