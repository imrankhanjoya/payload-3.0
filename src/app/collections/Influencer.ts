import { ObjectId } from 'mongodb'
import type { CollectionConfig } from 'payload'

export const Influencer: CollectionConfig = {
  slug: 'influencers',
  admin: {
    description:"Create your introduction",
    useAsTitle: 'name',
    
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false // Deny access if no user
      if (user.role === 'admin') return true // Admins can read all records
      if (user.role === 'influencer') {
        return { infuencer: { equals: user.id } } // Influencers can only read their own records
      }
      return false // Deny access for all other roles
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' // Only admins can create
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true // Admins can update all records
      if (user.role === 'influencer') {
        return { infuencer: { equals: user.id } } // Influencers can only update their own records
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' // Only admins can delete
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
      name: 'website',
      label: 'Website',
      type: 'text',
    },
    {
      name: 'experiance',
      label: 'Years of experience',
      type: 'number',
    },
    {
      name: 'industry',
      label: 'Industry',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Fashion and Beauty', value: 'Fashion and Beauty' },
        { label: 'Travel and Hospitality', value: 'Travel and Hospitality' },
        { label: 'Technology and Gadgets', value: 'Technology and Gadgets' },
        { label: 'Parenting and Family', value: 'Travel and Hospitality' },
        { label: 'Health and Fitness', value: 'Health and Fitness' },
        { label: 'Food and Beverage', value: 'Food and Beverage' },
        { label: 'Finance and Investment', value: 'Finance and Investment' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Gaming', value: 'Gaming' },
      ],
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
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
      name: 'publish',
      label: 'Publish',
      type: 'checkbox',
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
      relationTo: 'users', // Reference to the `users` collection
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        // Check if the operation is CREATE or UPDATE
        if (req.user) {
          // If a user is selected in the dropdown, save their ObjectId
          if (data.infuencer && typeof data.infuencer === 'string') {
            try {
              data.infuencer = data.infuencer.toString()
              //data.infuencer = new ObjectId(data.infuencer) // Convert to ObjectId
            } catch (e) {
              console.error('Invalid infuencer ID:', e)
            }
          }

          // Auto-assign the logged-in user as the creator if creating a new record
          if (operation === 'create') {
            data.createdBy = new ObjectId(req.user.id) // Set the creator
          }
        }
        return data
      },
    ],
  },
}
