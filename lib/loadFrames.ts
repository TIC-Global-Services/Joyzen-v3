/**
 * loadFrames.ts
 * Shared batched frame loader for canvas image sequences.
 * Used by DoctorAdvantage and BePart to load WebP frame sequences
 * with a concurrency limit to avoid overwhelming the browser network queue.
 */

const DEFAULT_BATCH_SIZE = 12;

/**
 * Loads an image sequence in batches with bounded concurrency.
 *
 * @param folder        Public folder path e.g. '3dbodyframes-webp'
 * @param total         Total number of frames (1-indexed)
 * @param ext           File extension: 'webp' or 'png'
 * @param imagesArray   Output array — populated as frames finish loading
 * @param onFirstLoaded Called when frame-1 is ready (so canvas can start rendering)
 * @param onProgress    Called after each frame finishes, with (loadedCount, totalFrames)
 * @param onComplete    Called when ALL frames are loaded (or failed)
 * @param batchSize     Max parallel requests at once (default 12)
 */
export async function loadFramesBatched(
  folder: string,
  total: number,
  ext: 'webp' | 'png',
  imagesArray: HTMLImageElement[],
  onFirstLoaded: () => void,
  onProgress: (loaded: number, total: number) => void,
  onComplete: () => void,
  batchSize: number = DEFAULT_BATCH_SIZE
): Promise<void> {
  let loadedCount = 0;
  let firstSignaled = false;

  const loadOne = (i: number): Promise<void> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = `/${folder}/frame-${i}.${ext}`;

      const finish = () => {
        loadedCount++;
        imagesArray[i - 1] = img;

        // Signal as soon as the very first frame is ready
        if (!firstSignaled && i === 1 && img.complete) {
          firstSignaled = true;
          onFirstLoaded();
        }

        onProgress(loadedCount, total);

        if (loadedCount === total) {
          onComplete();
        }

        resolve();
      };

      img.onload = () => {
        // For frame 1 loaded via onload (async)
        if (!firstSignaled && i === 1) {
          firstSignaled = true;
          onFirstLoaded();
        }
        finish();
      };
      img.onerror = finish;
    });

  for (let start = 1; start <= total; start += batchSize) {
    const end = Math.min(start + batchSize - 1, total);
    await Promise.all(
      Array.from({ length: end - start + 1 }, (_, k) => loadOne(start + k))
    );
  }
}
