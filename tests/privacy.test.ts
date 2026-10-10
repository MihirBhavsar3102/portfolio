import { describe, expect, it } from "vitest";
import { listSourceFiles, readSource } from "./source-files";

describe("privacy", () => {
  it("never renders the phone number", () => {
    const offenders = listSourceFiles(["app", "components"]).filter((f) =>
      /7096259248|resume\.phone/.test(readSource(f)),
    );
    expect(offenders).toEqual([]);
  });
});
