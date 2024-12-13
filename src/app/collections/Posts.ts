import { CollectionConfig, FieldHook } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'
export const Post: CollectionConfig = {
  slug: 'posts',
  access: {
    read: checkRoleAccess(['admin']),
    update: checkRoleAccess(['admin']),
  },
  // admin: {
  //   useAsTitle:"title",
  // },
  // access:{
  //     delete: () => false,
  //     update: () => false,
  //     create: () => true,
  //     read: () => true,
  // },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
