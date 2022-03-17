import { Formik, Form, FieldArray, Field } from 'formik';
import type { FormikHelpers, FieldArrayRenderProps } from 'formik';
import React from 'react';
import { SpicetifySvgIcon } from './SpicetifySvgIcon';
import type { InitialPlaylistForm } from '../types/initial-playlist-form';

interface Props {
   playlists: SpotifyApi.PlaylistObjectSimplified[];
   onSubmit: SubmitEventHandler;
   loading: boolean;
}

export type SubmitEventHandler = (form : InitialPlaylistForm, formHelpers: FormikHelpers<InitialPlaylistForm>) => void

export function PlaylistForm({ playlists, onSubmit, loading }: Props) {
   const initialPlaylistForm: InitialPlaylistForm = {
      target: '',
      sources: ['', '']
   };

   let sourcesFieldHelpers: FieldArrayRenderProps; // TODO find a cleaner way to handle this..

   return (
      <Formik
         initialValues={initialPlaylistForm}
         onSubmit={onSubmit}
      >
         {({ values }) => (
            <Form>
               <fieldset disabled={loading}>
                  <FieldArray name="sources">
                     {(arrayHelpers) => {
                        sourcesFieldHelpers = arrayHelpers;

                        return (
                           <div>
                              {values.sources && values.sources.length > 0 ? (
                                 values.sources.map((_source, index) => (
                                    <div key={index} className="select-wrapper">
                                       <Field as="select" name={`sources.${index}`} className="main-dropDown-dropDown">
                                          <option value="">Select a source playlist</option>
                                          { playlists.map(({ id, name }) => (
                                             <option key={id} value={id}>{name}</option>
                                          )) }
                                       </Field>
                                       <button
                                          className='main-buttons-button main-button-outlined'
                                          type="button"
                                          onClick={() => arrayHelpers.remove(index)}
                                       >
                                          <SpicetifySvgIcon iconName="x" />
                                       </button>
                                    </div>
                                 ))
                              ) : ''}
                           </div>
                        );
                     }}
                  </FieldArray>

                  <Field
                     as="select"
                     name="target"
                     placeholder="Select target playlist"
                     id="target-select-field"
                     className="main-dropDown-dropDown"
                  >
                     <option value="">Select target playlist</option>
                     { playlists.map(({ id, name }) => (
                        <option key={id} value={id}>{name}</option>
                     )) }
                  </Field>

                  <div id="form-actions-container">
                     <button
                        className='main-buttons-button main-button-outlined btn__add-playlist'
                        type="button"
                        onClick={() => sourcesFieldHelpers.push('')} // insert an empty string at a position
                     >Add another playlist</button>
                     <button type="submit" className="main-buttons-button main-button-outlined">{loading ? 'Loading..' : 'Submit'}</button>
                  </div>
               </fieldset>
            </Form>
         )}
      </Formik>
   );
}
