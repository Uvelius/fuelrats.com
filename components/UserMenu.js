// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import LocalForage from 'localforage'
import React from 'react'





// Component imports
import { actions } from '../store'
import AdminUserMenuNav from './AdminUserMenuNav'
import Component from './Component'
import LoginDialog from './LoginDialog'





class UserMenu extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    if (await LocalForage.getItem('access_token')) {
      this.props.getUser()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.loggedIn && !nextProps.user.attributes) {
      this.props.getUser()
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['showLogin'])
  }

  render () {
    const {
      loggedIn,
      logout,
      user,
    } = this.props

    let showAdmin = false

    if (loggedIn && user.attributes) {
      showAdmin = ['rat.read', 'rescue.read', 'user.read'].some(permission => user.permissions.has(permission))
    }

    return (
      <div className="user-menu">
        {(loggedIn && user.attributes) && (
          <div className="avatar medium"><img alt="Your avatar" src={user.attributes.image} /></div>
        )}

        {(loggedIn && user.attributes) && (
          <menu>
            <nav className="user">
              <ul>
                <li>
                  <Link href="/profile">
                    <a>My Profile</a>
                  </Link>
                </li>

                <li>
                  <Link href="/leaderboard">
                    <a>Leaderboard</a>
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </nav>

            {showAdmin && (
              <AdminUserMenuNav
                permissions={user.permissions} />
            )}

            <div
              className="stats"
              hidden>
              <header>My Stats</header>

              <table>
                <tbody>
                  <tr>
                    <th>Rescues</th>
                    <td>648</td>
                  </tr>
                  <tr>
                    <th>Assists</th>
                    <td>537</td>
                  </tr>
                  <tr>
                    <th>Favorite Ship</th>
                    <td>Asp Explorer</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </menu>
        )}

        {!loggedIn && (
          <button
            className="login"
            onClick={this.showLogin}>
            Login
          </button>
        )}
      </div>
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





const mapDispatchToProps = dispatch => ({
  getUser: bindActionCreators(actions.getUser, dispatch),
  logout: bindActionCreators(actions.logout, dispatch),
  showDialog: bindActionCreators(actions.showDialog, dispatch),
})

const mapStateToProps = state => {
  const {
    authentication,
    user,
  } = state

  return Object.assign({
    user,
  }, authentication)
}





export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
