import { OperationDefinitionNode, print } from "graphql";
import { buildVariables } from "./buildVariables";
import { Config } from "./Config";

export const generateHttpFile = (
  operation: OperationDefinitionNode,
  config: Config
): string => {
  const { host } = config;
  const httpFile: string[] = [];

  const contentType = `POST ${host}\nContent-Type: application/json`;
  httpFile.push(contentType);

  if (config.headers) {
    for (const [header, value] of Object.entries(config.headers)) {
      httpFile.push(`${header}: ${value}`);
    }
  }

  const request = print(operation);
  httpFile.push(request);

  const schemaVariables = operation.variableDefinitions;
  const configVariables = (config.variables ?? {})[operation.name?.value ?? ""];
  const variables = buildVariables(configVariables, schemaVariables);
  if (variables) httpFile.push(JSON.stringify(variables, null, 2));

  return httpFile.join("\n\n");
};
