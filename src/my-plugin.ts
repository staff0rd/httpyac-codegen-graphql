import {
  DocumentNode,
  GraphQLSchema,
  Kind,
  OperationDefinitionNode,
  print,
} from "graphql";
import {
  PluginFunction,
  PluginValidateFn,
  Types,
} from "@graphql-codegen/plugin-helpers";
import { OperationsDocumentConfig } from "./config";
import {
  getRootTypeMap,
  buildOperationNodeForField,
} from "@graphql-tools/utils";

export const plugin: PluginFunction<OperationsDocumentConfig> = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: OperationsDocumentConfig,
  info
): Promise<Types.PluginOutput> => {
  console.log(JSON.stringify(info));
  const rootTypeMap = getRootTypeMap(schema);
  const definitions: OperationDefinitionNode[] = [];
  for (const [kind, rootType] of rootTypeMap) {
    for (const field in rootType.getFields()) {
      const operationDefinitionNode: OperationDefinitionNode =
        buildOperationNodeForField({
          schema,
          kind,
          field,
          depthLimit: config.depthLimit,
          circularReferenceDepth: config.circularReferenceDepth,
        });
      definitions.push(operationDefinitionNode);
      //console.error("root", field, print(operationDefinitionNode));
    }
  }
  const document: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions,
  };
  const content = print(document);
  return {
    content,
  };
};

export const validate: PluginValidateFn<OperationsDocumentConfig> = async (
  _schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  config: OperationsDocumentConfig,
  outputFile: string
) => {};

export default { plugin, validate };
