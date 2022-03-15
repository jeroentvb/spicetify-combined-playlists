import styles from './css/app.module.scss';
import React from 'react';
import { PlaylistForm } from './components/Form';
import type { SubmitEventHandler } from './components/Form';

import combinePlaylists from './utils/combine-playlists';
import { GET_PLAYLISTS_URL, LS_KEY } from './constants';
import type { CombinedPlaylist } from './types/combined-playlist';
import type { SpotifyPlaylist } from './types/spotify-playlist';
import getPlaylistInfo from './utils/get-playlist-info';
import { PLAYLISTS } from './constants/playlists';

import './css/styles.scss';
import getPaginatedSpotifyData from './utils/get-paginated-spotify-data';

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
         combinedPlaylists: this.combinedPlaylistsLs,
         loading: false,
      };

      console.log(Spicetify);
   }

   async componentDidMount() {
      const playlists = await getPaginatedSpotifyData<SpotifyPlaylist>(GET_PLAYLISTS_URL);
      console.log(playlists)
      this.setState({ playlists: PLAYLISTS });
   }

   onSubmit: SubmitEventHandler = async (formData) => {
      this.setState({ loading: true });

      const sourcePlaylists = formData.sources.map((source) => this.findPlaylist(source));
      const targetPlaylist = this.findPlaylist(formData.target);
      const total = await combinePlaylists(sourcePlaylists, targetPlaylist);
      this.saveCombinedPlaylist(sourcePlaylists, targetPlaylist);

      this.setState({ loading: false });
      Spicetify.showNotification(`Combined ${total} tracks into playlist: ${targetPlaylist.name}`);
   };

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

   syncPlaylist(id: string) {
      const playlistToSync = this.findPlaylist(id);

      Spicetify.showNotification('This feature hasn\'t been implemented yet');
   }

   findPlaylist(id: string): SpotifyPlaylist {
      return this.state.playlists.find((playlist) => playlist.id === id) as SpotifyPlaylist;
   }

   render() {
      if (this.state.playlists.length > 0 ) {
         return (
            <div id="combined-playlists-wrapper" className="contentSpacing">
               <h1>Think of a cool name or somethin</h1>

               <div id="combined-playlists-content">
                  <section>
                     <h2>Create combined playlist</h2>
                     <PlaylistForm playlists={this.state.playlists} onSubmit={this.onSubmit} loading={this.state.loading} />
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
      } else {
         return (
            <div className={styles.container}>
               <h1>Loading...</h1>
            </div>
         );
      }
   }
}

export default App;
