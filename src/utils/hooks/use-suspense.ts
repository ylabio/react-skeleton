import { useEffect } from "react";

let cache = new Map();

export default function useSuspense(callback: Function, key: NonNullable<unknown>) {
  useEffect(() => {
    if(cache.get(key)?.timeout) clearTimeout(cache.get(key).timeout);

    return () => {
      cache.delete(key)
    };
  }, []);
  if (!cache.has(key)) {
    cache.set(key, {
      promise: new Promise(async (res, rej) => {
        try {
          await callback();
          res('done');
        }
        catch(e) {
          rej(e)
        }
      }).then(
        () => {
          cacheData.status = 'fulfilled';
          cacheData.timeout = setTimeout(() => {
            cache.delete(key);
          }, 0);
        },
        () => {
          cacheData.status = 'rejected';
          cacheData.timeout = setTimeout(() => {
            cache.delete(key);
          }, 0);
        },
      ),
      status: 'pending',
      timeout: undefined,
    });
  }
  let cacheData = cache.get(key) as {promise:Promise<string>, status: string; timeout: any};
  if (cacheData.status === 'pending') {
    throw cacheData.promise;
  }
}
