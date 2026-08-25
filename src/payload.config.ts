import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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
import { ReferralEarnings } from './collections/ReferralEarnings'
import { Support } from './globals/Support'
import { resendAdapter } from '@payloadcms/email-resend'





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
        ReferralEarnings,
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
    email: resendAdapter({
        defaultFromAddress: process.env.RESEND_DEFAULT_FROM || 'onboarding@resend.dev',
        defaultFromName: 'Eagle',
        apiKey: process.env.RESEND_API_KEY || 're_123_fallback',
    }),
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URI || 'file:./payload.db',
        },
        push: false, // Disabled to prevent Drizzle push race conditions on boot
    }),
    secret: process.env.PAYLOAD_SECRET || 'secret-key-for-development-only',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    sharp,
    telemetry: false,
    onInit: async (payload) => {
        try {
            const existingUsers = await payload.find({
                collection: 'users',
                where: {
                    email: {
                        equals: 'nurudeenakindele8@gmail.com'
                    }
                }
            });

            if (existingUsers.totalDocs === 0) {
                await payload.create({
                    collection: 'users',
                    data: {
                        email: 'nurudeenakindele8@gmail.com',
                        password: '%Laravel288%',
                        name: 'Admin',
                        role: 'super-admin'
                    }
                });
            } else {
                await payload.update({
                    collection: 'users',
                    id: existingUsers.docs[0].id,
                    data: {
                        password: '%Laravel288%'
                    }
                });
            }
        } catch (err) {
            console.error('Error seeding admin user:', err);
        }
    },
})
