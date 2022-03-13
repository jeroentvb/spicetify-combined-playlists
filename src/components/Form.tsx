import { Formik, Form, FieldArray, Field } from 'formik';
import React from 'react';

interface Props {
   playlists: SpotifyApi.PlaylistObjectSimplified[];
   onSubmit: SubmitEventHandler;
   loading: boolean;
}

export interface InitialPlaylistForm {
   target: string,
   sources: string[]
}

export type SubmitEventHandler = (form : InitialPlaylistForm) => void

export function PlaylistForm({ playlists, onSubmit, loading }: Props) {

   const initialForm: InitialPlaylistForm = {
      target: '',
      sources: ['', '']
   };

   if (!loading) {
      return (
         <Formik
            initialValues={initialForm}
            onSubmit={onSubmit}
            render={({ values }) => (
               <Form>
                  <FieldArray
                     name="sources"
                     render={arrayHelpers => (
                        <div>
                           {values.sources && values.sources.length > 0 ? (
                              values.sources.map((_source, index) => (
                                 <div key={index}>
                                    <Field as="select" name={`sources.${index}`} className="main-dropDown-dropDown">
                                       <option value="">Select a source playlist</option>
                                       { playlists.map(({ id, name }) => (
                                          <option key={id} value={id}>{name}</option>
                                       )) }
                                    </Field>
                                    <button
                                       className='main-buttons-button main-button-outlined'
                                       type="button"
                                       onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                    > - </button>
                                 </div>
                              ))
                           ) : (
                              <button type="button" onClick={() => arrayHelpers.push('')}>
                                 {/* show this when user has removed all friends from the list */}
                              Add a friend
                              </button>
                           )}

                           <button
                              className='main-buttons-button main-button-outlined'
                              type="button"
                              onClick={() => arrayHelpers.push('')} // insert an empty string at a position
                           > + </button>
                        </div>
                     )}
                  />

                  <Field as="select" name="target" placeholder="Select target playlist"  className="main-dropDown-dropDown">
                     <option value="">Select target playlist</option>
                     { playlists.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                     )) }
                  </Field>

                  <button type="submit" className="main-buttons-button main-button-outlined">Submit</button>
               </Form>
            )}
         />
      );
   } else {
      return (
         <p>Loading...</p>
      );
   }


}
