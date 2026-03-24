import config from '@payload-config'
import '@payloadcms/next/css'
import '../../styles/admin.css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap'

type Args = {
    children: React.ReactNode
}

import { serverFunction } from './actions'

const Layout = ({ children }: Args) => (
    <RootLayout
        config={config}
        importMap={importMap}
        serverFunction={serverFunction}
    >
        {children}
    </RootLayout>
)

export default Layout
