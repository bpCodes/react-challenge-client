import React from 'react'
import styled from 'styled-components'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { allCommentsQuery } from '../graphql/allComments'

class CreateComment extends React.Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      name: '',
      errors: {},
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { name } = this
    let response = null
    try {
      response = await this.props.mutate({
        variables: { name },
        optimisticResponse: {
          createComment: {
            __typename: 'Mutation',
            ok: true,
            comment: {
              __typename: 'Comment',
              id: -1,
              name,
            },
          },
        },
        update: (store, { data: { createComment } }) => {
          const { ok, comment } = createComment
          if (!ok) {
            return
          }
          const data = store.readQuery({ query: allCommentsQuery })
          data.allComments.unshift(comment)
          store.writeQuery({ query: allCommentsQuery, data })
        },
      })
    } catch (err) {
      return
    }


    const { ok, errors } = response.data.createComment

    if (ok) {
      // console.log('ok');
      this.name = ''
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
    const { name, errors: { nameError } } = this

    const errorList = []

    if (nameError) {
      errorList.push(nameError)
    }

    return (
      <FormContainer>
        <Form onSubmit={this.onSubmit}>
          <Label htmlFor="fancy-textarea">Escribe un comentario</Label>
          <Input
            type="text"
            name="name"
            onChange={this.onChange}
            value={name}
            placeholder="Write..."
          />
          <Button onClick={this.onSubmit} type="submit">Enviar</Button>
        </Form>
        {errorList.length ? (
          <Message
            error
            header="There was some errors with your submission"
            list={errorList}
          />
        ) : null}
      </FormContainer>
    )
  }
}

const Form = styled.form`
  color: #707070;
  flex:1;
  position: relative;
`
const Label = styled.p`
  color: white;
  flex: 1;
  padding: 1em;
  width: 100%;
  background-color: #49ccb0;
  margin: 0;
  border-radius: 10px 10px 0px 0px;
  text-align: center;
`
const Input = styled.textarea`
  width: 100%;
  height: 35vh;
  border: none;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 0 0 15px 15px;
  resize: none; 
  padding: 2em; 
  margin: 0;
`
const Button = styled.button`
  align-self: end;
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #49ccb0;
  border-radius: 15px 0 15px 5px;
  color: white;
  font-size: 1.5em;
  padding: 0.5em 3em;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 3px 25px 0 #00000047;
  }
`
const Message = styled.p`
  color: orangered;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 1em 0;
  margin-top: 2em;
`

const createCommentMutation = gql`
  mutation($name: String!) {
    createComment(name: $name) {
      ok
      comment {
        id
        name
      }
      errors {
        path
        message
      }
    }
  }
`

export default graphql(createCommentMutation)(observer(CreateComment))
