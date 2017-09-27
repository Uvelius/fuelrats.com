'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const proxy = require('koa-proxies')





module.exports = function (koa, config) {

  /******************************************************************************\
    Proxy Fuelrats API requests
  \******************************************************************************/

  koa.use(proxy('/token', {
    auth: `${config.api.clientId}:${config.api.clientSecret}`,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/token/, '/oauth2/token'),
    secure: true,
    target: config.api.url,
  }))

  koa.use(proxy('/api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api/, ''),
    secure: true,
    target: config.api.url,
  }))





  /******************************************************************************\
    Proxy EDSM API requests
  \******************************************************************************/

  koa.use(proxy('/edsm-api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/edsm-api/, ''),
    target: config.edsm.url,
  }))





  /******************************************************************************\
    Proxy Wordpress requests
  \******************************************************************************/

  koa.use(proxy('/wp-api', {
    auth: `${config.wordpress.username}:${config.wordpress.password}`,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/wp\-api/, '/wp-json/wp/v2'),
    target: config.wordpress.url,
  }))

  koa.use(proxy('/wp-content', {
    target: config.wordpress.url,
  }))





  /******************************************************************************\
    Proxy Confluence API requests
  \******************************************************************************/

  koa.use(proxy('/confluence-api', {
    rewrite: path => path.replace(/^\/confluence-api/, `/rest/api/content?title=`),
    secure: true,
    target: config.confluence.url,
  }))
}
