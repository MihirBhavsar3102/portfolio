import type { Diagram } from "@/types/diagram";

/** One client's Azure Virtual Desktop estate, as the automation builds and watches it. */
export const avdAutomation: Diagram = {
  title: "One client's estate, built and watched by the automation",
  width: 760,
  height: 444,
  groups: [
    { id: "pipeline", label: "Azure DevOps pipeline", x: 208, y: 16, w: 306, h: 98 },
    { id: "client", label: "Client environment", note: "One of five clients", x: 152, y: 170, w: 592, h: 180 },
    { id: "host-pool", label: "Host pool", note: "Autoscaling", parent: "client", x: 168, y: 222, w: 376, h: 112 },
  ],
  nodes: [
    { id: "key-vault", label: "Key Vault", tech: "key-vault", x: 16, y: 63, w: 120 },
    { id: "terraform", label: "Terraform", tech: "terraform", group: "pipeline", x: 220, y: 56, w: 120 },
    { id: "powershell", label: "PowerShell", meta: "VM provisioning", tech: "powershell", group: "pipeline", x: 352, y: 56, w: 150 },
    { id: "image-builder", label: "VM Image Builder", tech: "azure-image-builder", x: 556, y: 56, w: 188 },
    { id: "session-hosts", label: "Session hosts", meta: "FSLogix profiles", tech: "azure-virtual-desktop", group: "host-pool", x: 300, y: 272, w: 220 },
    { id: "active-directory", label: "Active Directory", meta: "domain join", group: "client", x: 560, y: 272, w: 168 },
    { id: "users", label: "Users", meta: "VDI sessions", x: 16, y: 272, w: 124 },
    { id: "azure-monitor", label: "Azure Monitor", meta: "Log Analytics · KQL", tech: "azure-monitor", x: 348, y: 382, w: 200 },
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
      from: "terraform",
      to: "client",
      path: [[280, 88], [280, 170]],
      source: "resume: AVD — Azure DevOps pipelines running Terraform",
    },
    {
      from: "powershell",
      to: "session-hosts",
      label: "creates VMs",
      labelAt: [427, 146],
      path: [[427, 102], [427, 272]],
      source: "questionnaire B1.2 — the provisioning script creates each VM inside the host pool, end to end",
    },
    {
      from: "image-builder",
      to: "session-hosts",
      label: "golden image",
      path: [[650, 88], [650, 140], [490, 140], [490, 272]],
      source: "resume: AVD — Azure VM Image Builder golden-image pipelines",
    },
    {
      from: "session-hosts",
      to: "active-directory",
      path: [[520, 295], [560, 295]],
      source: "resume: AVD — automated Active Directory domain join",
    },
    {
      from: "users",
      to: "host-pool",
      path: [[140, 295], [168, 295]],
      source: "resume: AVD — client host pools supporting concurrent VDI users",
    },
    {
      from: "azure-monitor",
      to: "client",
      path: [[448, 382], [448, 350]],
      source: "resume: AVD — Azure Monitor and Log Analytics (KQL) observability for the VDI infrastructure",
    },
  ],
};
