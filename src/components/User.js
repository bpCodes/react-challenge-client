import React from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import decode from 'jwt-decode'

const UserData = styled.div`
  display: flex;
  width: 100%;
  margin: 1em 0;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  border: none;
  padding: 1em;
`
const Avatar = styled.img`
  
  width: 10vw;
  border-radius: 50%;
`
const Username = styled.p`
  flex: 1;
  width: 10vw;
  font-size: 1.5em;
  color: #707070;
  align-self: center;
  margin-left: 2em;
`


const User = ({ data: { loading, oneUser } }) => {
  if (loading) {
    return null
  }
  // console.log(oneUser);
  return (
    <UserData>
      <Avatar src={oneUser.avatar} alt="Profile" />
      <Username>
        {oneUser.username}
      </Username>
    </UserData>
  )
};
let id = 0
try {
  const token = localStorage.getItem('token')
  const { user } = decode(token)
  // eslint-disable-next-line prefer-destructuring
  id = user.id
} catch (err) {}

const oneCommentQuery = gql`
   {
    oneUser(id: ${id}) {
      id
      email
      username
      avatar
    }
  }
`
export default graphql(oneCommentQuery)(User)
