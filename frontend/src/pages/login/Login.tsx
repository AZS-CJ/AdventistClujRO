import React, { useState } from 'react'
import Cookies from 'js-cookie'

import './Login.scss'

function Login() {
  const [username] = useState<string | undefined>(Cookies.get('displayName'))

  return (
    <>
      {username ? (
        <div className="login">
          <span>HI {username}!</span>
          <a href="/auth/logout" role="button">
            Logout
          </a>
        </div>
      ) : (
        <div className="login">
          <a href="/auth/facebook" role="button">
            Login with facebook
          </a>
          <a href="/auth/google" role="button">
            Login with GOOGLE
          </a>
        </div>
      )}
    </>
  )
}

export default Login
