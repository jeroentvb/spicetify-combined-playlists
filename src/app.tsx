import React from 'react';
import { combinePlaylists, getPlaylistInfo, getPaginatedSpotifyData, TrackState, setCombinedPlaylistsSettings, getCombinedPlaylistsSettings } from './utils';
import { CREATE_NEW_PLAYLIST_IDENTIFIER, CREATE_PLAYLIST_URL, GET_PLAYLISTS_URL, LIKED_SONGS_PLAYLIST_FACADE, LS_KEY } from './constants';
import type { CombinedPlaylist, SpotifyPlaylist, InitialPlaylistForm, CombinedPlaylistsSettings } from './types';

import './assets/css/styles.scss';
import { SpicetifySvgIcon } from './components/SpicetifySvgIcon';
import { PlaylistForm } from './components/AddPlaylistForm';
import { AddPlaylistCard } from './components/AddPlaylistCard';
import { Card } from './components/Card';
import { ImportExportModal } from './components/ImportExportModal';
import { synchronizeCombinedPlaylists } from './extensions/auto-sync';
import { UpdateBanner } from './components/UpdateBanner';

export interface State {
   playlists: SpotifyPlaylist[];
   combinedPlaylists: CombinedPlaylist[];
   isLoading: boolean;
   isInitializing: boolean;
   autoSync: boolean;
}

// Needs to be deinfed to avoid eslint error
const SpotifyComponents = Spicetify.ReactComponent;

class App extends React.Component<Record<string, unknown>, State> {

   get combinedPlaylistsLs(): CombinedPlaylist[] {
      return JSON.parse(Spicetify.LocalStorage.get(LS_KEY) as string) ?? [];
   }

   set combinedPlaylistsLs(playlists: CombinedPlaylist[]) {
      Spicetify.LocalStorage.set(LS_KEY, JSON.stringify(playlists));
   }

   constructor(props: Record<string, unknown>) {
      super(props);

      const settings = getCombinedPlaylistsSettings();

      this.state = {
         playlists: [],
         combinedPlaylists: [],
         isLoading: false,
         isInitializing: false,
         autoSync: settings.autoSync,
      };
   }

   @TrackState('isInitializing')
   async componentDidMount() {
      const playlists = [...await getPaginatedSpotifyData<SpotifyPlaylist>(GET_PLAYLISTS_URL), LIKED_SONGS_PLAYLIST_FACADE];
      const combinedPlaylists = this.combinedPlaylistsLs.map((combinedPlaylist) => this.getMostRecentPlaylistFromData(combinedPlaylist, playlists));
      const checkedCombinedPlaylists = this.checkIfPlaylistsAreStillValid(combinedPlaylists);

      this.setState({
         playlists,
         combinedPlaylists: checkedCombinedPlaylists
      });

      // Remove new top bar if it exists, because it interferes with the layout
      const topBarContent = document.querySelector<HTMLHeadingElement>('.main-topBar-container');
      if (topBarContent) topBarContent.style.display = 'none';
   }

   checkIfPlaylistsAreStillValid(combinedPlaylists: CombinedPlaylist[]) {
      const validPlaylists = combinedPlaylists
         .filter(({ target }) => target?.id) // Check if target playlist still exists
         .map((pl) => ({ ...pl, sources: pl.sources.filter(Boolean)})); // Check if source playlists still exist

      this.combinedPlaylistsLs = validPlaylists;

      return validPlaylists;
   }

   @TrackState('isLoading')
   async createNewCombinedPlaylist(formData: InitialPlaylistForm) {
      const sourcePlaylists = formData.sources.map((source) => this.findPlaylist(source));
      const targetPlaylist = formData.target === CREATE_NEW_PLAYLIST_IDENTIFIER
         ? await this.createPlaylist(formData.sources)
         : this.findPlaylist(formData.target);

      await combinePlaylists(sourcePlaylists, targetPlaylist)
         .catch((err) => {
            console.error('An error ocurred while combining playlists', err);
            Spicetify.showNotification('An error ocurred while combining playlists', true);
         });
      this.saveCombinedPlaylist(sourcePlaylists, targetPlaylist);

      Spicetify.PopupModal.hide();
   }

