import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Register extends React.Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onSubmit = async (e) => {
    e.preventDefault()
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    })

    const { username, email, password } = this.state
    const response = await this.props.mutate({
      variables: { username, email, password },
    })

    const { ok, errors } = response.data.register

    if (ok) {
      this.props.history.push('/')
    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message
      })

      this.setState(err)
    }

  };

  onChange = (e) => {
    const { name, value } = e.target
    // name = "email";
    this.setState({ [name]: value })
  };

  render() {
    const {
      username, email, password, usernameError, emailError, passwordError,
    } = this.state

    const errorList = []

    if (usernameError) {
      errorList.push(usernameError)
    }

    if (emailError) {
      errorList.push(emailError)
    }

    if (passwordError) {
      errorList.push(passwordError)
    }

    return (
      <FormContainer onSubmit={this.onSubmit}>
        <Title as="h2">Register</Title>
        <Form>
          <Input
            name="username"
            onChange={this.onChange}
            value={username}
            placeholder="Username"
            fluid
          />
          <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          <Input
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            placeholder="Password"
            fluid
          />
          <Button type="submit" onSubmit={this.onSubmit}>Submit</Button>
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

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`

export default graphql(registerMutation)(Register)
