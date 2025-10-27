import { ADD_TRACKS_TO_PLAYLIST_URL, LIKED_SONGS_PLAYLIST_FACADE } from '../constants';
import { PlaylistInfo, PlaylistContentsResponse } from '../types';
import { splitArrayInChunks } from './';

// Cache used when fetching playlist tracks to avoid unnecessary API calls
export const playlistCache = new Map<string, string[]>();

export async function combinePlaylists(sourcePlaylists: PlaylistInfo[], targetPlaylist: PlaylistInfo, autoSync = false) {
   const sourceUris = await Promise.all(sourcePlaylists.map(async (playlist): Promise<string[]> => {
      if (playlist.id === LIKED_SONGS_PLAYLIST_FACADE.id) {
         const res: PlaylistContentsResponse = await Spicetify.Platform.LibraryAPI.getTracks({ limit: 99999 });
         return extractTrackUris(res.items);
      } else {
         return getPlaylistTracksWithCache(playlist.uri);
      }
   // Flatten responses and remove duplicates
   })).then(arrays => Array.from(new Set(arrays.flat())));

   const targetUris = await getPlaylistTracksWithCache(targetPlaylist.uri);

   const missingUris = sourceUris.filter((sourceUri) => !targetUris.includes(sourceUri));
   const uriChunks = splitArrayInChunks(missingUris);

   if (missingUris.length > 0 && autoSync) {
      Spicetify.showNotification(`Auto-syncing ${missingUris.length} missing tracks to playlist ${targetPlaylist.name}`);
   }

   await Promise.all(uriChunks.map((trackUris) => {
      return addTracksToPlaylist(targetPlaylist.id, trackUris);
   }));

   if (missingUris.length > 0) {
      const msg = autoSync
         ? `Auto-synced ${missingUris.length} missing tracks to playlist ${targetPlaylist.name} 🔥`
         : `Added ${missingUris.length} tracks to playlist: ${targetPlaylist.name}`;
      Spicetify.showNotification(msg);
   }
}

export function addTracksToPlaylist(playlistId: string, trackUris: string[]) {
   return Spicetify.CosmosAsync.post(ADD_TRACKS_TO_PLAYLIST_URL(playlistId), { uris: trackUris });
}

async function getPlaylistTracksWithCache(uri: string) {
   const cachedPlaylistTracks = playlistCache.get(uri);
   if (cachedPlaylistTracks) {
      return Promise.resolve(cachedPlaylistTracks);
   } else {
      const res: PlaylistContentsResponse = await Spicetify.Platform.PlaylistAPI.getContents(uri);
      const tracks = extractTrackUris(res.items);
      playlistCache.set(uri, tracks);
      return tracks;
   }
}

function extractTrackUris(items: PlaylistContentsResponse['items']): string[] {
   return items
      .filter((item) => item.uri?.startsWith("spotify:track:") && item.isPlayable)
      .map((item) => item.uri);
}
