import type { PlaylistInfo } from '../types/combined-playlist';
import type { SpotifyPlaylist } from '../types/spotify-playlist';

export function getPlaylistInfo({ id, name, uri }: SpotifyPlaylist): PlaylistInfo {
   return { id, name, uri };
}
