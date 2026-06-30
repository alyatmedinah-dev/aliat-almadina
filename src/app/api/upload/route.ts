import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image'
    const propertyId = formData.get('propertyId') as string
    const isMain = formData.get('isMain') === 'true'

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const folder = `aliat-almadina/${type === 'image' ? 'properties' : type + 's'}`

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: type === 'video' ? 'video' : 'auto',
          transformation: type === 'image'
            ? [{ quality: 'auto:best', fetch_format: 'auto', width: 1200, crop: 'limit' }]
            : undefined,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        }
      ).end(buffer)
    })

    // Save to database if propertyId provided
    if (propertyId && type === 'image') {
      if (isMain) {
        await prisma.propertyImage.updateMany({
          where: { propertyId },
          data: { isMain: false },
        })
      }
      await prisma.propertyImage.create({
        data: {
          propertyId,
          url: result.secure_url,
          publicId: result.public_id,
          isMain: isMain || false,
        },
      })
    } else if (propertyId && type === 'video') {
      await prisma.propertyVideo.create({
        data: {
          propertyId,
          url: result.secure_url,
          publicId: result.public_id,
        },
      })
    } else if (propertyId && type === 'pdf') {
      await prisma.propertyPDF.create({
        data: {
          propertyId,
          url: result.secure_url,
          publicId: result.public_id,
          name: file.name,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'فشل رفع الملف' }, { status: 500 })
  }
}
