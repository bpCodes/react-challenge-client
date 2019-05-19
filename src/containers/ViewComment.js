import React from 'react'

import AppLayout from '../components/AppLayout'
import Comment from './Comment'
import User from '../components/User'
import CreateComment from '../components/CreateComment'

const ViewComment = () => (
  <AppLayout>
    <User />
    <CreateComment />
    <Comment />
  </AppLayout>
)

export default ViewComment
