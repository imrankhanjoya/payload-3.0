import {CollectionConfig,FieldHook} from "payload"

export const Post: CollectionConfig={
    slug: 'posts',
    auth: true,
    admin: {
      useAsTitle:"name",
    },
    fields: [{
      name: 'title',
      type: 'text',
      required: true, 
    },
    {
        name: 'description',
        type: 'richText',
        required: true, 
      }],
}