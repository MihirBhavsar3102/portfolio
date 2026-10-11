import type { Diagram } from "@/types/diagram";
import { avdAutomation } from "@/content/work/diagrams/avd-automation";
import { awsWebPlatform } from "@/content/work/diagrams/aws-web-platform";
import { devsecopsPipeline } from "@/content/work/diagrams/devsecops-pipeline";
import { hrPolicyAssistant } from "@/content/work/diagrams/hr-policy-assistant";

/** Architecture diagrams by case-study slug; tests/diagrams.test.ts requires one per project. */
export const diagrams: Record<string, Diagram> = {
  "avd-automation": avdAutomation,
  "aws-web-platform": awsWebPlatform,
  "hr-policy-assistant": hrPolicyAssistant,
  "devsecops-pipeline": devsecopsPipeline,
};
