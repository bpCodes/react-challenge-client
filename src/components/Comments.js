import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import findIndex from 'lodash/findIndex'
import { Mutation } from 'react-apollo'
import EditComment from './editComment'
import { allCommentsQuery } from '../graphql/allComments'

import deleteIcon from './delete.png'

const DELETE_Comment = gql`
  mutation($id: Int!) {
    removeComment(id: $id) {
      ok
    }
  }
`

const CommentWrapper = styled.div`
  background-color: #fff;
  color: #958993;
  width: 100%;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  margin-top: 2em;
`

const CommentList = styled.ul`
  width: 100%;
  padding: 1em;
  list-style: none;
`

const CommentListItem = styled.li`
  height: 100%;
  width: 100%;
  background-color: #fff;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-bottom: 1px solid rgba(0,0,0,0.5);  
  
`
const Button = styled.button`  
  color: white;
  font-size: 1.5em;
  background-color: rgba(0,0,0,0);
  border: none;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.1);
  }
`

const Delete = ({ id }) => (
  <Mutation
    mutation={DELETE_Comment}
    variables={{ id }}
    optimisticResponse={{
      removeComment: {
        __typename: 'Mutation',
        ok: true,
      },
    }}
    update={(store, { data: { removeComment } }) => {
      const { ok } = removeComment
      if (!ok) {
        return
      }
      const data = store.readQuery({ query: allCommentsQuery })
      const commentIdx = findIndex(data.allComments, ['id', id])
      data.allComments.splice(commentIdx, 1)
      store.writeQuery({ query: allCommentsQuery, data })
    }}
  >
    {deleteComment => (
      <Button type="button" onClick={deleteComment}>
        <img src={deleteIcon} alt="Delete icon" />
      </Button>
    )}
  </Mutation>
)


const comment = ({ id, letter }) => (
  <CommentListItem key={`Comment-${id}`}>
    <EditComment id={id} name={letter} />
    <Delete id={id} />
  </CommentListItem>
)

export default ({ comments }) => (
  <CommentWrapper>
    <CommentList>{comments.map(comment)}</CommentList>
  </CommentWrapper>
)
