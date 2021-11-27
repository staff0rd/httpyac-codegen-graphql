import { OperationDefinitionNode } from "graphql";
import { generateHttpFile } from "./generateHttpFile";

describe("generateHttpFile", () => {
  const operation: OperationDefinitionNode = {
    kind: "OperationDefinition",
    selectionSet: { kind: "SelectionSet", selections: [] },
    operation: "query",
  };
  describe("scripts", () => {
    it("includes script", () => {
      const result = generateHttpFile(operation, {
        host: "http://whatever.com",
        scripts: [
          {
            script: "console.log('hello');",
          },
        ],
      });
      expect(result).toContain("console.log('hello');");
    });
  });
  describe("headers", () => {
    it("includes Content-Type header", () => {
      const result = generateHttpFile(operation, {
        host: "http://whatever.com",
      });
      expect(result).toContain("Content-Type: application/json");
    });

    it("includes additional headers", () => {
      const result = generateHttpFile(operation, {
        host: "http://whatever.com",
        headers: {
          Authorization: "openid implicit oauth",
        },
      });
      expect(result).toContain("Authorization: openid implicit oauth");
    });
  });
});
