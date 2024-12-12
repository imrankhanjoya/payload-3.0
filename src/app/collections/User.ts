import type { CollectionConfig } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'

export const User: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: checkRoleAccess(['admin']),
    update: checkRoleAccess(['admin']),
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Influencer', value: 'influencer' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
