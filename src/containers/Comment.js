import React from 'react'
import { graphql } from 'react-apollo'
import Comments from '../components/Comments'
import { allCommentsQuery } from '../graphql/allComments'


const Sidebar = ({ data: { loading, allComments } }) => {
  if (loading) {
    return null
  }

  return [
    <Comments
      key="comment-sidebar"
      comments={allComments.map(t => ({
        id: t.id,
        letter: t.name,
      }))}
    />,
    
  ]
};

export default graphql(allCommentsQuery)(Sidebar)
