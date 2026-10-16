import type { Diagram } from "@/types/diagram";

/** The Jenkins pipeline from push to cluster, with its three security gates. */
export const devsecopsPipeline: Diagram = {
  title: "Every push runs the pipeline; three of its stages are security gates",
  width: 760,
  height: 364,
  groups: [
    { id: "jenkins", label: "Jenkins pipeline", note: "Runs on every push", x: 176, y: 24, w: 568, h: 188 },
    { id: "cluster", label: "Kubernetes cluster", note: "Self-managed", x: 176, y: 252, w: 244, h: 96 },
  ],
  nodes: [
    { id: "github", label: "GitHub", meta: "push webhook", tech: "github", x: 16, y: 72, w: 124 },
    { id: "build", label: "Maven build", meta: "Java app", tech: "maven", group: "jenkins", x: 192, y: 72, w: 150 },
    { id: "sonarqube", label: "SonarQube", meta: "static analysis", tech: "sonarqube", group: "jenkins", x: 374, y: 72, w: 150 },
    {
      id: "dependency-check",
      label: "Dependency-Check",
      meta: "OWASP scan",
      tech: "owasp-dependency-check",
      group: "jenkins",
      x: 556,
      y: 72,
      w: 172,
    },
    { id: "image", label: "Docker image", tech: "docker", group: "jenkins", x: 556, y: 157, w: 172 },
    { id: "trivy", label: "Trivy", meta: "image scan", tech: "trivy", group: "jenkins", x: 374, y: 150, w: 150 },
    { id: "deploy", label: "Deploy", meta: "to Kubernetes", tech: "kubernetes", group: "jenkins", x: 192, y: 150, w: 150 },
    { id: "app", label: "Three-tier Java app", group: "cluster", x: 192, y: 300, w: 212 },
  ],
  edges: [
    {
      from: "github",
      to: "jenkins",
      path: [[140, 95], [176, 95]],
      source: "resume: DevSecOps — GitHub webhooks trigger the pipeline on every code push",
    },
    {
      from: "build",
      to: "sonarqube",
      path: [[342, 95], [374, 95]],
      source: "resume: DevSecOps — Maven build, SonarQube static code analysis",
    },
    {
      from: "sonarqube",
      to: "dependency-check",
      path: [[524, 95], [556, 95]],
      source: "resume: DevSecOps — OWASP Dependency-Check (SCA)",
    },
    {
      from: "dependency-check",
      to: "image",
      path: [[642, 118], [642, 157]],
      source: "resume: DevSecOps — Docker",
    },
    {
      from: "image",
      to: "trivy",
      path: [[556, 173], [524, 173]],
      source: "resume: DevSecOps — Trivy container image scanning",
    },
    {
      from: "trivy",
      to: "deploy",
      path: [[374, 173], [342, 173]],
      source: "resume: DevSecOps — security gates across the build and deployment stages",
    },
    {
      from: "deploy",
      to: "cluster",
      path: [[267, 196], [267, 252]],
      source: "resume: DevSecOps — deploys a three-tier Java application to a self-managed Kubernetes cluster",
    },
  ],
  // No figures here, so the chips walk the pipeline in the case study's own sentences.
  traces: [
    {
      id: "trigger",
      label: "Trigger",
      caption: "A push to GitHub fires a webhook, and Jenkins runs the pipeline.",
      lights: ["github", "jenkins"],
    },
    {
      id: "build",
      label: "Build and scan",
      caption: "Maven builds the application, SonarQube runs static analysis on the code, and OWASP Dependency-Check scans its dependencies.",
      lights: ["build", "sonarqube", "dependency-check"],
    },
    {
      id: "ship",
      label: "Ship",
      caption: "The pipeline then builds a Docker image, Trivy scans that image, and the application is deployed to the cluster.",
      lights: ["image", "trivy", "deploy", "cluster", "app"],
    },
    {
      id: "gates",
      label: "Security gates",
      caption: "SonarQube, Dependency-Check and Trivy are the security gates.",
      lights: ["sonarqube", "dependency-check", "trivy"],
    },
  ],
  // One column, push to cluster, in pipeline order.
  phone: {
    width: 340,
    height: 668,
    groups: {
      jenkins: { x: 8, y: 78, w: 324, h: 450 },
      cluster: { x: 8, y: 556, w: 324, h: 100 },
    },
    nodes: {
      github: { x: 95, y: 8, w: 150 },
      build: { x: 70, y: 130, w: 200 },
      sonarqube: { x: 70, y: 200, w: 200 },
      "dependency-check": { x: 70, y: 270, w: 200 },
      image: { x: 70, y: 340, w: 200 },
      trivy: { x: 70, y: 396, w: 200 },
      deploy: { x: 70, y: 466, w: 200 },
      app: { x: 70, y: 608, w: 200 },
    },
    edges: {
      "github->jenkins": { path: [[170, 54], [170, 78]] },
      "build->sonarqube": { path: [[170, 176], [170, 200]] },
      "sonarqube->dependency-check": { path: [[170, 246], [170, 270]] },
      "dependency-check->image": { path: [[170, 316], [170, 340]] },
      "image->trivy": { path: [[170, 372], [170, 396]] },
      "trivy->deploy": { path: [[170, 442], [170, 466]] },
      "deploy->cluster": { path: [[170, 512], [170, 556]] },
    },
  },
};
