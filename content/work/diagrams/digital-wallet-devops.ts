import type { Diagram } from "@/types/diagram";

/**
 * The wallet app on AWS as the repository's README draws it: traffic enters
 * at the load balancer and runs down through the private subnets, the
 * pipeline ships from below, and the AWS services it reads and reports to sit
 * outside the VPC. Production is drawn as configured, because it was never
 * applied (README, first paragraph).
 */
export const digitalWalletDevops: Diagram = {
  title: "Only the load balancer is public; the pipeline reaches AWS without stored keys",
  width: 760,
  height: 616,
  groups: [
    { id: "vpc", label: "VPC", note: "2 availability zones", x: 16, y: 72, w: 426, h: 318 },
    { id: "public", label: "Public subnets", parent: "vpc", x: 32, y: 120, w: 394, h: 70 },
    { id: "app", label: "Private app subnets", parent: "vpc", x: 32, y: 202, w: 394, h: 94 },
    { id: "db", label: "Private DB subnets", note: "no internet route", parent: "vpc", x: 32, y: 308, w: 394, h: 70 },
    { id: "pipeline", label: "GitHub Actions", note: "OIDC, no stored keys", x: 16, y: 430, w: 426, h: 170 },
  ],
  nodes: [
    { id: "browser", label: "Browser", x: 217, y: 16, w: 110 },
    { id: "alb", label: "Load balancer", meta: "HTTP only", tech: "alb", group: "public", x: 197, y: 132, w: 150 },
    { id: "asg", label: "EC2 Auto Scaling", meta: "nginx + NestJS in Docker", tech: "auto-scaling", group: "app", x: 152, y: 238, w: 240 },
    { id: "rds", label: "RDS PostgreSQL", meta: "TLS only", tech: "rds", group: "db", x: 196, y: 320, w: 152 },
    { id: "secrets", label: "Secrets Manager", tech: "secrets-manager", x: 474, y: 84, w: 160 },
    { id: "cloudwatch", label: "CloudWatch", meta: "10 alarms", tech: "cloudwatch", x: 474, y: 238, w: 120 },
    { id: "sns", label: "SNS e-mail", x: 618, y: 245, w: 120 },
    { id: "ci", label: "Pull request", meta: "nine jobs", group: "pipeline", x: 28, y: 478, w: 170 },
    { id: "cd", label: "Merge", meta: "build, scan, deploy", tech: "github-actions", group: "pipeline", x: 250, y: 478, w: 180 },
    { id: "approval", label: "Approval gate", group: "pipeline", x: 265, y: 555, w: 150 },
    { id: "ecr", label: "ECR", meta: "immutable tags", tech: "ecr", x: 474, y: 478, w: 140 },
    { id: "prod", label: "Production", meta: "configured, not applied", x: 474, y: 548, w: 210 },
  ],
  edges: [
    {
      from: "browser",
      to: "alb",
      path: [[272, 48], [272, 132]],
      source: "repo: README.md — §1 Architecture, the browser reaches the Application Load Balancer over HTTP on port 80",
    },
    {
      from: "alb",
      to: "asg",
      path: [[272, 178], [272, 238]],
      source: "repo: README.md — §1 Architecture, the load balancer forwards to the Auto Scaling group in the private app subnets",
    },
    {
      from: "asg",
      to: "rds",
      path: [[272, 284], [272, 320]],
      source: "repo: README.md — §1 Architecture and §5, the app tier reaches RDS PostgreSQL over TLS on 5432, and the database accepts only the app tier",
    },
    {
      from: "ci",
      to: "cd",
      path: [[198, 501], [250, 501]],
      source: "repo: docs/REFERENCE.md — Continuous delivery, cd.yml runs when a pull request that ci.yml has checked is merged to main",
    },
    {
      from: "cd",
      to: "ecr",
      path: [[430, 501], [474, 501]],
      source: "repo: README.md — §3 step 6, cd.yml builds and scans both images and pushes them to ECR, whose tags are immutable (docs/REFERENCE.md, Container registry)",
    },
    {
      from: "cd",
      to: "asg",
      label: "SSM Run Command",
      labelAt: [368, 410],
      path: [[368, 478], [368, 284]],
      source: "repo: README.md — §3 step 6 and §4, cd.yml deploys to the staging instances over SSM Run Command, then runs the smoke test",
    },
    {
      from: "cd",
      to: "approval",
      path: [[340, 524], [340, 555]],
      source: "repo: docs/REFERENCE.md — Production (step 2.5), the deploy-production job waits for a required reviewer on the production environment",
    },
    {
      from: "approval",
      to: "prod",
      path: [[415, 571], [474, 571]],
      source: "repo: README.md — first paragraph and §3 step 8, production is configured and plan-checked but has never been applied",
    },
    {
      from: "asg",
      to: "secrets",
      path: [[368, 238], [368, 100], [474, 100]],
      source: "repo: README.md — §5 Secrets handling, the instances read the database password and the JWT key from Secrets Manager at deploy time",
    },
    {
      from: "asg",
      to: "cloudwatch",
      path: [[392, 261], [474, 261]],
      source: "repo: README.md — §1 Architecture, the Auto Scaling group sends logs and metrics to CloudWatch",
    },
    {
      from: "cloudwatch",
      to: "sns",
      path: [[594, 261], [618, 261]],
      source: "repo: docs/REFERENCE.md — Alarms and notifications (step 3.7), ten CloudWatch alarms notify one SNS topic by e-mail",
    },
  ],
  traces: [
    { id: "rebuild", figure: "10–12 min", label: "staging rebuild", lights: ["vpc", "alb", "asg", "rds"] },
    { id: "alarm", figure: "90 s", label: "to the first alarm", lights: ["asg", "cloudwatch", "sns"] },
    { id: "restore", figure: "13–15 min", label: "database restore", lights: ["db", "rds"] },
    {
      id: "ship",
      label: "How a change ships",
      caption:
        "A merge builds and scans both images, pushes them to ECR, deploys them to staging and runs a smoke test, then waits for an approval before production.",
      lights: ["ci", "cd", "ecr", "asg", "approval"],
    },
    {
      id: "keys",
      label: "No stored keys",
      caption: "GitHub signs in to AWS with short-lived OIDC tokens, so the repository holds no secrets at all.",
      lights: ["pipeline", "cd", "secrets"],
    },
  ],
  // The services the app reads and reports to come first, then traffic runs down from the browser to the
  // database, and the pipeline ships up into the app tier from below. The Secrets Manager edge leaves the
  // app tier on its right and climbs the margin, the one place left clear of the other lines.
  phone: {
    width: 340,
    height: 1000,
    groups: {
      vpc: { x: 8, y: 190, w: 308, h: 378 },
      public: { x: 20, y: 238, w: 284, h: 94 },
      app: { x: 20, y: 344, w: 284, h: 94 },
      db: { x: 20, y: 450, w: 284, h: 106 },
      pipeline: { x: 8, y: 608, w: 308, h: 236 },
    },
    nodes: {
      secrets: { x: 150, y: 8, w: 160 },
      cloudwatch: { x: 196, y: 64, w: 120 },
      sns: { x: 44, y: 71, w: 120 },
      browser: { x: 136, y: 134, w: 100 },
      alb: { x: 115, y: 274, w: 142 },
      asg: { x: 80, y: 380, w: 212 },
      rds: { x: 111, y: 498, w: 150 },
      ci: { x: 84, y: 656, w: 134 },
      cd: { x: 100, y: 726, w: 200 },
      approval: { x: 80, y: 796, w: 142 },
      ecr: { x: 176, y: 868, w: 140 },
      prod: { x: 48, y: 938, w: 206 },
    },
    edges: {
      "browser->alb": { path: [[186, 166], [186, 274]] },
      "alb->asg": { path: [[186, 320], [186, 380]] },
      "asg->rds": { path: [[186, 426], [186, 498]] },
      "ci->cd": { path: [[151, 702], [151, 726]] },
      "cd->ecr": { path: [[246, 772], [246, 868]] },
      "cd->asg": { path: [[280, 726], [280, 426]], labelAt: [278, 588] },
      "cd->approval": { path: [[151, 772], [151, 796]] },
      "approval->prod": { path: [[151, 828], [151, 938]] },
      "asg->secrets": { path: [[292, 403], [328, 403], [328, 24], [310, 24]] },
      "asg->cloudwatch": { path: [[280, 380], [280, 110]] },
      "cloudwatch->sns": { path: [[196, 87], [164, 87]] },
    },
  },
};
