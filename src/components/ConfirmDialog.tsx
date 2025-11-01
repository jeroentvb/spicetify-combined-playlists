import React from 'react';

interface ComponentProps {
   confirmMsg: string;
   onConfirm: () => void;
   onCancel: () => void;
}

export function ConfirmDialog({ confirmMsg, onConfirm, onCancel }: ComponentProps) {
   return (
      <div id="combined-playlists-confirm-dialog">
         <p>{confirmMsg}</p>

         <div id="form-actions-container" className="form-actions__confirm">
            <button
               className='main-buttons-button main-button-outlined btn__add-playlist'
               type="button"
               onClick={() => onCancel()}
            >No</button>
            <button
               type="button"
               className="main-buttons-button main-button-outlined btn__confirm"
               onClick={() => onConfirm()}
            >
               Yes
            </button>
         </div>
      </div>
   );
}
