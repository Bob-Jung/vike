// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext) {
  const { Page } = pageContext
  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <PageLayout>
        <Page />
      </PageLayout>
    )
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${viewHtml}</div>
      </body>
    </html>`
}
