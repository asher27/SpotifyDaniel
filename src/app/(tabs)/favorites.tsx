import {ActivityIndicator, FlatList, StyleSheet, Text} from 'react-native';
import {gql, useQuery} from '@apollo/client';
import TrackListItem from '@/components/TrackListItem';

const query = gql`
  query getFavorites($userId: String!) {
    favoritesByUserid(userid: $userId) {
      id
      trackid
      userid
      track {
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
            url
            width
            height
          }
        }
      }
    }
  }
`;
const FavoritesScreen = () => {
  const {data, loading, error, refetch} = useQuery(query, {
    variables: {
      userId: 'david',
    },
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Something went wrong</Text>;

  const tracks = (data?.favoritesByUserid || []).map((fav: any) => fav.track);

  return (
    <FlatList
      data={tracks}
      renderItem={({item}) => <TrackListItem track={item} />}
      showsVerticalScrollIndicator={false}
      refreshing={loading}
      onRefresh={refetch}
    />
  );
};
const styles = StyleSheet.create({});
export default FavoritesScreen;
