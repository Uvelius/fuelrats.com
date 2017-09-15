// Module imports
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import React from 'react'





// Component imports
import { actions } from '../store'
import LoginDialog from '../components/LoginDialog'
import Page from '../components/Page'





// Component constants
const title = 'Home'





class Home extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    if (this.props.query.authenticate) {
      this.showLogin()
    }
  }

  render () {
    return (
      <section className="hero">
        <header>
          <h1>We Have Fuel. You Don't.</h1>

          <h2>Any Questions?</h2>
        </header>

        <footer className="call-to-action">
          <Link href="/get-help">
            <a className="button">Get Help</a>
          </Link>
        </footer>
      </section>
    )
  }

  showLogin () {
    this.props.showDialog({
      body: (<LoginDialog />),
      closeIsVisible: true,
      menuIsVisible: false,
      title: 'Login',
    })
  }
}





const mapDispatchToProps = dispatch => {
  return {
    showDialog: bindActionCreators(actions.showDialog, dispatch),
  }
}





export default Page(Home, title, {
  mapDispatchToProps,
})
