import { LS_KEY } from '../constants';
import type { CombinedPlaylist } from '../types';
import { combinePlaylists, getCombinedPlaylistsSettings, playlistCache } from '../utils';

(async () => {
   while (!Spicetify?.Platform || !Spicetify?.CosmosAsync) {
      await new Promise(resolve => setTimeout(resolve, 100));
   }

   const autoSync = getCombinedPlaylistsSettings().autoSync;
   if (autoSync) synchronizeCombinedPlaylists();
})();

export function synchronizeCombinedPlaylists() {
   const combinedPlaylists: CombinedPlaylist[] = JSON.parse(Spicetify.LocalStorage.get(LS_KEY) as string) ?? [];

   return Promise.all(combinedPlaylists.map(({ sources, target }) => combinePlaylists(sources, target, true)))
      .catch((err) => {
         console.error('An error ocurred while auto-syncing playlists', err);
         Spicetify.showNotification('An error ocurred while auto-syncing playlists', true);
      })
      .finally(() => playlistCache.clear());
}
