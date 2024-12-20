import type { CollectionConfig } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'

export const Campaign: CollectionConfig = {
  slug: 'campaigns',
  access: {
    read: () => true, // Allow everyone to read
    update: () => true, // Allow everyone to update
    delete: checkRoleAccess(['admin']),
    create: checkRoleAccess(['admin', 'editor']),
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
    },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
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
      name: 'agerange',
      label: 'Age Range',
      type: 'select',
      options: [
        { label: '10-20 years', value: '10-20' },
        { label: '21-30 years', value: '21-30' },
        { label: '31-40 years', value: '31-40' },
        { label: '41-50 years', value: '41-50' },
        { label: '55-60 years', value: '51-60' },
        { label: '60 and above', value: '60+' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
      defaultValue: '21-30',
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
      defaultValue: 'Male',
    },
    {
      name: 'startdate',
      label: 'Start date',
      type: 'date',
    },
    {
      name: 'enddate',
      label: 'End date',
      type: 'date',
    },
    {
      name: 'campaignImage1',
      label: 'Campaign Image1',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'campaignImage2',
      label: 'Campaign Image2',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'campaignImage3',
      label: 'Campaign Image3',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => !!data?.createdBy,
      },
    },

    {
      name: 'brand',
      label: 'Brand',
      type: 'relationship',
      relationTo: 'brands',
      admin: {
        // readOnly: true,
        position: 'sidebar',
        //   condition: (data) => !!data?.createdBy,
      },
    },

    {
      name: 'socialmedia',
      label: 'Social media type',
      type: 'relationship',
      relationTo: 'socialmedia',
      admin: {
        // readOnly: true,
        position: 'sidebar',
        //   condition: (data) => !!data?.createdBy,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (req.user) {
          // if (operation === 'create') {
          //   data.updatedBy = req.user.id
          //   data.createdBy = req.user.id
          // } else if (operation === 'update') {
          data.createdBy = req.user.id
          //}
          return data
        }
      },
    ],
  },
}
