import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'

export const ApprovalRequest: CollectionConfig = {
  slug: 'approval-request',
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // admin: {
  //   hidden: isAdmin ? false : true,
  // },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
