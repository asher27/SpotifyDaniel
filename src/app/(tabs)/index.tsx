import {ActivityIndicator, FlatList, StyleSheet, Text} from 'react-native';
import TrackListItem from '@/components/TrackListItem';
import {gql, useQuery} from '@apollo/client';

const query = gql`
  query MyQuery($genres: String!) {
    recommendations(seed_genres: $genres) {
      tracks {
        id
        name
        preview_url
        artists {
          id
          name
        }
        album {
          id
          name
          images {
            height
            url
            width
          }
        }
      }
    }
  }
`;

export default function HomeScreen() {
  const {data, loading, error, refetch} = useQuery(query, {
    variables: {
      genres: 'k-pop',
    },
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Something went wrong</Text>;

  const tracks = data?.recommendations?.tracks || [];

  return (
    <FlatList
      data={tracks}
      renderItem={({item}) => <TrackListItem track={item} />}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
