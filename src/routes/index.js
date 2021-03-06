import React from 'react'
import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import decode from 'jwt-decode'

// import Home from './Home';
import Register from './Register'
import Login from './Login'
import ViewComment from '../containers/ViewComment'

const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    decode(token)
    decode(refreshToken)
  } catch (err) {
    return false
  }

  return true
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to="/login"
        />
      ))}
  />
)

export default () => (
  <HashRouter>
    <Switch>
      <PrivateRoute path="/" exact component={ViewComment} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
    </Switch>
  </HashRouter>
)
