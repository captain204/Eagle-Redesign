import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'
import { Tags } from './collections/Tags'
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'
import { Orders } from './collections/Orders'
import { Coupons } from './collections/Coupons'
import { ProductReviews } from './collections/ProductReviews'
import { AbandonedCarts } from './collections/AbandonedCarts'
import { AuditLogs } from './collections/AuditLogs'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { ShippingSettings } from './globals/ShippingSettings'
import { TaxSettings } from './globals/TaxSettings'
import { Appearance } from './globals/Appearance'
import { Notifications } from './globals/Notifications'
import { SiteHealth } from './globals/SiteHealth'
import { EcommerceDashboard } from './globals/EcommerceDashboard'
import { SalesReports } from './globals/SalesReports'
import { QRGenerator } from './globals/QRGenerator'
import { Menus } from './collections/Menus'
import { Ambassadors } from './collections/Ambassadors'
import { Distributors } from './collections/Distributors'
import { Submissions } from './collections/Submissions'
import { Sliders } from './collections/Sliders'
import { QRCodes } from './collections/QRCodes'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Support } from './globals/Support'





const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: 'users',
        importMap: {
            baseDir: path.resolve(dirname),
        },
        components: {
            views: {
                Dashboard: {
                    Component: '/components/admin/Dashboard#Dashboard',
                },
            },
        },
    },
    collections: [
        Users,
        Media,
        Categories,
        Tags,
        Products,
        Pages,
        Posts,
        Comments,
        Orders,
        Coupons,
        ProductReviews,
        AbandonedCarts,
        AuditLogs,
        Menus,
        Ambassadors,
        Distributors,
        Submissions,
        Sliders,
        QRCodes,
        ContactSubmissions,
    ],


    globals: [
        SiteSettings,
        Navigation,
        ShippingSettings,
        TaxSettings,
        Appearance,
        Notifications,
        SiteHealth,
        EcommerceDashboard,
        SalesReports,
        QRGenerator,
        Support,
    ],




    editor: lexicalEditor(),
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URI || 'file:./payload.db',
        },
        push: true, // Auto-create tables in production so the app doesn't crash on an empty DB
    }),
    secret: process.env.PAYLOAD_SECRET || 'secret-key-for-development-only',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    telemetry: false,
})
