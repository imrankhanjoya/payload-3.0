import type { CollectionConfig } from 'payload';
import { isAdminOrEditor } from '@/access/isAdminOrEditor';
import { isAdmin } from '@/access/isAdmin';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Influencer', value: 'influencer' },
      ],
      required: true,
      defaultValue: 'admin',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
  endpoints: [
    {
      path: '/oauth:email',
      method: 'get',
      handler: async (req: NextRequest) => {
        const payload = await getPayloadHMR({ config: configPromise });

        const userCollection = 'users';
        const email = req.nextUrl.searchParams.get('email');

        if (!email) {
          return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        try {
          const userDocs = await payload.find({
            collection: userCollection,
            where: {
              email: {
                equals: email,
              },
            },
            depth: 0,
            limit: 1,
          });

          if (userDocs.totalDocs === 0) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
          }

          const user = userDocs.docs[0];

          const fieldsToSign = {
            email: user.email,
            id: user.id,
            collection: userCollection,
          };

          const token = jwt.sign(fieldsToSign, payload.secret, {
            expiresIn: '7d', // Adjust the expiration if necessary
          });

          cookies().set({
            name: `${payload.config.cookiePrefix}-token`,
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

          return NextResponse.json(userDocs);
        } catch (error) {
          console.error('Error occurred:', error);
          return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
        }
      },
    },
  ],
};
