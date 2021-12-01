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

### Configuration

See [Config.ts](./src/Config.ts) for all configuration options.

The following configuration example uses a jwt to authenticate to appsync for introspection, and then generates .http files with authentication configured

```yaml
# codegen.yml
generates:
  output:
    schema:
      # to use introspection - othwerise just specify a graph.schema file
      https://<your-appsync-id>.appsync-api.ap-southeast-2.amazonaws.com/graphql:
        headers:
          Authorization: <your jwt>
    preset: httpyac-codegen-graphql
    presetConfig:
      host: https://<your-appsync-id>.appsync-api.ap-southeast-2.amazonaws.com/graphql
      headers:
        # enables implicit auth
        Authorization: openid implicit oauth
      httpFileVariables:
        # your oauth settings
        oauth_clientId: <your-client-id>
        oauth_authorizationEndpoint: https://login.microsoftonline.com/<your-tenant>/oauth2/authorize?resource=<your-resource-id>
        oauth_tokenEndpoint: https://login.microsoftonline.com/<your-tenant>/oauth2/v2.0/token
      scripts:
        # this script needed to remove 'Bearer' as appsync doesn't use it
        - event: request
          script: request.headers.Authorization = request.headers.Authorization.slice('Bearer '.length);
      variables:
        # set any graphql variables in your generated requests
        some_query:
          someVariable: some-value
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
