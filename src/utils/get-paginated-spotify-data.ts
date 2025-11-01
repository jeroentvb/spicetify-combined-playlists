export async function getPaginatedSpotifyData<T>(url: string): Promise<T[]> {
   const res: SpotifyApi.PagingObject<T> = await Spicetify.CosmosAsync.get(url);

   return [
      ...res.items,
      ...(res.next ? await getPaginatedSpotifyData<T>(res.next) : []),
   ];
}
