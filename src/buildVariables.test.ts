import { buildVariables } from "./buildVariables";

describe("buildVariables", () => {
  it("sets non-null variables with no config to $<variable>", () => {
    expect(
      buildVariables(null, [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "id",
            },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ID",
              },
            },
          },
        },
      ])
    ).toStrictEqual({ id: "$id" });
  });
  it("sets non-null variables with config to config value", () => {
    expect(
      buildVariables({ id: "my-value" }, [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "id",
            },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ID",
              },
            },
          },
        },
      ])
    ).toStrictEqual({ id: "my-value" });
  });
  it("sets null variables with config to config value", () => {
    expect(
      buildVariables({ find: "my-value" }, [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "find",
            },
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "CoresFind",
            },
          },
        },
      ])
    ).toStrictEqual({ find: "my-value" });
  });
  it("sets null variables with no config to null", () => {
    expect(
      buildVariables(null, [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "find",
            },
          },
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "CoresFind",
            },
          },
        },
      ])
    ).toStrictEqual({ find: null });
  });
});
