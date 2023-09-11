import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import {Track} from '@/types';

type PlayerContextProps = {
  track?: Track;
  setTrack: (track: Track) => void;
};

const PlayerContext = createContext<PlayerContextProps>({
  setTrack: () => {},
});

export default function PlayerProvider({children}: PropsWithChildren) {
  const [track, setTrack] = useState<Track>();

  // console.log('track', track);
  return (
    <PlayerContext.Provider value={{track, setTrack}}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayerContext = () => useContext(PlayerContext);
