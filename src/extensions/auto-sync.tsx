import { GET_PLAYLIST_TRACKS_URL, LS_KEY } from '../constants';
import type { CombinedPlaylist, PlaylistRowsResponse } from '../types';
import { addTracksToPlaylist, getCombinedPlaylistsSettings } from '../utils';

(async () => {
   while (!Spicetify?.Platform || !Spicetify?.CosmosAsync) {
      await new Promise(resolve => setTimeout(resolve, 100));
   }

   const autoSync = getCombinedPlaylistsSettings().autoSync;
   if (autoSync) synchronizeCombinedPlaylists();
})();

export function synchronizeCombinedPlaylists() {
   const combinedPlaylists: CombinedPlaylist[] = JSON.parse(Spicetify.LocalStorage.get(LS_KEY) as string) ?? [];

   Promise.all(combinedPlaylists.map(async ({ sources, target }) => {
      const sourceUris = await Promise.all(sources.map(async (source) => {
         const res: PlaylistRowsResponse = await Spicetify.CosmosAsync.get(GET_PLAYLIST_TRACKS_URL(source.uri));
         return res.rows.map(({ link }) => link);
      // Flatten result and remove duplicates
      })).then(res => Array.from(new Set(res.flat())));

      const targetUris = await Spicetify.CosmosAsync.get(GET_PLAYLIST_TRACKS_URL(target.uri))
         .then((res: PlaylistRowsResponse) => res.rows.map(({ link }) => link));

      const missingUris = sourceUris.filter(uri => !targetUris.includes(uri));

      if (missingUris.length) {
         Spicetify.showNotification(`Auto-syncing ${missingUris.length} missing tracks to playlist ${target.name}`);
         // Endpoint only wants the id, not the full uri
         await addTracksToPlaylist(target.uri.split(':').at(-1) as string, missingUris);
         Spicetify.showNotification(`Auto-synced ${missingUris.length} missing tracks to playlist ${target.name} 🔥`);
      }
   })).catch((_err) => {
      Spicetify.showNotification('An error while auto-syncing playlists', true);
   });
}
