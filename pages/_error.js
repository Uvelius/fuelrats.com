import fetch from 'isomorphic-fetch'
import Error from 'next/error'
import React from 'react'
import Router from 'next/router'





export default class extends React.Component {
  static async getInitialProps({ pathname, req, res }) {
    console.log('req.url', req.url)

    if (/^\/\w+$/.test(req.url)) {
      let response = await fetch(`/confluence-api/${req.url.replace('/')}`)
      response = await response.json()

//      console.log(response)
    }

    const statusCode = res
      ? res.statusCode
      : jsonPageRes ? jsonPageRes.status : null
    return { statusCode }
  }

  render() {
    return (
      <Error statusCode={this.props.statusCode}/>
    )
  }
}
