import { OperationDefinitionNode } from "graphql";
import { generateHttpFile } from "./generateHttpFile";

describe("generateHttpFile", () => {
  describe("headers", () => {
    const operation: OperationDefinitionNode = {
      kind: "OperationDefinition",
      selectionSet: { kind: "SelectionSet", selections: [] },
      operation: "query",
    };
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
