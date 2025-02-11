// https://vike.dev/onRenderHtml
export default onRenderHtml

import { escapeInject } from 'vike/server'
import type { PageContextServer } from './types'

// SPA mode: the HTML is static with an empty <div id="root">, see https://vike.dev/render-modes#spa
function onRenderHtml(pageContext: PageContextServer) {
  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Solid App</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `
}
