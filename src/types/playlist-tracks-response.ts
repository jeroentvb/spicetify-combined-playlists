export interface PlaylistContentsResponse {
   items: {
      uri: string;
      isPlayable?: boolean;
   }[];
}
