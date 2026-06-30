import { PrismaClient, UserRole, PropertyType, PropertyPurpose, PropertyStatus, DealType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Super Admin
  const hashedPassword = await bcrypt.hash('Admin@1234', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@aliat-almadina.com' },
    update: {},
    create: {
      name: 'مدير النظام',
      email: 'admin@aliat-almadina.com',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      phone: '0597773332',
    },
  })

  await prisma.user.upsert({
    where: { email: 'ibrahim@aliat-almadina.com' },
    update: {},
    create: {
      name: 'إبراهيم الظاهري',
      email: 'ibrahim@aliat-almadina.com',
      password: hashedPassword,
      role: UserRole.MANAGER,
      phone: '0548639461',
    },
  })

  // Site Settings
  const settings = [
    { key: 'site_name', value: 'عالية المدينة للخدمات العقارية' },
    { key: 'site_phone', value: '0597773332' },
    { key: 'site_whatsapp', value: '966597773332' },
    { key: 'rental_manager_name', value: 'إبراهيم الظاهري' },
    { key: 'rental_manager_phone', value: '0548639461' },
    { key: 'site_address', value: 'المدينة المنورة - حي الرانوناء' },
    { key: 'site_email', value: 'info@aliat-almadina.com' },
    { key: 'map_center_lat', value: '24.4539' },
    { key: 'map_center_lng', value: '39.5942' },
    { key: 'facebook_url', value: '' },
    { key: 'twitter_url', value: '' },
    { key: 'instagram_url', value: '' },
    { key: 'youtube_url', value: '' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  // Sample Owners
  const owner1 = await prisma.owner.create({
    data: {
      name: 'محمد عبدالله السلمي',
      phone: '0501234567',
      whatsapp: '966501234567',
      email: 'msalmi@example.com',
      nationalId: '1234567890',
      address: 'المدينة المنورة - حي العزيزية',
      dealType: DealType.BOTH,
    },
  })

  const owner2 = await prisma.owner.create({
    data: {
      name: 'خالد أحمد العمري',
      phone: '0507654321',
      whatsapp: '966507654321',
      nationalId: '0987654321',
      address: 'المدينة المنورة - حي الرانوناء',
      dealType: DealType.RENT,
    },
  })

  // Sample Properties
  const properties = [
    {
      title: 'فيلا فاخرة في حي الرانوناء',
      description: 'فيلا فاخرة مكونة من دورين وملحق، تتميز بتشطيبات عالية الجودة وموقع متميز في قلب حي الرانوناء',
      type: PropertyType.VILLA,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.READY,
      price: 2500000,
      area: 450,
      rooms: 6,
      bathrooms: 4,
      floor: 2,
      facing: 'شمالية',
      district: 'الرانوناء',
      city: 'المدينة المنورة',
      address: 'حي الرانوناء، شارع الأمير سلطان',
      lat: 24.4539,
      lng: 39.5942,
      featured: true,
      ownerId: owner1.id,
    },
    {
      title: 'شقة مميزة للإيجار',
      description: 'شقة مميزة مكونة من 3 غرف نوم في موقع استراتيجي قريب من الخدمات والمرافق',
      type: PropertyType.APARTMENT,
      purpose: PropertyPurpose.RENT,
      status: PropertyStatus.READY,
      price: 35000,
      area: 180,
      rooms: 3,
      bathrooms: 2,
      floor: 3,
      facing: 'شرقية',
      district: 'الرانوناء',
      city: 'المدينة المنورة',
      lat: 24.4561,
      lng: 39.5978,
      featured: false,
      ownerId: owner2.id,
    },
    {
      title: 'أرض تجارية للبيع',
      description: 'أرض تجارية على شارع رئيسي مناسبة للاستثمار التجاري',
      type: PropertyType.LAND,
      purpose: PropertyPurpose.SALE,
      status: PropertyStatus.READY,
      price: 1800000,
      area: 800,
      district: 'العزيزية',
      city: 'المدينة المنورة',
      lat: 24.4489,
      lng: 39.5901,
      featured: true,
      ownerId: owner1.id,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({ data: property })
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Super Admin: admin@aliat-almadina.com / Admin@1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
