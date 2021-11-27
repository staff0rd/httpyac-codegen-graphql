import { OperationDefinitionNode, print } from "graphql";
import { buildVariables } from "./buildVariables";
import { Config } from "./Config";

export const generateHttpFile = (
  operation: OperationDefinitionNode,
  config: Config
): string => {
  const { host } = config;
  const httpFile: string[] = [];

  const headers = buildHeaders(host, config);
  httpFile.push(headers.join("\n"));

  const request = print(operation);
  httpFile.push(request);

  const schemaVariables = operation.variableDefinitions;
  const configVariables = (config.variables ?? {})[operation.name?.value ?? ""];
  const variables = buildVariables(configVariables, schemaVariables);
  if (variables) httpFile.push(JSON.stringify(variables, null, 2));

  return httpFile.join("\n\n");
};

const buildHeaders = (host: string, config: Config) => {
  const headers: string[] = [];
  headers.push(`POST ${host}\nContent-Type: application/json`);

  if (config.headers) {
    for (const [header, value] of Object.entries(config.headers)) {
      headers.push(`${header}: ${value}`);
    }
  }
  return headers;
};
