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
};
