import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  fileName: text('file_name').notNull(),
  objectKey: text('object_key').notNull().unique(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
})
