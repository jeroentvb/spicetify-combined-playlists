import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import type { FieldArrayRenderProps } from 'formik';
import React from 'react';
import { SpicetifySvgIcon } from './SpicetifySvgIcon';
import type { InitialPlaylistForm } from '../types/initial-playlist-form';

interface Props {
   playlists: SpotifyApi.PlaylistObjectSimplified[];
   onSubmit: SubmitEventHandler;
}

export type SubmitEventHandler = (form : InitialPlaylistForm) => void

export function PlaylistForm({ playlists, onSubmit }: Props) {
   const initialPlaylistForm: InitialPlaylistForm = {
      target: '',
      sources: ['', '']
   };

   const validationFn = (form: InitialPlaylistForm) => {
      const errors: Record<string, unknown> = {};

      if (form.sources.every((source) => !source)) errors.sources = 'Select at least on source playlist';
      if (!form.target) errors.target = 'Select a target playlist';

      return errors;
   };

   let sourcesFieldHelpers: FieldArrayRenderProps; // TODO find a cleaner way to handle this..

   const ErrorMsg = (props: { name: string }) => (<ErrorMessage name={props.name}>{msg => <div className="error-msg">{msg}</div>}</ErrorMessage>);

   return (
      <Formik
         initialValues={initialPlaylistForm}
         onSubmit={onSubmit}
         validate={validationFn}
      >
         {({ values, isSubmitting }) => (
            <Form id="create-combined-playlist-form">
               <fieldset disabled={isSubmitting}>
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

                                       {values.sources.length > 1 && <button
                                          className='main-buttons-button main-button-outlined'
                                          type="button"
                                          onClick={() => arrayHelpers.remove(index)}
                                          name="Remove playlist"
                                       >
                                          <SpicetifySvgIcon iconName="x" size={16} />
                                       </button>}
                                    </div>
                                 ))
                              ) : null}
                           </div>
                        );
                     }}
                  </FieldArray>
                  <ErrorMsg name="sources" />

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
                  <ErrorMsg name="target" />

                  <div id="form-actions-container">
                     <button
                        className='main-buttons-button main-button-outlined btn__add-playlist'
                        type="button"
                        onClick={() => sourcesFieldHelpers.push('')} // insert an empty string at a position
                     >Add another playlist</button>
                     <button type="submit" className="main-buttons-button main-button-outlined">{isSubmitting ? 'Loading..' : 'Submit'}</button>
                  </div>
               </fieldset>
            </Form>
         )}
      </Formik>
   );
}
