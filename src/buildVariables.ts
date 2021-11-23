import { VariableDefinitionNode } from "graphql";

export const buildVariables = (
  configVariables: { [variable: string]: string },
  schemaVariables: readonly VariableDefinitionNode[] | undefined
) => {
  if (configVariables || schemaVariables?.length) {
    const entries = (schemaVariables ?? []).map((v) => {
      const key = v.variable.name.value;
      const value =
        configVariables?.[key] ??
        (v.type.kind === "NonNullType" ? `$${v.variable.name.value}` : null);
      return [key, value];
    });
    return Object.fromEntries(entries);
  }
};
