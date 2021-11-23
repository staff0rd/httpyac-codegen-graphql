import { Types } from "@graphql-codegen/plugin-helpers";
import * as addPlugin from "@graphql-codegen/add";
import {
  buildOperationNodeForField,
  getRootTypeMap,
} from "@graphql-tools/utils";
import { OperationDefinitionNode } from "graphql";
import { Config } from "./Config";
import { generateHttpFile } from "./generateHttpFile";

export const preset: Types.OutputPreset<Config> = {
  buildGeneratesSection: (options) => {
    const {
      schemaAst: schema,
      config: { depthLimit = 10, circularReferenceDepth = 1 },
      presetConfig,
    } = options;

    if (!schema) throw new Error(`Missing schema AST`);

    if (!presetConfig.host) throw new Error(`Must specify a host`);

    const rootTypeMap = getRootTypeMap(schema);
    const definitions: OperationDefinitionNode[] = [];
    for (const [kind, rootType] of rootTypeMap) {
      for (const field in rootType.getFields()) {
        const operationDefinitionNode: OperationDefinitionNode =
          buildOperationNodeForField({
            schema,
            kind,
            field,
            depthLimit: depthLimit,
            circularReferenceDepth: circularReferenceDepth,
          });
        definitions.push(operationDefinitionNode);
      }
    }

    const pluginMap = {
      ...options.pluginMap,
      [`add`]: addPlugin,
    };

    const buildArtifacts = (operations: OperationDefinitionNode[]) =>
      operations.map((operation) => ({
        ...options,
        pluginMap,
        plugins: [
          {
            [`add`]: {
              content: generateHttpFile(operation, presetConfig),
            },
          },
        ],
        filename: `${options.baseOutputDir}/${operation.name.value}.http`,
      }));

    if (presetConfig.include && presetConfig.include !== "*") {
      if (Array.isArray(presetConfig.include)) {
        return buildArtifacts(
          definitions.filter((definition) =>
            presetConfig.include.includes(definition.name.value)
          )
        );
      } else {
        return buildArtifacts(
          definitions.filter(
            (definition) => definition.name.value === presetConfig.include
          )
        );
      }
    }

    return buildArtifacts(definitions);
  },
};

export default preset;
