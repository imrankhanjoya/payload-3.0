import {CollectionConfig,FieldHook} from "payload"

export const Post: CollectionConfig={
    slug: 'posts',
    auth: true,
    access: {
      delete: () => false,
      update: () => false,
    },
    fields: [{
      name: 'title',
      type: 'text',
      required: true, 
    }],
}