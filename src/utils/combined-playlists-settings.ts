import { LS_KEY_SETTINGS } from '../constants';
import { CombinedPlaylistsSettings } from '../types';

const DEFAULT_SETTINGS: CombinedPlaylistsSettings = {
   autoSync: true
};

export function getCombinedPlaylistsSettings(): CombinedPlaylistsSettings {
   return JSON.parse(Spicetify.LocalStorage.get(LS_KEY_SETTINGS) ?? 'null') || DEFAULT_SETTINGS;
}

export function setCombinedPlaylistsSettings(settings: CombinedPlaylistsSettings) {
   Spicetify.LocalStorage.set(LS_KEY_SETTINGS, JSON.stringify(settings));
}
