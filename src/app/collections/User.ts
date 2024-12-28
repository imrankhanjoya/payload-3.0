import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdmin } from '@/access/isAdmin'

export const User: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
  access: {
    create: isAdmin,
    update: isAdminOrEditor,
    read: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      hasMany: false,
      access: {
        // create: isAdmin,
        // update: isAdminOrEditor,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Influencer', value: 'influencer' },
        // { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'Admin',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
