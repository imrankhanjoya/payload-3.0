import { CollectionConfig, FieldHook } from 'payload'

export const Post: CollectionConfig = {
  slug: 'posts',
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
