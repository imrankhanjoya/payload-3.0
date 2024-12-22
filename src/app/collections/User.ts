import type { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import { isAdmin } from '@/access/isAdmin'

export const User: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: isAdmin,
    update: isAdminOrSelf,
    read: isAdminOrSelf,
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
        // update: isAdminOrSelf,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        // { label: 'Influencer', value: 'influencer' },
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
