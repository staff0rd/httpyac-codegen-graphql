import { Types } from "@graphql-codegen/plugin-helpers";
import * as addPlugin from "@graphql-codegen/add";
import {
  buildOperationNodeForField,
  getRootTypeMap,
} from "@graphql-tools/utils";
import { OperationDefinitionNode, print } from "graphql";
import { Config } from "./Config";

export const preset: Types.OutputPreset<Config> = {
  buildGeneratesSection: (options) => {
    const {
      schemaAst: schema,
      config: { depthLimit = 10, circularReferenceDepth = 1 },
    } = options;

    if (!schema) throw new Error(`Missing schema AST`);

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

    return definitions.map((d) => ({
      ...options,
      pluginMap,
      plugins: [
        {
          [`add`]: {
            content:
              `POST {{HOST}}\nContent-Type: application/json\n\n` + print(d),
          },
        },
      ],
      filename: `${options.baseOutputDir}/${d.name.value}.http`,
      //documents: null,
    }));
  },
};

export default preset;
