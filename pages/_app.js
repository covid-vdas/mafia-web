import { useEffect } from 'react'
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap')
    })
    return <SWRConfig
        value={{
            fetcher: fetch,
            onError: (err) => {
                console.error(err)
            },
        }}
    >
        <Component {...pageProps} />
    </SWRConfig>
}

export default MyApp
