import React from 'react';
import { combinePlaylists, getPlaylistInfo, getPaginatedSpotifyData, TrackState } from './utils';
import { GET_PLAYLISTS_URL, LS_KEY } from './constants';
import type { CombinedPlaylist, SpotifyPlaylist, InitialPlaylistForm } from './types';

import './assets/css/styles.scss';
import { Card } from './components/Card';
import { SpicetifySvgIcon } from './components/SpicetifySvgIcon';
import { AddPlaylistCard } from './components/AddPlaylistCard';
import { PlaylistForm } from './components/AddPlaylistForm';

export interface State {
  playlists: SpotifyPlaylist[];
  combinedPlaylists: CombinedPlaylist[];
  isLoading: boolean;
  isInitializing: boolean;
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
         isLoading: false,
         isInitializing: false,
      };
   }

   @TrackState('isInitializing')
   async componentDidMount() {
      const playlists = await getPaginatedSpotifyData<SpotifyPlaylist>(GET_PLAYLISTS_URL);
      const combinedPlaylists = this.combinedPlaylistsLs.map((combinedPlaylist) => this.getMostRecentPlaylistFromData(combinedPlaylist, playlists));

      this.setState({
         playlists,
         combinedPlaylists
      });
   }

   @TrackState('isLoading')
   async createNewCombinedPlaylist(formData: InitialPlaylistForm) {
      const sourcePlaylists = formData.sources.map((source) => this.findPlaylist(source));
      const targetPlaylist = this.findPlaylist(formData.target);
      await combinePlaylists(sourcePlaylists, targetPlaylist);
      this.saveCombinedPlaylist(sourcePlaylists, targetPlaylist);

      Spicetify.PopupModal.hide();
   }

   /**
    * Save combined playlist to localstorage and state. Making sure not to create a duplicate
    */
   saveCombinedPlaylist(sourcePlaylists: SpotifyPlaylist[], targetPlaylist: SpotifyPlaylist) {
      const combinedPlaylist: CombinedPlaylist = {
         sources: sourcePlaylists.map(getPlaylistInfo),
         target: getPlaylistInfo(targetPlaylist),
      };

      const index = this.state.combinedPlaylists.findIndex(({ target }) => target.id === combinedPlaylist.target.id);
      let newCombinedPlaylists: CombinedPlaylist[];

      if (index >= 0) {
         newCombinedPlaylists = this.state.combinedPlaylists;
         newCombinedPlaylists[index] = combinedPlaylist;
      } else {
         newCombinedPlaylists = this.state.combinedPlaylists.concat(combinedPlaylist);
      }

      this.setState({
         combinedPlaylists: newCombinedPlaylists,
      });

      this.combinedPlaylistsLs = newCombinedPlaylists;
   }

   @TrackState('isLoading')
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

   showAddPlaylistModal() {
      const Form = <PlaylistForm playlists={this.state.playlists} onSubmit={this.createNewCombinedPlaylist.bind(this)} />;

      Spicetify.PopupModal.display({
         title: 'Create combined playlist',
         content: Form,
         isLarge: true,
      });
   }

   openEditPlaylistModal(combinedPlaylist: CombinedPlaylist) {
      const formValues: InitialPlaylistForm = {
         target: combinedPlaylist.target.id,
         sources: combinedPlaylist.sources.map((source) => source.id)
      };
      const Form = <PlaylistForm
         playlists={this.state.playlists}
         onSubmit={this.createNewCombinedPlaylist.bind(this)}
         initialForm={formValues}
      />;

      Spicetify.PopupModal.display({
         title: 'Edit combined playlist',
         content: Form,
         isLarge: true,
      });
   }

   render() {
      return (
         <div id="combined-playlists--wrapper" className="contentSpacing">
            <header>
               <h1>Playlist combiner</h1>
               <button onClick={() => this.showAddPlaylistModal()}><SpicetifySvgIcon iconName="plus2px" /></button>
            </header>

            {!this.state.isInitializing && <div id="combined-playlists--grid" className="main-gridContainer-gridContainer">
               {this.state.combinedPlaylists.map((combinedPlaylist) => {
                  const playlist = this.findPlaylist(combinedPlaylist.target.id);

                  return <Card
                     key={playlist.id}
                     playlist={playlist}
                     onClick={() => this.openEditPlaylistModal(combinedPlaylist)}
                     onClickAction={() => !this.state.isLoading && this.syncPlaylist(playlist.id)}
                  />;
               })}
               <AddPlaylistCard onClick={() => this.showAddPlaylistModal()} />
            </div>}
         </div>
      );
   }
}

export default App;
