import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'

export { render }
export { passToClient }

// See https://vike.dev/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
