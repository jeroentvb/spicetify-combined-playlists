import React from 'react';
import type { FormikHelpers } from 'formik';
import { PlaylistForm } from './components/Form';
import { combinePlaylists, getPlaylistInfo, TrackLoadingState, getPaginatedSpotifyData } from './utils';
import { GET_PLAYLISTS_URL, LS_KEY } from './constants';
import type { CombinedPlaylist, SpotifyPlaylist, InitialPlaylistForm } from './types';

import './css/styles.scss';

interface State {
  playlists: SpotifyPlaylist[];
  combinedPlaylists: CombinedPlaylist[];
  loading: boolean;
}

class App extends React.Component<Record<string, unknown>, State> {

   get combinedPlaylistsLs(): CombinedPlaylist[] {
      return JSON.parse(Spicetify.LocalStorage.get(LS_KEY) as string) ?? [];
   }

   set combinedPlaylistsLs(playlists: CombinedPlaylist[]) {
      Spicetify.LocalStorage.set(LS_KEY, JSON.stringify(playlists));
   }

   constructor(props: Record<string, unknown>) {
      super(props);

      this.state = {
         playlists: [],
         combinedPlaylists: [],
         loading: false,
      };
   }

   async componentDidMount() {
      const playlists = await getPaginatedSpotifyData<SpotifyPlaylist>(GET_PLAYLISTS_URL);
      const combinedPlaylists = this.combinedPlaylistsLs.map((combinedPlaylist) => this.getMostRecentPlaylistFromData(combinedPlaylist, playlists));

      this.setState({
         playlists,
         combinedPlaylists
      });
   }

   @TrackLoadingState()
   async createNewCombinedPlaylist(formData: InitialPlaylistForm, { resetForm }: FormikHelpers<InitialPlaylistForm>) {
      if (formData.sources.length === 0 || !formData.target) {
         Spicetify.showNotification('Please select at least one source and one target playlist');
         return;
      }

      const sourcePlaylists = formData.sources.map((source) => this.findPlaylist(source));
      const targetPlaylist = this.findPlaylist(formData.target);
      await combinePlaylists(sourcePlaylists, targetPlaylist);
      this.saveCombinedPlaylist(sourcePlaylists, targetPlaylist);

      resetForm();
   }

   saveCombinedPlaylist(sourcePlaylists: SpotifyPlaylist[], targetPlaylist: SpotifyPlaylist) {
      const combinedPlaylist: CombinedPlaylist = {
         sources: sourcePlaylists.map(getPlaylistInfo),
         target: getPlaylistInfo(targetPlaylist),
      };

      this.setState((state) => ({
         combinedPlaylists: state.combinedPlaylists.concat(combinedPlaylist),
      }));

      this.combinedPlaylistsLs = this.combinedPlaylistsLs.concat(combinedPlaylist);
   }

   @TrackLoadingState()
   async syncPlaylist(id: string) {
      const playlistToSync = this.findPlaylist(id);
      const { sources } = this.state.combinedPlaylists.find((combinedPlaylist) => combinedPlaylist.target.id === playlistToSync.id) as CombinedPlaylist;
      const sourcePlaylists = sources.map((sourcePlaylist) => this.findPlaylist(sourcePlaylist.id));

      await combinePlaylists(sourcePlaylists, playlistToSync);
   }

   findPlaylist(id: string): SpotifyPlaylist {
      return this.state.playlists.find((playlist) => playlist.id === id) as SpotifyPlaylist;
   }

   // TODO gracefully handle playlists that don't exist anymore
   getMostRecentPlaylistFromData(combinedPlaylist: CombinedPlaylist, playlists: SpotifyPlaylist[]): CombinedPlaylist {
      const sources = combinedPlaylist.sources.map(({ id }) => playlists.find((pl) => pl.id === id) as SpotifyPlaylist);
      const target = playlists.find((pl) => pl.id === combinedPlaylist.target.id) as SpotifyPlaylist;

      return { sources, target };
   }

   render() {
      if (this.state.playlists.length > 0 ) {
         return (
            <div id="combined-playlists-wrapper" className="contentSpacing">
               <h1>Playlist combiner</h1>

               <div id="combined-playlists-content">
                  <section>
                     <h2>Create combined playlist</h2>
                     <PlaylistForm
                        playlists={this.state.playlists}
                        onSubmit={(formData, helpers) => this.createNewCombinedPlaylist(formData, helpers)}
                        loading={this.state.loading}
                     />
                  </section>

                  <section>
                     <h2>Combined playlists</h2>
                     {this.state.combinedPlaylists.map(({ target: { name, id } }) => (
                        <div key={id} className="combined-playlist">
                           <p>{name}</p>
                           <button
                              className='main-buttons-button main-button-outlined'
                              type="button"
                              onClick={() => this.syncPlaylist(id)}
                           >Sync</button>
                        </div>
                     ))}
                  </section>
               </div>
            </div>
         );
      }

      return '';
   }
}

export default App;
