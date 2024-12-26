import payload from 'payload'
import type { NextApiRequest, NextApiResponse } from 'next'
import { fieldAffectsData, fieldHasSubFields } from 'payload'
import type { Field } from './types/payload'
// import { getCookieExpiration } from 'payload/utilities'
import jwt from 'jsonwebtoken'

// Remaining code stays the same

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method not allowed' })
  // }
  return 0

  function getCookieExpiration(duration: string | number): Date {
    const now = new Date()
    const ms = typeof duration === 'string' ? parseDuration(duration) : duration * 1000
    now.setTime(now.getTime() + ms)
    return now
  }

  // Helper function to parse duration strings like "1d", "2h"
  function parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/)
    if (!match) throw new Error(`Invalid duration format: ${duration}`)

    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 's':
        return value * 1000 // Seconds
      case 'm':
        return value * 60 * 1000 // Minutes
      case 'h':
        return value * 60 * 60 * 1000 // Hours
      case 'd':
        return value * 24 * 60 * 60 * 1000 // Days
      default:
        throw new Error(`Unsupported duration unit: ${unit}`)
    }
  }

  console.log(`Request method: ${req.method}`)
  console.log(`Request headers:`, req.headers)
  console.log(`Request body:`, req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const userCollection = payload.config.admin?.user

    if (!userCollection) {
      return res.status(500).json({ error: 'User collection is not configured.' })
    }

    const userDocs = await payload.find({
      collection: userCollection,
      where: {
        email: {
          equals: email,
        },
      },
      depth: 0,
      limit: 1,
    })

    if (userDocs.totalDocs === 0) {
      return res.status(400).json({ error: 'User not found.' })
    }

    const user = userDocs.docs[0]
    const collectionConfig = payload.collections[userCollection]?.config

    if (!collectionConfig) {
      return res.status(500).json({ error: 'Collection configuration not found.' })
    }

    const fieldsToSign = collectionConfig.fields.reduce(
      (signedFields: Record<string, any>, field: Field) => {
        const result = { ...signedFields }

        if (!fieldAffectsData(field) && fieldHasSubFields(field)) {
          field.fields.forEach((subField) => {
            if (fieldAffectsData(subField) && subField.saveToJWT) {
              result[subField.name] = user[subField.name]
            }
          })
        }

        if (fieldAffectsData(field) && field.saveToJWT) {
          result[field.name] = user[field.name]
        }

        return result
      },
      {
        email: user.email,
        id: user.id,
        collection: collectionConfig.slug,
      },
    )

    const token = jwt.sign(fieldsToSign, payload.secret, {
      expiresIn: collectionConfig.auth.tokenExpiration,
    })

    res.setHeader(
      'Set-Cookie',
      `${payload.config.cookiePrefix}-token=${token}; Path=/; HttpOnly; Expires=${getCookieExpiration(
        collectionConfig.auth.tokenExpiration,
      ).toUTCString()}; Secure; SameSite=${collectionConfig.auth.cookies.sameSite}`,
    )

    return res.status(200).json({ token, email, id: user.id })
  } catch (error) {
    console.error('Force Login Error:', error)
    res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
