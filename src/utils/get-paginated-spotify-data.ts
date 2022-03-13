export default async function getPaginatedSpotifyData<T = any>(url: string): Promise<T[]> {
   const res: SpotifyApi.PagingObject<T> = await Spicetify.CosmosAsync.get(url);

   return [
      ...res.items,
      ...(res.next ? await getPaginatedSpotifyData(res.next) : []),
   ];
}
