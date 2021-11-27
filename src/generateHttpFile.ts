import { OperationDefinitionNode, print } from "graphql";
import { buildVariables } from "./buildVariables";
import { Config } from "./Config";

export const generateHttpFile = (
  operation: OperationDefinitionNode,
  config: Config
): string => {
  const { host } = config;
  const httpFile: string[] = [];

  if (config.scripts) {
    const scripts: string[] = [];
    for (const { script, event } of config.scripts) {
      if (event) {
        scripts.push(`{{@${event}\n${script}\n}}`);
      } else {
        scripts.push(`{{\n${script}\n}}`);
      }
    }
    scripts.forEach((s) => httpFile.push(s));
  }

  if (config.httpFileVariables) {
    const httpFileVariables: string[] = [];
    for (const [variable, value] of Object.entries(config.httpFileVariables)) {
      httpFileVariables.push(`@${variable}=${value}`);
    }
    httpFile.push(httpFileVariables.join("\n"));
  }

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
