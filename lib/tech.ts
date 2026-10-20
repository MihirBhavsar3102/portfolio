/**
 * Technology registry. Brand colours exist only to mark the technology they
 * belong to (a dot or icon beside its name) — never as interface colour.
 */
export interface TechInfo {
  name: string;
  /** Official brand colour; omitted when the brand has none usable on a dark ground. */
  color?: string;
}

const registry = {
  aws: { name: "AWS", color: "#FF9900" },
  azure: { name: "Azure", color: "#0078D4" },
  gcp: { name: "Google Cloud", color: "#4285F4" },
  "azure-virtual-desktop": { name: "Azure Virtual Desktop", color: "#0078D4" },
  "azure-image-builder": { name: "Azure VM Image Builder", color: "#0078D4" },
  "azure-devops": { name: "Azure DevOps", color: "#0078D4" },
  "azure-monitor": { name: "Azure Monitor", color: "#0078D4" },
  "key-vault": { name: "Azure Key Vault", color: "#0078D4" },
  "entra-id": { name: "Entra ID", color: "#0078D4" },
  fslogix: { name: "FSLogix", color: "#0078D4" },
  ec2: { name: "EC2", color: "#FF9900" },
  "auto-scaling": { name: "EC2 Auto Scaling", color: "#FF9900" },
  alb: { name: "Application Load Balancer", color: "#FF9900" },
  rds: { name: "RDS", color: "#FF9900" },
  s3: { name: "S3", color: "#FF9900" },
  cloudfront: { name: "CloudFront", color: "#FF9900" },
  cloudwatch: { name: "CloudWatch", color: "#FF9900" },
  terraform: { name: "Terraform", color: "#7B42BC" },
  powershell: { name: "PowerShell", color: "#5391FE" },
  ansible: { name: "Ansible", color: "#EE0000" },
  "github-actions": { name: "GitHub Actions", color: "#2088FF" },
  github: { name: "GitHub" },
  jenkins: { name: "Jenkins", color: "#D24939" },
  sonarqube: { name: "SonarQube", color: "#4E9BCD" },
  "owasp-dependency-check": { name: "OWASP Dependency-Check" },
  trivy: { name: "Trivy", color: "#1904DA" },
  docker: { name: "Docker", color: "#2496ED" },
  kubernetes: { name: "Kubernetes", color: "#326CE5" },
  maven: { name: "Maven", color: "#C71A36" },
  prometheus: { name: "Prometheus", color: "#E6522C" },
  grafana: { name: "Grafana", color: "#F46800" },
  python: { name: "Python", color: "#3776AB" },
  fastapi: { name: "FastAPI", color: "#009688" },
  langchain: { name: "LangChain" },
  faiss: { name: "FAISS" },
  llama: { name: "Llama", color: "#0467DF" },
} satisfies Record<string, TechInfo>;

export type TechId = keyof typeof registry;

/** Widened so every entry reads as a TechInfo, colour optional. */
export const tech: Record<TechId, TechInfo> = registry;