   async createPlaylist(sources: string[]) {
      const { username }: { username: string } = await Spicetify.Platform.UserAPI.getUser();
      const sourcePlaylistNames = sources.map((source) => this.findPlaylist(source).name);

      const newPlaylist = await Spicetify.CosmosAsync.post(CREATE_PLAYLIST_URL(username), {
         name: 'Combined Playlist',
         description: `Combined playlist from ${sourcePlaylistNames.join(', ')}.`,
         public: false,
      });

      this.setState((state) => ({ playlists: [...state.playlists, newPlaylist ] }));

      return newPlaylist;
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

      await combinePlaylists(sourcePlaylists, playlistToSync)
         .catch((err) => {
            console.error('An error ocurred while syncing playlists', err);
            Spicetify.showNotification('An error ocurred while syncing playlists', true);
         });
   }

   @TrackState('isLoading')
   async syncAllPlaylists() {
      Spicetify.showNotification('Synchronizing all combined playlists');
      await synchronizeCombinedPlaylists();
   }

   findPlaylist(id: string): SpotifyPlaylist {
      return this.state.playlists.find((playlist) => playlist.id === id) as SpotifyPlaylist;
   }

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

   openImportExportModal() {
      const importCombinedPlaylists = (combinedPlaylistsData: string) => {
         const combinedPlaylists = JSON.parse(combinedPlaylistsData);
         const safeCombinedPlaylists = this.checkIfPlaylistsAreStillValid(combinedPlaylists.map((combinedPlaylist: CombinedPlaylist) => this.getMostRecentPlaylistFromData(combinedPlaylist, this.state.playlists)));

         this.setState({ combinedPlaylists: safeCombinedPlaylists });

         this.combinedPlaylistsLs = safeCombinedPlaylists;

         Spicetify.showNotification('Imported combined playlists successfully!');
         Spicetify.PopupModal.hide();
      };

      Spicetify.PopupModal.display({
         title: 'Import / export combined playlists',
         content: <ImportExportModal combinedPlaylists={this.state.combinedPlaylists} importCombinedPlaylists={importCombinedPlaylists} />,
         isLarge: true,
      });
   }

   toggleAutoSuync() {
      const newSettings: CombinedPlaylistsSettings = {
         ...getCombinedPlaylistsSettings(),
         autoSync: !this.state.autoSync,
      };

      this.setState({ autoSync: newSettings.autoSync });
      setCombinedPlaylistsSettings(newSettings);
   }

   render() {
      const menuWrapper = (<SpotifyComponents.Menu>
         <SpotifyComponents.MenuItem
            label="Import / export combined playlists"
            leadingIcon={<SpicetifySvgIcon iconName="external-link" />}
            onClick={() => this.openImportExportModal()}
         >
            Import / export
         </SpotifyComponents.MenuItem>
         <SpotifyComponents.MenuItem
            label="Toggle auto sync"
            leadingIcon={<SpicetifySvgIcon iconName="repeat" />}
            onClick={() => this.toggleAutoSuync()}
         >
            {this.state.autoSync ? 'Disable auto sync' : 'Enable auto sync'}
         </SpotifyComponents.MenuItem>
         <SpotifyComponents.MenuItem
            label="Synchronize all combined playlists"
            leadingIcon={<SpicetifySvgIcon iconName="repeat-once" />}
            onClick={() => !this.state.isLoading && this.syncAllPlaylists()}
         >
            Synchronize all
         </SpotifyComponents.MenuItem>
      </SpotifyComponents.Menu>);

      return (
         <div id="combined-playlists--wrapper" className="contentSpacing">
            <div id="combined-playlists--header-content">
               <UpdateBanner />
               <header>
                  <h1>Playlist combiner</h1>
                  <button onClick={() => this.showAddPlaylistModal()}><SpicetifySvgIcon iconName="plus2px" /></button>
                  <SpotifyComponents.ContextMenu
                     trigger="click"
                     menu={menuWrapper}
                  >
                     <button><SpicetifySvgIcon iconName="more" /></button>
                  </SpotifyComponents.ContextMenu>
               </header>
            </div>

            {!this.state.isInitializing && <div id="combined-playlists--grid" className="main-gridContainer-gridContainer">
               {this.state.combinedPlaylists.map((combinedPlaylist) => {
                  const playlist = this.findPlaylist(combinedPlaylist.target.id);

                  return <Card
                     key={playlist.id}
                     playlist={playlist}
                     onClick={() => !this.state.isLoading && this.openEditPlaylistModal(combinedPlaylist)}
                     onClickAction={() => !this.state.isLoading && this.syncPlaylist(playlist.id)}
                  />;
               })}
               <AddPlaylistCard onClick={() => !this.state.isLoading && this.showAddPlaylistModal()} />
            </div>}
         </div>
      );
   }
}

export default App;
