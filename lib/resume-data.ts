import type { Figure, Resume } from "@/types/resume";

/**
 * Single source of truth for site content. Facts come from Mihir's October 2026
 * resume and his questionnaire answers only; wording is paraphrased for the web.
 */

// Figures are defined once and shared by the proof strip and the project cards.
const fig = {
  deploy: {
    value: "40%",
    label: "faster AVD deployments across clients, ~8 h → ~5 h",
    provenance: "PowerShell provisioning and Azure VM Image Builder golden images replaced the manual build.",
    measuredHow: "Timed the deployment task before and after automation.",
  },
  manual: {
    value: "70%+",
    label: "less manual effort across 5 clients, with configuration errors near zero",
    provenance:
      "Azure DevOps pipelines run Terraform and PowerShell, joining the domain and pulling Key Vault secrets without a human step.",
    measuredHow: "Timed the task before and after automation.",
  },
  spend: {
    value: "25%",
    label: "lower monthly cloud spend across Azure and AWS",
    provenance: "Right-sizing and autoscaling across both clouds.",
  },
  users: {
    value: "450+",
    label: "concurrent VDI users supported",
    provenance: "FSLogix user profiles and AVD autoscaling on the clients' host pools.",
  },
  uptime: {
    value: "99.9%",
    label: "uptime on a multi-AZ WordPress platform",
    provenance: "Auto Scaling across availability zones behind a load balancer, with RDS for the database.",
  },
  setup: {
    value: "<30 min",
    label: "to stand up a new environment",
    provenance: "The whole platform is Terraform; plan and apply builds it, and one step replicates it.",
  },
  delivery: {
    value: "50%+",
    label: "faster feature delivery",
    provenance: "An end-to-end pipeline: Terraform provisions, Ansible configures, GitHub Actions runs it.",
  },
  answers: {
    value: "~60%",
    label: "faster answers to HR policy questions",
    provenance: "FAISS retrieval feeds Llama inference, replacing manual lookups in policy documents.",
  },
} satisfies Record<string, Figure>;

