# Zod 4 migration research

Issue: [#263](https://github.com/henrilhos/gametrakr/issues/263)

## Findings

- Zod's official migration guide recommends installing `zod@^4.0.0` for the v4 cutover. The current application uses the regular `zod` package entrypoint, which is the supported v4 API. [Zod migration guide](https://zod.dev/v4/changelog)
- Zod 4 unifies error customization under the `error` parameter. The previous `message` parameter remains supported but deprecated; `invalid_type_error`, `required_error`, and `errorMap` are removed. [Zod migration guide](https://zod.dev/v4/changelog)
- `ZodError.flatten()` and `.format()` are deprecated in favor of `z.treeifyError()`, while `.errors` is removed in favor of `.issues`. [Zod migration guide](https://zod.dev/v4/changelog)
- `ZodObject.merge()` is deprecated in favor of `.extend()`. [Zod migration guide](https://zod.dev/v4/changelog)
- Zod 4 changes defaults inside optional object fields, the input type of coercion schemas, and the behavior of `.default()`. [Zod migration guide](https://zod.dev/v4/changelog)

## Repository impact

The repository does not use the removed `invalid_type_error`, `required_error`, `errorMap`, `.errors`, `.merge()`, or `.nonstrict()` APIs. It does use `.flatten()` in the tRPC error formatter; the migration guide marks that method deprecated but still available, so this dependency bump does not require a behavior change for this issue. The existing schemas also use `message` for one validation message, which remains supported in Zod 4 but is deprecated; it should be migrated to `error` as part of the cutover.
