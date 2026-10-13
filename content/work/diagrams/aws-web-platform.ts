import type { Diagram } from "@/types/diagram";

/** The multi-AZ WordPress platform, the pipeline that ships it, and what watches it. */
export const awsWebPlatform: Diagram = {
  title: "The WordPress platform, the pipeline that ships it, and what watches it",
  width: 760,
  height: 576,
  groups: [
    { id: "pipeline", label: "GitHub Actions pipeline", x: 16, y: 96, w: 196, h: 156 },
    { id: "region", label: "AWS region", x: 244, y: 80, w: 500, h: 400 },
    { id: "vpc", label: "VPC", parent: "region", x: 260, y: 116, w: 468, h: 300 },
    { id: "asg", label: "Auto Scaling group", note: "EC2 across availability zones", parent: "vpc", x: 276, y: 214, w: 436, h: 110 },
  ],
  nodes: [
    { id: "cdn", label: "CloudFront + S3", tech: "cloudfront", x: 475, y: 24, w: 170 },
    { id: "alb", label: "Application Load Balancer", tech: "alb", group: "vpc", x: 435, y: 152, w: 250 },
    { id: "ec2", label: "EC2 instances", meta: "WordPress", tech: "ec2", group: "asg", x: 460, y: 262, w: 200 },
    { id: "rds", label: "RDS", meta: "database", tech: "rds", group: "vpc", x: 485, y: 354, w: 150 },
    { id: "lambda", label: "Lambda", tech: "lambda", group: "region", x: 260, y: 432, w: 150 },
    { id: "terraform", label: "Terraform", meta: "plan and apply", tech: "terraform", group: "pipeline", x: 28, y: 136, w: 172 },
    { id: "ansible", label: "Ansible", meta: "configuration", tech: "ansible", group: "pipeline", x: 28, y: 194, w: 172 },
    { id: "cloudwatch", label: "CloudWatch", meta: "alarms, dashboards", tech: "cloudwatch", x: 260, y: 512, w: 170 },
    { id: "grafana", label: "Prometheus + Grafana", meta: "dashboards, alert rules", tech: "grafana", x: 446, y: 512, w: 210 },
  ],
  edges: [
    {
      from: "cdn",
      to: "alb",
      path: [[560, 56], [560, 152]],
      source: "resume: AWS — multi-AZ WordPress architecture with CloudFront, S3 and an Application Load Balancer",
    },
    {
      from: "alb",
      to: "asg",
      path: [[560, 184], [560, 214]],
      source: "resume: AWS — Application Load Balancer in front of EC2 Auto Scaling Groups, multi-AZ",
    },
    {
      from: "ec2",
      to: "rds",
      path: [[560, 308], [560, 354]],
      source: "resume: AWS — Amazon RDS for the WordPress deployment",
    },
    {
      from: "terraform",
      to: "region",
      path: [[200, 159], [244, 159]],
      source: "resume: AWS — infrastructure as code with Terraform plan and apply",
    },
    {
      from: "ansible",
      to: "region",
      path: [[200, 217], [244, 217]],
      source:
        "resume: AWS — end-to-end CI/CD pipeline with Terraform, Ansible and GitHub Actions (what Ansible configures isn't stated, so the edge stops at the region, as on the hero map)",
    },
    {
      from: "cloudwatch",
      to: "region",
      path: [[345, 512], [345, 480]],
      source: "resume: AWS — CloudWatch alarms and dashboards on AWS",
    },
    {
      from: "grafana",
      to: "region",
      path: [[551, 512], [551, 480]],
      source:
        "resume: AWS environment section — Grafana dashboards and alert rules on an existing Prometheus stack (A8 skipped; drawn by resume grouping, as on the hero map)",
    },
  ],
};
