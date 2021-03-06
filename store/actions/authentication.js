// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'
import Router from 'next/router'





// Component imports
import actionTypes from '../actionTypes'





export const changePassword = (currentPassword, newPassword) => async dispatch => {
  dispatch({ type: actionTypes.CHANGE_PASSWORD })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/users/setpassword', {
      body: JSON.stringify({
        password: currentPassword,
        new: newPassword,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'put',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.CHANGE_PASSWORD,
      payload: response,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.CHANGE_PASSWORD,
    })
  }
}





export const login = (email, password) => async dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  try {
    let token = await LocalForage.getItem('access_token')

    if (!token) {
      const data = JSON.stringify({
        grant_type: 'password',
        password,
        username: email,
      })

      let response = await fetch('/token', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      response = await response.json()

      token = response.access_token
      await LocalForage.setItem('access_token', token)
      Cookies.set('access_token', token, { expires: 365 })
    }

    dispatch({
      status: 'success',
      type: actionTypes.LOGIN,
    })

    /* eslint-disable no-restricted-globals, no-global-assign */
    if (location && location.search) {
      const searchParams = {}

      location.search.replace(/^\?/, '').split('&').forEach(searchParam => {
        const [key, value] = searchParam.split('=')

        searchParams[key] = value
      })

      location = searchParams.destination ? decodeURIComponent(searchParams.destination) : '/profile'
    }
    /* eslint-enable */
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.LOGIN,
    })
  }
}





export const logout = () => async dispatch => {
  dispatch({ type: actionTypes.LOGOUT })

  try {
    Cookies.remove('access_token')
    await Promise.all([
      LocalForage.removeItem('access_token'),
      LocalForage.removeItem('userId'),
      LocalForage.removeItem('preferences'),
    ])

    dispatch({
      status: 'success',
      type: actionTypes.LOGOUT,
    })

    Router.push('/')
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.LOGOUT,
    })
  }
}





export const register = (email, password, name, platform, nickname, recaptcha) => async dispatch => {
  dispatch({ type: actionTypes.REGISTER })

  try {
    let response = await fetch('/api/register', {
      body: JSON.stringify({
        email,
        password,
        name,
        platform,
        nickname,
        'g-recaptcha-response': recaptcha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    response = await fetch('/token', {
      body: JSON.stringify({
        grant_type: 'password',
        password,
        username: email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    response = await response.json()

    await LocalForage.setItem('access_token', response.access_token)
    Cookies.set('access_token', response.access_token, { expires: 365 })

    dispatch({
      status: 'success',
      type: actionTypes.REGISTER,
    })

    Router.push('/profile')
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.REGISTER,
    })
  }
}





export const resetPassword = (password, token) => async dispatch => {
  dispatch({ type: actionTypes.RESET_PASSWORD })

  try {
    const response = await fetch(`/api/reset/${token}`, {
      body: JSON.stringify({
        password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    if (response.ok) {
      return dispatch({
        status: 'success',
        type: actionTypes.RESET_PASSWORD,
        payload: response,
      })
    }

    throw new Error('Failed to reset password')
  } catch (error) {
    return dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.RESET_PASSWORD,
    })
  }
}





export const sendPasswordResetEmail = email => async dispatch => {
  dispatch({ type: actionTypes.SEND_PASSWORD_RESET_EMAIL })

  try {
    let response = await fetch('/api/reset', {
      body: JSON.stringify({
        email,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL,
      payload: response,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL,
    })
  }
}





export const validatePasswordResetToken = (token) => async dispatch => {
  let response

  dispatch({ type: actionTypes.VALIDATE_PASSWORD_RESET_TOKEN })

  try {
    response = await fetch(`/api/reset/${token}`)
    return response.ok
  } catch (error) {
    return error
  }
}
