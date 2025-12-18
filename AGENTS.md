# Project Structure

The homepage is the whole app; a single list of "calls for art applications" that can be filtered.
The homepage doesn't call Convex directly - meaning it won't be live updating. The queries will go to the http server
through a normal tanstack query call. The server will return the response by querying convex on the server.
Note that the page is rendered server side (SSR) according to the filters but subsequent filtering happens like a normal SPA would.

In addition, for admins, we'll have the /admin route that requires authentication and is a normal SPA that will interact with Convex directly
using Tanstack Query that is initialized with the convex provider.

# check for issues

After making changes to the code, run `pnpm run check` do detect problems in the code. Do not fix problems you did not cause in your mosr recent change.

# typescript style

No use of `any`, and don't use `as` unless there's an absolute necessity - in which case you have to add a comment explaining why you did that.

# shadcn instructions

Use the latest version of Shadcn to install new components, like this command to add a button component:

```bash
pnpm dlx shadcn@latest add button
```

# zod

For runtime validations we use zod v4 (and not v3 as you might assume). Make sure to use zod v4 apis and not v3.

# Schemas (Convex)

When designing the schema please see this page on built in System fields and data types available: https://docs.convex.dev/database/types

Here are some specifics that are often mishandled:

## v (https://docs.convex.dev/api/modules/values#v)

The validator builder.

This builder allows you to build validators for Convex values.

Validators can be used in schema definitions and as input validators for Convex functions.

Type declaration
Name Type
id <TableName>(tableName: TableName) => VId<GenericId<TableName>, "required">
null () => VNull<null, "required">
number () => VFloat64<number, "required">
float64 () => VFloat64<number, "required">
bigint () => VInt64<bigint, "required">
int64 () => VInt64<bigint, "required">
boolean () => VBoolean<boolean, "required">
string () => VString<string, "required">
bytes () => VBytes<ArrayBuffer, "required">
literal <T>(literal: T) => VLiteral<T, "required">
array <T>(element: T) => VArray<T["type"][], T, "required">
object <T>(fields: T) => VObject<Expand<{ [Property in string | number | symbol]?: Exclude<Infer<T[Property]>, undefined> } & { [Property in string | number | symbol]: Infer<T[Property]> }>, T, "required", { [Property in string | number | symbol]: Property | `${Property & string}.${T[Property]["fieldPaths"]}` }[keyof T] & string>
record <Key, Value>(keys: Key, values: Value) => VRecord<Record<Infer<Key>, Value["type"]>, Key, Value, "required", string>
union <T>(...members: T) => VUnion<T[number]["type"], T, "required", T[number]["fieldPaths"]>
any () => VAny<any, "required", string>
optional <T>(value: T) => VOptional<T>

## System fields (https://docs.convex.dev/database/types#system-fields)

Every document in Convex has two automatically-generated system fields:

\_id: The document ID of the document.
\_creationTime: The time this document was created, in milliseconds since the Unix epoch.

You do not need to add indices as these are added automatically.

## Example Schema

This is an example of a well crafted schema.

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),

  sessions: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
  }).index("sessionId", ["sessionId"]),

  threads: defineTable({
    uuid: v.string(),
    summary: v.optional(v.string()),
    summarizer: v.optional(v.id("_scheduled_functions")),
  }).index("uuid", ["uuid"]),

  messages: defineTable({
    message: v.string(),
    threadId: v.id("threads"),
    author: v.union(
      v.object({
        role: v.literal("system"),
      }),
      v.object({
        role: v.literal("assistant"),
        context: v.array(v.id("messages")),
        model: v.optional(v.string()),
      }),
      v.object({
        role: v.literal("user"),
        userId: v.id("users"),
      }),
    ),
  }).index("threadId", ["threadId"]),
});
```

Sourced from: https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/convex-cursorrules-prompt-file/.cursorrules
