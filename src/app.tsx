import styles from './css/app.module.scss';
import React from 'react';
import { PlaylistForm } from './components/Form';
import type { SubmitEventHandler } from './components/Form';

import getPaginatedSpotifyData from './utils/get-paginated-spotify-data';
import combinePlaylists from './utils/combine-playlists';
import { GET_PLAYLISTS_URL } from './constants';


interface State {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  loading: boolean;
}

class App extends React.Component<Record<string, unknown>, State> {

   constructor(props: Record<string, unknown>) {
      super(props);

      this.state = {
         playlists: [],
         loading: false,
      };

      console.log(Spicetify);
   }

   async componentDidMount() {
      const playlists = await getPaginatedSpotifyData<SpotifyApi.PlaylistObjectSimplified>(GET_PLAYLISTS_URL);
      this.setState({ playlists });
   }

   onSubmit: SubmitEventHandler = async (formData) => {
      this.setState({ loading: true });

      const sources = formData.sources.map((source) => this.findPlaylist(source));
      const target = this.findPlaylist(formData.target);
      const total = await combinePlaylists(sources, target);

      this.setState({ loading: false });

      console.log(total);
   };

   findPlaylist(id: string): SpotifyApi.PlaylistObjectSimplified {
      return this.state.playlists.find((playlist) => playlist.id === id) as SpotifyApi.PlaylistObjectSimplified;
   }

   render() {
      if (this.state.playlists.length > 0 ) {
         return (
            <div className={`${styles.container} contentSpacing`}>
               <h1>Combined playlists</h1>
               <PlaylistForm playlists={this.state.playlists} onSubmit={this.onSubmit} loading={this.state.loading} />
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
