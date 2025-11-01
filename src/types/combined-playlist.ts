export interface CombinedPlaylist {
   sources: PlaylistInfo[];
   target: PlaylistInfo
}

export type PlaylistInfo = Pick<SpotifyApi.PlaylistObjectSimplified, 'name' | 'id' | 'uri'>;
