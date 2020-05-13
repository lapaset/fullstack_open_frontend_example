import React, { useState } from 'react'
import PropTypes from 'prop-types'

const InputField = ({ name, type, value, onChange }) => (
  <div>
    {name}
    <input
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
)

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = event => {
    event.preventDefault()
    login({
      username,
      password,
    })

    setUsername('')
    setPassword('')
  }

  const handleUsernameChange = ({ target }) => setUsername(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <InputField
          name="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <InputField
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm