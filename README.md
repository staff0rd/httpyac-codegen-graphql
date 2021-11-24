# httpyac-codegen-graphql

## developing

This preset can be cloned locally and developed. During development however, `graphql-code-generator` needs to be patched locally until [this PR](https://github.com/dotansimha/graphql-code-generator/pull/7055) is merged.

### build & run

```bash
yarn
yarn build && yarn codegen
```

With logging

```bash
yarn build && yarn codegen | more
```
