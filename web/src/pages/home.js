import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery, gql } from '@apollo/client';

import Button from '../components/Button';
import NoteFeed from '../components/NoteFeed';
// our GraphQL query, stored as a variable
const GET_NOTES = gql`
  query NoteFeed($cursor: String) {
    noteFeed(cursor: $cursor) {
      cursor
      hasNextPage
      notes {
        id
        createdAt
        content
        favoriteCount
        author {
          username
          id
          avatar
        }
      }
    }
  }
`;

const Home = () => {
  // query hook
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);
  // if the data is loading, display a loading message
  if (loading) return <p>Loading...</p>;
  // if there is an error fetching the data, display an error message

  if (error) return <p>Error!</p>;
  // if the data is successful, display the data in our UI
  return (
    <React.Fragment>
      <NoteFeed notes={data.noteFeed.notes} />
      {/* Only display the Load More button if hasNextPage is true */}
      {data.noteFeed.hasNextPage && (
        // onClick peform a query, passing the current cursor as a variable
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                cursor: data.noteFeed.cursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                return {
                  noteFeed: {
                    cursor: fetchMoreResult.noteFeed.cursor,
                    hasNextPage: fetchMoreResult.noteFeed.hasNextPage,
                    // combine the new results and the old
                    notes: [
                      ...previousResult.noteFeed.notes,
                      ...fetchMoreResult.noteFeed.notes
                    ],
                    __typename: 'noteFeed'
                  }
                };
              }
            })
          }
        >
          Load more
        </Button>
      )}
    </React.Fragment>
  );
};
export default Home;
