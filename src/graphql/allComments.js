import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const allCommentsQuery = gql`
  {
    allComments {
      id
      name
    }
  }
`;