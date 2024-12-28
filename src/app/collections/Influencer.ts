import type { CollectionConfig } from 'payload'

export const Influencer: CollectionConfig = {
  slug: 'influencers',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false // Deny access if no user is logged in
      if (user.role === 'admin') return true // Admins can read all records
      if (user.role === 'influencer') {
        return { infuencer: { equals: user.id } } // Influencers can only read their own records
      }
      return false // Deny access for all other roles
    },
    create: ({ req: { user } }) => {
      if (!user) return false // Deny if no user
      //      return user.role === 'influencer' || user.role === 'admin' // Allow influencers and admins to create
      return user.role === 'admin' // Allow influencers and admins to create
    },
    update: ({ req: { user } }) => {
      if (!user) return false // Deny if no user
      if (user.role === 'admin') return true // Admins can update all records
      if (user.role === 'influencer') {
        return { infuencer: { equals: user.id } } // Influencers can only update their own records
      }
      return false // Deny for all other roles
    },
    delete: ({ req: { user } }) => {
      if (!user) return false // Deny if no user
      return user.role === 'admin' // Only admins can delete records
    },
  },

  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'userid',
      label: 'Userid',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'richText',
    },
    {
      name: 'industry',
      label: 'Industry',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Fashion', value: 'fashion' },
        { label: 'Health', value: 'health' },
        { label: 'Travel', value: 'travels' },
      ],
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: [
        { label: 'India', value: 'IN' },
        { label: 'Indonesia', value: 'ID' },
        { label: 'Thailand', value: 'TH' },
        { label: 'Singapore', value: 'SG' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'turnaroundtime',
      label: 'Turn Around Time',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'infuencer',
      label: 'Select User',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: ({ req: { user } }) => user.role === 'admin', // Only admins can update this field
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (req.user && operation === 'create') {
          data.infuencer = req.user.id // Automatically associate record with the logged-in user
        }
        return data
      },
    ],
  },
}
