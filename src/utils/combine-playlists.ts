import { ADD_TRACKS_TO_PLAYLIST_URL, LIKED_SONGS_PLAYLIST_FACADE, TRACKS_FROM_PLAYLIST_URL_FILTER } from '../constants';
import { SpotifyCollectionCallResponse } from '../types';
import { getPaginatedSpotifyData, splitArrayInChunks } from './';

export async function combinePlaylists(sourcePlaylists: SpotifyApi.PlaylistObjectSimplified[], targetPlaylist: SpotifyApi.PlaylistObjectSimplified) {
   const allTracksWithPossibleDuplicates = await Promise.all(sourcePlaylists.map(async (playlist): Promise<string[]> => {
      if (playlist.id === LIKED_SONGS_PLAYLIST_FACADE.id) {
         return await Spicetify.CosmosAsync.get('sp://core-collection/unstable/@/list/tracks/all?responseFormat=protobufJson')
            .then((res: SpotifyCollectionCallResponse) => res.item.map(item => item.trackMetadata.link));
      } else {
         return await getPaginatedSpotifyData<{ track: { uri: string } }>(playlist.tracks.href + TRACKS_FROM_PLAYLIST_URL_FILTER)
            .then(items => items.map(item => item.track.uri));
      }
   })).then(arrays => arrays.flatMap(array => array));

   const targetTrackUris = await getPaginatedSpotifyData<{ track: { uri: string } }>(targetPlaylist.tracks.href + TRACKS_FROM_PLAYLIST_URL_FILTER)
      .then(items => items.map(item => item.track.uri));

   // Filter duplicates from souces usig new Set, then filter duplicates from targetPlaylist using .filter
   const sourcesTrackUris = Array.from(new Set(allTracksWithPossibleDuplicates)).filter((sourceUri) => !targetTrackUris.includes(sourceUri));
   const splittedTrackUris = splitArrayInChunks(sourcesTrackUris);

   await Promise.all(splittedTrackUris.map(async (trackUris) => {
      await Spicetify.CosmosAsync.post(ADD_TRACKS_TO_PLAYLIST_URL(targetPlaylist.id), { uris: trackUris });
   }));

   Spicetify.showNotification(`Added ${sourcesTrackUris.length} tracks to playlist: ${targetPlaylist.name}`);
}
