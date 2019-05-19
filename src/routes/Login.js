import React from 'react'
import styled from 'styled-components'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Login extends React.Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = this
    const response = await this.props.mutate({
      variables: { email, password },
    })
    const {
      ok, token, refreshToken, errors,
    } = response.data.login

    if (ok) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      this.props.history.push('/')
    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message
      })

      this.errors = err
    }
  };

  onChange = (e) => {
    const { name, value } = e.target
    this[name] = value
  };

  render() {
    const { email, password, errors: { emailError, passwordError } } = this

    const errorList = []

    if (emailError) {
      errorList.push(emailError)
    }

    if (passwordError) {
      errorList.push(passwordError)
    }

    return (
      <FormContainer onSubmit={this.onSubmit}>
        <Title as="h2">Login</Title>
        <Form>
          <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          <Input
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            placeholder="Password"
            fluid
          />
          <Button type="submit" onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length ? (
          <Message error header="There was some errors with your submission" list={errorList} />
        ) : null}
      </FormContainer>
    )
  }
}
const Form = styled.form`
  color: #707070;
  flex: 1;
  position: relative;
`
const Title = styled.h2`
  color: #707070;
  flex: 1;
  position: relative;
`

const Input = styled.input`
  width: 100%;
  border: none;
  &:disabled {
    background-color: white;
  }
`

const Button = styled.button`
  box-shadow: 1px 1px 1px 1px black;
`

const Message = styled.p`
  color: orangered;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`

export default graphql(loginMutation)(observer(Login))
