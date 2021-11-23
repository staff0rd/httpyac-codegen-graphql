import { OperationDefinitionNode, print } from "graphql";
import { Config } from "./Config";

export const generateHttpFile = (
  operation: OperationDefinitionNode,
  config: Config
): string => {
  const { host } = config;
  const httpFile: string[] = [];

  const headers = `POST ${host}\nContent-Type: application/json`;
  httpFile.push(headers);

  const request = print(operation);
  console.log(JSON.stringify(operation, null, 2));
  httpFile.push(request);

  const schemaVariables = operation.variableDefinitions;
  const configVariables = config.variables[operation.name.value];
  if (configVariables || schemaVariables?.length) {
    const mandatoryVariables = Object.fromEntries(
      schemaVariables
        .filter((v) => v.type.kind === "NonNullType")
        .map((v) => [
          v.variable.name.value,
          (configVariables || {})[v.variable.name.value] ??
            `$${v.variable.name.value}`,
        ])
    );

    httpFile.push(JSON.stringify(mandatoryVariables));
  }

  return httpFile.join("\n\n");
};
