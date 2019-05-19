import React from 'react'
import findIndex from 'lodash/findIndex'
import styled from 'styled-components'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { allCommentsQuery } from '../graphql/allComments'

class editComment extends React.Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      name: props.name,
      id: props.id,
      errors: {},
    })
  }

  onSubmit = async () => {
    const { name, id } = this
    let response = null

    try {
      response = await this.props.mutate({
        variables: { id, name },
        optimisticResponse: {
          updateComment: {
            __typename: 'Mutation',
            ok: true,
            comment: {
              __typename: 'Comment',
              id,
              name,
            },
          },
        },
        update: (store, { data: { updateComment } }) => {
          const { ok } = updateComment
          if (!ok) {
            return
          }
          const data = store.readQuery({ query: allCommentsQuery })
          // console.log(id, name, 'data =>', data)
          const CommentIdx = findIndex(data.allComments, ['id', id])
          data.allComments[CommentIdx].name = name
          store.writeQuery({ query: allCommentsQuery, data })
        },
      })
    } catch (err) {
      return
    }


    const { ok, errors } = response.data.updateComment

    if (ok) {
      // console.log('ok');
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
      <FormContainer text>
        <Form>
          <Input disabled name="name" onChange={this.onChange} value={name} placeholder="Name" fluid />
          {/* <Button onClick={this.onSubmit}>Submit</Button> */}
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

const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 1.05em;
  background-color: white;
  &:disabled{
    background-color: white;
  }
`

// const Button = styled.button`
//   box-shadow: 1px 1px 1px 1px black;  
// `;

const Message = styled.p`
  color: orangered;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const updateCommentMutation = gql`
  mutation($id: Int!, $name: String) {
    updateComment(id: $id, name: $name) {
      ok
      comment {
        id
        name
      }
    }
  }
`

export default graphql(updateCommentMutation)(observer(editComment))
