import React, { useRef } from 'react';
import type { CombinedPlaylist } from '../types/combined-playlist';

export interface ImportExportModalProps {
  combinedPlaylists: CombinedPlaylist[];
  importCombinedPlaylists: (combinedPlaylistsData: string) => void;
}

export function ImportExportModal({ combinedPlaylists, importCombinedPlaylists }: ImportExportModalProps) {
   const importInput = useRef<HTMLTextAreaElement>(null);

   function exportCombinedPlaylists() {
      // Copy combinedPlaylists to clipboard
      navigator.clipboard.writeText(JSON.stringify(combinedPlaylists));
      Spicetify.PopupModal.hide();
      Spicetify.showNotification('Combined playlists copied to clipboard');
   }

   return (
      <section id="import-export-modal">
         <h3>Export</h3>
         <div className="export-form">
            <button className="btn__import-export" onClick={exportCombinedPlaylists}>Export combined playlists</button>
         </div>

         <h3>Import</h3>
         <div className="import-form">
            <p>Paste the exported code here</p>
            <textarea ref={importInput} cols={30} rows={5}></textarea>
            <button className="btn__import-export" onClick={() => importCombinedPlaylists((importInput.current as HTMLTextAreaElement).value)}>Import</button>
         </div>
      </section>
   );
}
