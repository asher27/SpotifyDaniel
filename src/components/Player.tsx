import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {usePlayerContext} from '@/providers/PlayerProvider';
import {Audio, AVPlaybackStatus} from 'expo-av';
import {Sound} from 'expo-av/build/Audio/Sound';
import {gql, useMutation, useQuery} from '@apollo/client';

const insertFavoriteMutation = gql`
  mutation MyMutation($userId: String!, $trackId: String!) {
    insertFavorites(userid: $userId, trackid: $trackId) {
      id
      trackid
      userid
    }
  }
`;

const deleteFavoriteMutation = gql`
  mutation MyMutation($trackId: String!, $userId: String!) {
    deleteFavorites(trackid: $trackId, userid: $userId) {
      id
    }
  }
`;

const isFavoriteQuery = gql`
  query MyQuery($userId: String!, $trackId: String!) {
    favoritesByTrackidAndUserid(userid: $userId, trackid: $trackId) {
      id
      trackid
      userid
    }
  }
`;
const Player = () => {
  const {track} = usePlayerContext();
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [handleInsertFavorite] = useMutation(insertFavoriteMutation);
  const [handleDeleteFavorite] = useMutation(deleteFavoriteMutation);

  const {data, refetch} = useQuery(isFavoriteQuery, {
    variables: {
      userId: 'david',
      trackId: track?.id || '',
    },
  });
  const isLiked = data?.favoritesByTrackidAndUserid?.length > 0;

  useEffect(() => {
    if (track) {
      playTrack();
    }
  }, [track]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playTrack = async () => {
    if (sound) {
      console.log('playTrack Unloading Sound');

      await sound.unloadAsync();
    }

    if (!track?.preview_url) return;

    const {sound: newSound} = await Audio.Sound.createAsync({
      uri: track.preview_url,
    });

    setSound(newSound);
    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await newSound.playAsync();
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setIsPlaying(false);
    if (!status.isLoaded) return;

    setIsPlaying(status.isPlaying);
  };
  const onPlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const onLike = async () => {
    if (!track) return;

    if (isLiked) {
      await handleDeleteFavorite({
        variables: {
          userId: 'david',
          trackId: track.id,
        },
      });
    } else {
      await handleInsertFavorite({
        variables: {
          userId: 'david',
          trackId: track.id,
        },
      });
    }

    await refetch();
  };

  if (!track) return null;

  const image = track.album.images?.[0];

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {image && <Image source={{uri: image.url}} style={styles.image} />}
        <View style={{flex: 1}}>
          <Text style={styles.title}>{track.name}</Text>
          <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
        </View>
        <Ionicons
          onPress={onLike}
          name={isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={'white'}
          style={{marginHorizontal: 10}}
        />
        <Ionicons
          onPress={onPlayPause}
          disabled={!track?.preview_url}
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={track?.preview_url ? 'white' : 'gray'}
          style={{marginHorizontal: 10}}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -75,
    width: '100%',
    height: 75,
    padding: 10,
  },
  player: {
    backgroundColor: '#286660',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 3,
    paddingRight: 15,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 12,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});
export default Player;
