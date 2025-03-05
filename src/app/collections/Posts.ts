import { CollectionConfig, FieldHook } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'
import { isAdmin } from '@/access/isAdmin'
export const Post: CollectionConfig = {
  slug: 'posts',
  access: {
    create: isAdmin,
    update: isAdmin,
    read: isAdmin,
    delete: isAdmin,
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
