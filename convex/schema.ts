import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  open_calls: defineTable({
    title: v.optional(v.string()), // Optional title if type/institution isn't enough
    type: v.string(),
    institution: v.string(),
    link: v.string(),
    deadline: v.string(),
    requirements: v.array(v.string()),
    location: v.string(),
  }),
})
