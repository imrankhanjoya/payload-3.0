import type { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import { isAdmin } from '@/access/isAdmin'
export const Campaign: CollectionConfig = {
  slug: 'campaigns',
  access: {
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    read: isAdminOrSelf,
    delete: isAdmin,
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
      name: 'agerange',
      label: 'Age Range',
      type: 'select',
      options: [
        { label: '18-20 years', value: '18-20' },
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
        { label: 'Both', value: 'Both' },
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

    {
      name: 'budget',
      label: 'Budget for campaign',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'rate',
      label: 'Rate',
      type: 'select',
      options: [
        { label: 'Commission in %', value: 'commission' },
        { label: 'Cost Per post', value: 'perpost' },
        { label: 'Discount', value: 'discount' },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
      defaultValue: 'commission',
    },

    {
      name: 'ratevalue',
      label: 'Rate value',
      type: 'text',
      admin: {
        position: 'sidebar',
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
