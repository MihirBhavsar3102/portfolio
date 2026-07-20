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
  stats: [
    { target: 25, suffix: "%", label: "Cloud spend reduced" },
    { target: 70, suffix: "%+", label: "Manual ops eliminated" },
    { target: 200, suffix: "+", label: "VDI users supported" },
    { target: 99.9, decimals: 1, suffix: "%", label: "Uptime delivered" },
  ],
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
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
      inProduction: true,
    },
    {
      name: "AWS High-Availability WordPress",
      description:
        "Fault-tolerant, multi-AZ WordPress on EC2, ASG, ALB, and RDS with S3 and CloudFront — the whole stack described in Terraform with one-click replication.",
      outcome: "99.9% uptime; environment setup went from days to under 30 minutes.",
      stack: ["Terraform", "EC2", "ASG", "ALB", "RDS", "CloudFront"],
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
    },
    {
      name: "Automated CI/CD Pipeline",
      description:
        "End-to-end delivery pipeline with automated testing gates and daily deployments — infrastructure provisioned by Terraform, configuration managed with Ansible.",
      outcome: "Feature delivery timelines cut by over 50%, with fewer rollback incidents.",
      stack: ["Terraform", "Ansible", "GitHub Actions"],
      link: { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
    },
  ],
  skillGroups: [
    {
      key: "Cloud",
      skills: ["AWS (EC2, IAM, VPC, S3, RDS, CloudFront, ASG, ALB)", "Azure (AVD, Key Vault, RBAC, EntraID, Files)", "GCP"],
    },
    {
      key: "IaC & Automation",
      skills: ["Terraform", "Ansible", "CloudFormation", "PowerShell", "Bash", "Linux"],
    },
    {
      key: "CI/CD & Containers",
      skills: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "Helm", "GitOps (ArgoCD)"],
    },
    {
      key: "AI / ML",
      skills: ["LangChain", "LLM Inference (Llama)", "RAG Pipelines", "FAISS Vector DB", "FastAPI", "CrewAI"],
    },
    {
      key: "Observability",
      skills: ["Prometheus", "Grafana", "CloudWatch", "Azure Monitor", "Monitoring & Alerting"],
    },
    {
      key: "Practices",
      skills: ["Agile/Scrum", "Cloud Cost Optimization", "Incident Management"],
    },
    {
      key: "Languages",
      skills: ["Python", "Java", "C++", "SQL", "HTML/CSS/JS", "MongoDB"],
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
