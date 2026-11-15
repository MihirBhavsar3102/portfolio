import { describe, expect, it } from "vitest";
import { diagrams } from "@/content/work/diagrams";
import { phoneView } from "@/components/diagram/geometry";
import { resume } from "@/lib/resume-data";
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
  // The wallet study's sources are its public repository (README and docs/), not the resume.
  ...["content/work/digital-wallet-devops.mdx", "lib/resume-data.ts"].flatMap((file) => [
    { file, text: "deployed to production", why: "production was configured and plan-checked, never applied" },
    { file, text: "my application", why: "the wallet app is tedrosdev's, not mine" },
    { file, text: "my app", why: "the wallet app is tedrosdev's, not mine" },
    { file, text: "HTTPS everywhere", why: "the load balancer is HTTP only" },
    { file, text: "zero downtime", why: "nothing measured downtime" },
  ]),
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

describe("wallet study order and honesty", () => {
  it("sits fourth, between the HR assistant and the DevSecOps pipeline", () => {
    expect(resume.projects.map((p) => p.slug)).toEqual([
      "avd-automation", "aws-web-platform", "hr-policy-assistant", "digital-wallet-devops", "devsecops-pipeline",
    ]);
  });
  it("says what was not done", () => {
    const mdx = readSource("content/work/digital-wallet-devops.mdx");
    for (const said of ["it was never applied", "plain HTTP", "written by someone else"]) expect(mdx, said).toContain(said);
  });
  it("draws production as configured, not applied", () => {
    expect(diagrams["digital-wallet-devops"].nodes.find((n) => n.id === "prod")?.meta).toBe("configured, not applied");
  });
  it("never lines the deploy up with a line leaving the Auto Scaling group, which would read as Merge feeding what that line reaches", () => {
    const d = diagrams["digital-wallet-devops"];
    for (const [layout, view] of [["desktop", d], ["phone", phoneView(d)]] as const) {
      const deploy = view.edges.find((e) => e.from === "cd" && e.to === "asg")!.path[0][0];
      // Every line that leaves the group straight up or down, as the deploy arrives.
      const leaving = view.edges.filter((e) => e.from === "asg" && e.path[0][0] === e.path[1][0]);
      for (const e of leaving) expect(Math.abs(e.path[0][0] - deploy), `${layout}: asg->${e.to}`).toBeGreaterThanOrEqual(12);
    }
  });
});
