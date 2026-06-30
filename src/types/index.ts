export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'MARKETING' | 'RECEPTION'
export type PropertyType = 'VILLA' | 'APARTMENT' | 'LAND' | 'BUILDING' | 'SHOP' | 'OFFICE' | 'WAREHOUSE'
export type PropertyPurpose = 'SALE' | 'RENT'
export type PropertyStatus = 'READY' | 'UNDER_CONSTRUCTION' | 'RENTED' | 'SOLD'
export type ContractType = 'SALE' | 'RENT'
export type ContractStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING'
export type ClientStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NEGOTIATING' | 'CLOSED' | 'LOST'
export type DealType = 'SALE' | 'RENT' | 'BOTH'
export type RentalStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'PAYMENT_DUE' | 'CONTRACT_EXPIRY'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface PropertyImage {
  id: string
  propertyId: string
  url: string
  publicId: string
  isMain: boolean
  order: number
}

export interface Property {
  id: string
  title: string
  description?: string
  type: PropertyType
  purpose: PropertyPurpose
  status: PropertyStatus
  price: number
  area: number
  rooms?: number
  bathrooms?: number
  floor?: number
  facing?: string
  district?: string
  city: string
  address?: string
  lat?: number
  lng?: number
  featured: boolean
  views: number
  ownerId?: string
  createdAt: Date
  updatedAt: Date
  owner?: Owner
  images?: PropertyImage[]
  amenities?: { id: string; name: string }[]
}

export interface Owner {
  id: string
  name: string
  phone: string
  whatsapp?: string
  email?: string
  nationalId?: string
  address?: string
  notes?: string
  dealType: DealType
  createdAt: Date
  updatedAt: Date
  properties?: Property[]
}

export interface Client {
  id: string
  name: string
  phone: string
  whatsapp?: string
  email?: string
  budget?: number
  requirements?: string
  status: ClientStatus
  source?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Contract {
  id: string
  contractNumber: string
  type: ContractType
  status: ContractStatus
  propertyId: string
  clientId: string
  ownerId?: string
  startDate: Date
  endDate: Date
  amount: number
  pdfUrl?: string
  notes?: string
  createdAt: Date
  property?: Property
  client?: Client
  owner?: Owner
}

export interface Rental {
  id: string
  propertyId: string
  clientId: string
  amount: number
  paymentDay: number
  startDate: Date
  endDate: Date
  status: RentalStatus
  notes?: string
  createdAt: Date
  property?: Property
  client?: Client
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  imageUrl?: string
  published: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
  author?: User
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  relatedId?: string
  createdAt: Date
}

export interface DashboardStats {
  totalProperties: number
  totalClients: number
  totalOwners: number
  totalContracts: number
  totalRevenue: number
  activeRentals: number
  propertiesForSale: number
  propertiesForRent: number
  recentProperties: Property[]
  recentClients: Client[]
  monthlyRevenue: { month: string; amount: number }[]
  propertyTypeDistribution: { type: string; count: number }[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchFilters {
  type?: PropertyType
  purpose?: PropertyPurpose
  status?: PropertyStatus
  city?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  rooms?: number
  bathrooms?: number
  facing?: string
  featured?: boolean
  query?: string
  page?: number
  limit?: number
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  VILLA: 'فيلا',
  APARTMENT: 'شقة',
  LAND: 'أرض',
  BUILDING: 'عمارة',
  SHOP: 'محل تجاري',
  OFFICE: 'مكتب',
  WAREHOUSE: 'مستودع',
}

export const PROPERTY_PURPOSE_LABELS: Record<PropertyPurpose, string> = {
  SALE: 'للبيع',
  RENT: 'للإيجار',
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  READY: 'جاهز',
  UNDER_CONSTRUCTION: 'تحت الإنشاء',
  RENTED: 'مؤجر',
  SOLD: 'مباع',
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  NEW: 'جديد',
  CONTACTED: 'تم التواصل',
  INTERESTED: 'مهتم',
  NEGOTIATING: 'تفاوض',
  CLOSED: 'مغلق',
  LOST: 'خسارة',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'مدير النظام',
  MANAGER: 'مدير',
  EMPLOYEE: 'موظف',
  MARKETING: 'تسويق',
  RECEPTION: 'استقبال',
}

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  ACTIVE: 'نشط',
  EXPIRED: 'منتهي',
  CANCELLED: 'ملغي',
  PENDING: 'معلق',
}

export const DISTRICTS = [
  'الرانوناء', 'العزيزية', 'أبو ذر', 'البركة', 'البويطي',
  'الجماوات', 'الحرة الشرقية', 'الحرة الغربية', 'الخالدية',
  'الدفاع', 'السلام', 'السليمانية', 'الشهداء', 'العوالي',
  'النورة', 'بني حرام', 'بني خدرة', 'ذو الحليفة', 'قباء',
  'العوالي', 'المصانع', 'المطار', 'الدويمة', 'وادي الجماء'
]

export const AMENITIES = [
  'مسبح', 'مجلس', 'غرفة خادمة', 'مطبخ مجهز', 'موقف سيارات',
  'حديقة', 'مصعد', 'تكييف مركزي', 'نظام أمني', 'غرفة سينما',
  'صالة رياضية', 'غرفة غسيل', 'مخزن', 'تراس', 'بلكونة'
]
