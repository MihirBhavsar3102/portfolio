import type { Diagram } from "@/types/diagram";

/**
 * One client's Azure Virtual Desktop estate, as the automation builds and
 * watches it. The pipeline runs Terraform and PowerShell (resume); the VM
 * provisioning script is drawn on its own because no source says the
 * pipeline is what runs it (B1.2 says only that Mihir wrote it).
 */
export const avdAutomation: Diagram = {
  title: "One client's estate, built and watched by the automation",
  width: 760,
  height: 476,
  groups: [
    { id: "pipeline", label: "Azure DevOps pipeline", x: 208, y: 16, w: 306, h: 84 },
    { id: "client", label: "Client environment", note: "One of five clients", x: 152, y: 200, w: 592, h: 180 },
    { id: "host-pool", label: "Host pool", note: "Autoscaling", parent: "client", x: 168, y: 252, w: 376, h: 112 },
  ],
  nodes: [
    { id: "key-vault", label: "Key Vault", tech: "key-vault", x: 16, y: 63, w: 120 },
    { id: "terraform", label: "Terraform", tech: "terraform", group: "pipeline", x: 220, y: 56, w: 120 },
    { id: "pipeline-powershell", label: "PowerShell", tech: "powershell", group: "pipeline", x: 352, y: 56, w: 150 },
    { id: "image-builder", label: "VM Image Builder", tech: "azure-image-builder", x: 556, y: 56, w: 188 },
    { id: "provisioning", label: "VM provisioning", meta: "PowerShell script", tech: "powershell", x: 318, y: 136, w: 168 },
    { id: "session-hosts", label: "Session hosts", meta: "FSLogix profiles", tech: "azure-virtual-desktop", group: "host-pool", x: 300, y: 302, w: 220 },
    { id: "active-directory", label: "Active Directory", meta: "domain join", group: "client", x: 560, y: 302, w: 168 },
    { id: "users", label: "Users", meta: "VDI sessions", x: 16, y: 302, w: 124 },
    { id: "azure-monitor", label: "Azure Monitor", meta: "Log Analytics · KQL", tech: "azure-monitor", x: 348, y: 412, w: 200 },
  ],
  edges: [
    {
      from: "key-vault",
      to: "pipeline",
      label: "secrets",
      path: [[136, 79], [208, 79]],
      source: "resume: AVD — Azure Key Vault secret management in the Azure DevOps pipelines",
    },
    {
      from: "pipeline",
      to: "client",
      path: [[280, 100], [280, 200]],
      source: "resume: AVD — Azure DevOps pipelines running Terraform and PowerShell, with automated Active Directory domain join",
    },
    {
      from: "provisioning",
      to: "session-hosts",
      label: "creates VMs",
      path: [[402, 182], [402, 302]],
      source:
        "questionnaire B1.2 — \"I build the VM provisioning powershell script, which creates an VM inside the host pool end to end\"; resume: AVD — PowerShell provisioning",
    },
    {
      from: "image-builder",
      to: "session-hosts",
      label: "golden image",
      labelAt: [580, 120],
      path: [[650, 88], [650, 120], [500, 120], [500, 302]],
      source: "resume: AVD — Azure VM Image Builder golden-image pipelines",
    },
    {
      from: "session-hosts",
      to: "active-directory",
      path: [[520, 325], [560, 325]],
      source: "resume: AVD — automated Active Directory domain join",
    },
    {
      from: "users",
      to: "host-pool",
      path: [[140, 325], [168, 325]],
      source: "resume: AVD — client host pools supporting concurrent VDI users",
    },
    {
      from: "azure-monitor",
      to: "client",
      path: [[448, 412], [448, 380]],
      source: "resume: AVD — Azure Monitor and Log Analytics (KQL) observability for the VDI infrastructure",
    },
  ],
  traces: [
    {
      id: "manual",
      figure: "70%+",
      label: "less effort",
      lights: ["key-vault", "pipeline", "terraform", "pipeline-powershell", "client", "active-directory"],
    },
    { id: "deploy", figure: "40%", label: "faster deploys", lights: ["provisioning", "image-builder", "session-hosts"] },
    { id: "spend", figure: "25%", label: "lower spend", lights: ["host-pool", "session-hosts"] },
    { id: "users", figure: "450+", label: "users", lights: ["users", "host-pool", "session-hosts"] },
    {
      id: "watch",
      label: "What watches it",
      caption: "Azure Monitor and Log Analytics watch the estate, queried with KQL.",
      lights: ["azure-monitor", "client"],
    },
  ],
  // Key Vault feeds the pipeline at the top, and the pipeline's arrow runs down the left edge to the client.
  // Image Builder and the provisioning script come down into the session hosts; users and monitoring sit below.
  phone: {
    width: 340,
    height: 660,
    groups: {
      pipeline: { x: 8, y: 88, w: 324, h: 84 },
      client: { x: 8, y: 322, w: 324, h: 252 },
      "host-pool": { x: 20, y: 374, w: 300, h: 114 },
    },
    nodes: {
      "key-vault": { x: 200, y: 8, w: 110 },
      terraform: { x: 39, y: 124, w: 120 },
      "pipeline-powershell": { x: 171, y: 124, w: 130 },
      "image-builder": { x: 150, y: 196, w: 170 },
      provisioning: { x: 32, y: 252, w: 160 },
      "session-hosts": { x: 130, y: 426, w: 180 },
      "active-directory": { x: 140, y: 512, w: 170 },
      users: { x: 8, y: 606, w: 124 },
      "azure-monitor": { x: 156, y: 606, w: 176 },
    },
    edges: {
      "key-vault->pipeline": { path: [[255, 40], [255, 88]], labelAt: [255, 64] },
      "pipeline->client": { path: [[20, 172], [20, 322]] },
      "provisioning->session-hosts": { path: [[180, 298], [180, 426]], labelAt: [180, 400] },
      "image-builder->session-hosts": { path: [[280, 228], [280, 426]], labelAt: [280, 310] },
      "session-hosts->active-directory": { path: [[225, 472], [225, 512]] },
      "users->host-pool": { path: [[70, 606], [70, 488]] },
      "azure-monitor->client": { path: [[300, 606], [300, 574]] },
    },
  },
};
