import { SpotifyPlaylist } from '../types';

export const GET_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists?limit=50';

/**
 * Get only uri and next fields from paginated track call
 */
export const TRACKS_FROM_PLAYLIST_URL_FILTER = '?fields=items(track(uri)),next';

export const GET_PLAYLIST_TRACKS_URL = (uri: string) => `sp://core-playlist/v1/playlist/${uri}/rows`;

export const ADD_TRACKS_TO_PLAYLIST_URL = (id: string) => `https://api.spotify.com/v1/playlists/${id}/tracks`;

export const LS_KEY = 'combined-playlists';

export const CREATE_PLAYLIST_URL = (userId: string) => `https://api.spotify.com/v1/users/${userId}/playlists`;

export const CREATE_NEW_PLAYLIST_IDENTIFIER = 'CREATE_NEW_PLAYLIST_IDENTIFIER';

export const LIKED_SONGS_PLAYLIST_FACADE: SpotifyPlaylist = {
   name: Spicetify.Platform?.Translations['shared.library.entity-row.liked-songs.title'],
   collaborative: false,
   description: '',
   external_urls: { spotify: '' },
   href: '',
   id: 'liked-songs-facade',
   images: [],
   owner: {
      display_name: '',
      external_urls: { spotify: '' },
      href: '',
      id: '',
      type: 'user',
      uri: ''
   },
   public: false,
   snapshot_id: '',
   tracks: {
      href: '',
      total: 0
   },
   type: 'playlist',
   uri: 'spotify:playlist:liked-songs-facade'

};
