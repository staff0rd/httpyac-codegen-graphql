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
  httpFile.push(request);

  const variables = config.variables[operation.name.value];
  if (variables) httpFile.push(JSON.stringify(variables));

  return httpFile.join("\n\n");
};
