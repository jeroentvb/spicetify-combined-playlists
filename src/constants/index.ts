export const GET_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists?limit=50';

/**
 * Get only uri and next fields from paginated track call
 */
export const TRACKS_FROM_PLAYLIST_URL_FILTER = '?fields=items(track(uri)),next';

export const ADD_TRACKS_TO_PLAYLIST_URL = (id: string) => `https://api.spotify.com/v1/playlists/${id}/tracks`;

export const LS_KEY = 'combined-playlists';
