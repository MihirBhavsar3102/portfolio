import { describe, expect, it } from "vitest";
import { diagrams } from "@/content/work/diagrams";
import { readSource } from "./source-files";

/**
 * Phrasings the Phase 2 review found going beyond the October resume and the
 * questionnaire. Each stays out unless Mihir confirms the claim.
 */
const UNSOURCED = [
  {
    file: "content/work/avd-automation.mdx",
    text: "The pipeline's PowerShell provisioning",
    why: "B1.2 doesn't say the pipeline runs the provisioning script",
  },
  { file: "content/work/avd-automation.mdx", text: "each session host", why: "adds scope" },
  { file: "content/work/avd-automation.mdx", text: "build each virtual machine", why: "adds scope" },
  {
    file: "content/work/avd-automation.mdx",
    text: "had to fit what each one asked for",
    why: "B1.4 says only that the clients set the constraints",
  },
  {
    file: "content/work/aws-web-platform.mdx",
    text: "Ansible configures the instances",
    why: "the resume doesn't say what Ansible configures",
  },
  {
    file: "content/work/hr-policy-assistant.mdx",
    text: "The chatbot replaces",
    why: "present tense says it is in use today; A7 retired that claim",
  },
  { file: "content/work/hr-policy-assistant.mdx", text: "used to mean", why: "implies the chatbot is in use now" },
  {
    file: "content/work/devsecops-pipeline.mdx",
    text: "Every push goes through",
    why: "implies every push deploys; what stops a build (B4.5) is unknown",
  },
  { file: "lib/resume-data.ts", text: "The whole platform", why: "the resume says its AWS infrastructure is Terraform, not all of it" },
  { file: "lib/resume-data.ts", text: "Linux servers underneath", why: "invents a relationship between the servers and the estate" },
];

describe("unsourced claims", () => {
  it.each(UNSOURCED)('$file avoids "$text" ($why)', ({ file, text }) => {
    expect(readSource(file)).not.toContain(text);
  });
});

describe("diagram claims", () => {
  it("draws the VM-provisioning script outside the Azure DevOps pipeline, since B1.2 doesn't place it there", () => {
    const d = diagrams["avd-automation"];
    const script = d.nodes.find((n) => n.meta === "PowerShell script");
    expect(script).toBeDefined();
    expect(script?.group).toBeUndefined();
    expect(d.edges.find((e) => e.to === "session-hosts" && e.label === "creates VMs")?.from).toBe(script?.id);
  });

  it("stops the Ansible edge at the region, since the source doesn't say what Ansible configures", () => {
    const d = diagrams["aws-web-platform"];
    expect(d.edges.filter((e) => e.from === "ansible").map((e) => e.to)).toEqual(["region"]);
  });
});
