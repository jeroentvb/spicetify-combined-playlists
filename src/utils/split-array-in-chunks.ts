export function splitArrayInChunks<T>(array: T[], itemsPerChunk = 100): T[][] {
   return array.reduce((result, item, index) => {
      const chunkIndex = Math.floor(index / itemsPerChunk);

      if(!result[chunkIndex]) {
         result[chunkIndex] = [];
      }

      result[chunkIndex].push(item);

      return result;
   }, [] as T[][]);
}
