# httpyac-codegen-graphql

A GraphQL code generator preset for generating [httpyac](https://httpyac.github.io/) requests.

## Usage

Add dependencies:

```bash
npm i -D @graphql-codegen/cli httpyac-codegen-graphql
```

Add `codegen.yml`:

```yml
schema: https://api.spacex.land/graphql
generates:
  spacex:
    preset: httpyac-codegen-graphql
    presetConfig:
      host: https://api.spacex.land/graphql
      variables:
        ship_query:
          id: HAWK
        cores_query:
          id: B1034
```

Generate requests:

```bash
npx graphql-codegen
```

Execute request:

```bash
httpyac spacex/ship_query.http --all
```

## Developing

This preset can be cloned locally and developed. During development however, `graphql-code-generator` needs to be patched locally until [this PR](https://github.com/dotansimha/graphql-code-generator/pull/7055) is merged.

### Build & run

```bash
yarn
yarn build && yarn codegen
```

With logging

```bash
yarn build && yarn codegen | more
```