export const resume: Resume = {
  name: "Mihir Bhavsar",
  role: "Cloud & DevOps Engineer",
  location: "Ahmedabad, India",
  positioning:
    "I automate how Azure and AWS infrastructure is built, shipped and monitored, with Terraform, CI/CD and alerting, and I build applied AI: a RAG assistant for HR policy questions.",
  summary:
    "Cloud and DevOps engineer working across AWS, Azure and GCP since December 2024. Most of my work is infrastructure as code and delivery pipelines — Terraform, GitHub Actions and Azure DevOps — plus Linux administration and monitoring with Prometheus, Grafana and CloudWatch. I've used Docker, Kubernetes, Helm and ArgoCD in project work.",
  email: "mihirbhavsar2001@gmail.com",
  resumeFile: "/MihirBhavsar_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mihirbhavsar3102/" },
  ],

  estate: {
    zones: [
      {
        id: "clients",
        label: "Clients",
        nodes: [
          { id: "clients-orgs", label: "Enterprise clients", meta: "5" },
          { id: "clients-users", label: "Concurrent VDI users", meta: "450+" },
        ],
      },
      {
        id: "azure",
        label: "Azure · Virtual Desktop",
        tech: "azure",
        nodes: [
          { id: "host-pools", label: "Host pools", meta: "autoscaling", tech: "azure-virtual-desktop" },
          { id: "session-hosts", label: "Session hosts", meta: "FSLogix profiles", tech: "fslogix" },
          { id: "golden-images", label: "Golden images", meta: "VM Image Builder", tech: "azure-image-builder" },
          { id: "key-vault", label: "Key Vault", tech: "key-vault" },
          { id: "domain-join", label: "AD domain join", tech: "azure" },
        ],
      },
      {
        id: "aws",
        label: "AWS · Web platform",
        tech: "aws",
        nodes: [
          { id: "cdn", label: "CloudFront + S3", tech: "cloudfront" },
          { id: "alb", label: "Load balancer", tech: "alb" },
          { id: "asg", label: "EC2 Auto Scaling", meta: "multi-AZ", tech: "auto-scaling" },
          { id: "rds", label: "RDS", tech: "rds" },
          { id: "lambda", label: "Lambda", tech: "lambda" },
        ],
      },
      {
        id: "ai",
        label: "AI · HR policy assistant",
        nodes: [
          { id: "api", label: "FastAPI", tech: "fastapi" },
          { id: "orchestration", label: "LangChain", tech: "langchain" },
          { id: "retrieval", label: "FAISS retrieval", tech: "faiss" },
          { id: "inference", label: "Llama inference", tech: "llama" },
        ],
      },
    ],
    controlPlane: [
      {
        id: "build",
        label: "Build and ship",
        nodes: [
          { id: "terraform", label: "Terraform", tech: "terraform" },
          { id: "powershell", label: "PowerShell", tech: "powershell" },
          { id: "azure-devops", label: "Azure DevOps", tech: "azure-devops" },
          { id: "github-actions", label: "GitHub Actions", tech: "github-actions" },
          { id: "ansible", label: "Ansible", tech: "ansible" },
        ],
      },
      {
        id: "observe",
        label: "Observe",
        nodes: [
          { id: "azure-monitor", label: "Azure Monitor", meta: "Log Analytics · KQL", tech: "azure-monitor" },
          { id: "cloudwatch", label: "CloudWatch", tech: "cloudwatch" },
          { id: "grafana", label: "Prometheus + Grafana", tech: "grafana" },
        ],
      },
    ],
    edges: [
      { from: "clients-users", to: "host-pools", source: "resume: AVD — 450+ concurrent VDI users on client host pools" },
      { from: "host-pools", to: "session-hosts", source: "resume: AVD — FSLogix profiles and host-pool autoscaling" },
      { from: "golden-images", to: "session-hosts", source: "resume: AVD — Image Builder golden-image pipelines" },
      { from: "cdn", to: "alb", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "alb", to: "asg", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "asg", to: "rds", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "api", to: "orchestration", source: "resume: HR chatbot — FastAPI, LangChain" },
      { from: "orchestration", to: "retrieval", source: "resume: HR chatbot — FAISS semantic retrieval" },
      { from: "orchestration", to: "inference", source: "resume: HR chatbot — Llama inference" },
      { from: "terraform", to: "azure", source: "resume: AVD — Azure DevOps pipelines running Terraform" },
      { from: "powershell", to: "azure", source: "resume: AVD — PowerShell provisioning" },
      { from: "azure-devops", to: "azure", source: "resume: AVD — Azure DevOps pipelines" },
      { from: "terraform", to: "aws", source: "resume: AWS environment — Terraform plan and apply" },
      { from: "ansible", to: "aws", source: "resume: AWS environment — CI/CD with Ansible" },
      { from: "github-actions", to: "aws", source: "resume: AWS environment — CI/CD with GitHub Actions" },
      { from: "azure-monitor", to: "azure", source: "resume: AVD — Azure Monitor and Log Analytics" },
      { from: "cloudwatch", to: "aws", source: "resume: AWS environment — CloudWatch alarms and dashboards" },
      { from: "grafana", to: "aws", source: "resume: AWS environment section — Grafana on Prometheus" },
    ],
    proof: [
      { id: "deploy", figure: fig.deploy, highlight: ["golden-images", "session-hosts", "host-pools", "powershell"] },
      { id: "manual", figure: fig.manual, highlight: ["key-vault", "domain-join", "session-hosts", "azure-devops", "terraform", "powershell"] },
      { id: "spend", figure: fig.spend, highlight: ["host-pools", "asg"] },
      { id: "users", figure: fig.users, highlight: ["clients-orgs", "clients-users", "host-pools", "session-hosts"] },
      { id: "uptime", figure: fig.uptime, highlight: ["cdn", "alb", "asg", "rds"] },
      { id: "answers", figure: fig.answers, highlight: ["api", "orchestration", "retrieval", "inference"] },
    ],
  },

  experience: [
    {
      title: "Cloud Operations Engineer",
      company: "Parkar Global Technologies",
      legalName: "Parkar Global Technologies Pvt Ltd",
      location: "Ahmedabad, India",
      start: "2024-12",
      workstreams: [
        {
          name: "Azure Virtual Desktop",
          summary: "Building and running virtual desktop estates for five enterprise clients.",
          caseStudy: "avd-automation",
          points: [
            "Automated AVD builds with PowerShell and Azure VM Image Builder golden images, taking multi-client deployments from about 8 hours to about 5 — 40% faster.",
            "Moved provisioning into Azure DevOps pipelines that run Terraform and PowerShell, with domain join and Key Vault secrets handled automatically: over 70% less manual effort and configuration errors close to zero across five clients.",
            "Set up FSLogix profiles and autoscaling on client host pools serving 450+ concurrent users, and cut monthly cloud spend by 25% through right-sizing and autoscaling.",
            "Added Azure Monitor and Log Analytics (KQL) monitoring to the VDI estate, shortening the time to resolve support incidents.",
          ],
        },
        {
          name: "AWS environments",
          summary: "Designing, provisioning and monitoring AWS environments from code.",
          caseStudy: "aws-web-platform",
          points: [
            "Designed and deployed a fault-tolerant, multi-AZ WordPress platform on EC2 Auto Scaling, an Application Load Balancer, RDS, Lambda, S3 and CloudFront, running at 99.9% uptime.",
            "Defined it in Terraform, so a new environment takes under 30 minutes and can be replicated in one step.",
            "Built an end-to-end CI/CD pipeline with Terraform, Ansible and GitHub Actions that made feature delivery over 50% faster.",
            "Built Grafana dashboards and alert rules on an existing Prometheus stack, plus CloudWatch alarms and dashboards.",
          ],
        },
        {
          name: "Linux administration",
          summary: "Looking after the Linux servers underneath.",
          points: ["User and SSH access, permissions, OS patching, web and app server setup, and service troubleshooting."],
        },
      ],
    },
  ],

  projects: [
    {
      slug: "avd-automation",
      title: "Azure Virtual Desktop automation",
      summary:
        "Provisioning, imaging and scaling Azure Virtual Desktop for five enterprise clients, automated with PowerShell, Image Builder and Azure DevOps pipelines.",
      kind: "work",
      role: "Built the end-to-end VM provisioning in PowerShell; one of a four-person team running the estate.",
      stack: ["azure-virtual-desktop", "powershell", "azure-image-builder", "azure-devops", "terraform", "key-vault", "fslogix", "azure-monitor"],
      figures: [fig.manual, fig.deploy, fig.spend, fig.users],
    },
    {
      slug: "aws-web-platform",
      title: "Multi-AZ AWS web platform",
      summary:
        "A fault-tolerant WordPress platform on AWS, defined in Terraform and shipped through a Terraform, Ansible and GitHub Actions pipeline.",
      kind: "work",
      role: "Designed and deployed the platform; built its Terraform and its CI/CD pipeline.",
      repo: { owner: "MihirBhavsar3102", name: "Automatic-Deployment" },
      stack: ["ec2", "auto-scaling", "alb", "rds", "lambda", "s3", "cloudfront", "terraform", "ansible", "github-actions", "cloudwatch", "prometheus", "grafana"],
      figures: [fig.uptime, fig.setup, fig.delivery],
    },
    {
      slug: "hr-policy-assistant",
      title: "HR policy assistant",
      summary: "A retrieval-augmented chatbot that answers HR policy questions from the policy documents themselves.",
      kind: "work",
      role: "Built it: FAISS retrieval, Llama inference and the FastAPI service around them.",
      repo: { owner: "MihirBhavsar3102", name: "Rag-Assistant-Chatbot" },
      stack: ["python", "fastapi", "langchain", "faiss", "llama"],
      figures: [fig.answers],
    },
    {
      slug: "devsecops-pipeline",
      title: "DevSecOps CI/CD pipeline",
      summary:
        "A Jenkins pipeline with security gates at build and deploy, shipping a three-tier Java app to self-managed Kubernetes on every push.",
      kind: "personal",
      role: "Designed and built it.",
      stack: ["jenkins", "sonarqube", "owasp-dependency-check", "trivy", "docker", "kubernetes", "maven", "github"],
      figures: [],
      stages: ["GitHub webhook", "Maven build", "SonarQube", "OWASP Dependency-Check", "Docker image", "Trivy scan", "Kubernetes deploy"],
    },
  ],

  skillGroups: [
    {
      name: "CI/CD",
      skills: [
        { name: "GitHub Actions", tech: "github-actions" },
        { name: "GitLab CI/CD" },
        { name: "Jenkins", tech: "jenkins" },
        { name: "Azure DevOps", tech: "azure-devops" },
        { name: "AWS CodePipeline, CodeBuild, CodeDeploy" },
        { name: "Git" },
      ],
    },
    {
      name: "Infrastructure as code",
      skills: [
        { name: "Terraform", detail: "reusable modules", tech: "terraform" },
        { name: "CloudFormation" },
        { name: "AWS CDK" },
        { name: "Ansible", detail: "configuration management", tech: "ansible" },
      ],
    },
    {
      name: "Containers and orchestration",
      skills: [
        { name: "Docker", tech: "docker" },
        { name: "Kubernetes", tech: "kubernetes" },
        { name: "Helm" },
        { name: "ArgoCD", detail: "GitOps" },
        { name: "Amazon EKS" },
        { name: "Amazon ECS" },
        { name: "GKE" },
      ],
    },
    {
      name: "Cloud platforms",
      skills: [
        { name: "AWS", detail: "EC2, IAM, VPC, S3, ALB, ASG, RDS, Route 53, Lambda, CloudFront, Secrets Manager", tech: "aws" },
        { name: "Azure", detail: "AVD, Virtual Machines, Entra ID, Key Vault, RBAC", tech: "azure" },
        { name: "Google Cloud", detail: "Compute Engine, Cloud Monitoring", tech: "gcp" },
      ],
    },
    {
      name: "Observability",
      skills: [
        { name: "Prometheus", tech: "prometheus" },
        { name: "Grafana", tech: "grafana" },
        { name: "CloudWatch", tech: "cloudwatch" },
        { name: "Azure Monitor", detail: "KQL, Log Analytics", tech: "azure-monitor" },
        { name: "Logging and alerting" },
      ],
    },
    {
      name: "Linux and networking",
      skills: [
        { name: "Linux administration" },
        { name: "SSH" },
        { name: "DNS" },
        { name: "TLS/SSL" },
        { name: "VPC and VNet networking" },
        { name: "Load balancing" },
        { name: "Firewall rules", detail: "NSG" },
      ],
    },
    {
      name: "Scripting and databases",
      skills: [
        { name: "Python", detail: "boto3", tech: "python" },
        { name: "Bash" },
        { name: "PowerShell", tech: "powershell" },
        { name: "Java" },
        { name: "SQL" },
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "DynamoDB" },
      ],
    },
    {
      name: "Practices",
      skills: [
        { name: "Agile / Scrum" },
        { name: "Incident response" },
        { name: "Root cause analysis" },
        { name: "Backup and restore" },
        { name: "Cost optimization" },
      ],
    },
    {
      name: "AI tools and frameworks",
      skills: [
        { name: "GitHub Copilot" },
        { name: "Claude Code" },
        { name: "LangChain", tech: "langchain" },
        { name: "CrewAI" },
        { name: "RAG pipelines" },
      ],
    },
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      code: "SAA-C03",
      issuerId: "aws",
      earned: "2025-06",
      verifyUrl: "https://www.credly.com/badges/5d3cb6a6-0610-4914-8a2f-52511656e738/public_url",
    },
    {
      name: "AWS Certified Cloud Practitioner",
      code: "CLF-C02",
      issuerId: "aws",
      earned: "2025-03",
      verifyUrl: "https://www.credly.com/badges/776fad7d-c50e-439c-b05a-7a62f83928d6",
    },
    {
      name: "Microsoft Certified: Azure Fundamentals",
      code: "AZ-900",
      issuerId: "microsoft",
      earned: "2025-06",
      verifyUrl: "https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/77676d8ea945c96",
    },
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      code: "AI-900",
      issuerId: "microsoft",
      earned: "2026-04",
      verifyUrl: "https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/b49e1012070f7cc0",
    },
    { name: "Google Cloud Digital Leader", issuerId: "google" },
  ],

  education: [
    {
      degree: "B.E., Computer Science and Engineering",
      institution: "The Maharaja Sayajirao University of Baroda",
      years: "2022 – 2025",
      score: "73.31%",
    },
    {
      degree: "Diploma, Computer Engineering",
      institution: "Gujarat Technological University",
      years: "2019 – 2022",
      score: "CGPA 8.89",
    },
  ],

  achievements: [
    {
      title: "National Cadet Corps, 2019 – 2022",
      detail: "Letter of Appreciation from Admiral Karambir Singh, former Chief of the Naval Staff.",
    },
  ],

  featuredRepos: [
    {
      owner: "MihirBhavsar3102",
      name: "Rag-Assistant-Chatbot",
      blurb: "The HR policy assistant: FAISS retrieval and Llama inference behind a FastAPI service.",
      demonstrates: "Applied AI",
      project: "hr-policy-assistant",
    },
    {
      owner: "MihirBhavsar3102",
      name: "Automatic-Deployment",
      blurb: "The Terraform, Ansible and GitHub Actions pipeline behind the AWS web platform.",
      demonstrates: "CI/CD and IaC",
      project: "aws-web-platform",
    },
    {
      owner: "MihirBhavsar3102",
      name: "Natural-Language-to-Robot-Framework",
      blurb: "Turns plain English into Robot Framework test files with AI.",
      demonstrates: "AI tooling",
      // Fork: hidden until Mihir supplies his contribution line (questionnaire A3b).
    },
  ],
};
