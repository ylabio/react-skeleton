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
          cache.set(key, {
            ...cache.get(key),
            waiting: false,
            timeout: setTimeout(() => {
              cache.delete(key);
            }, 0),
          })
        }
      ),
      waiting: true,
      timeout: undefined,
    });
  }
  if (cache.get(key).waiting) {
    throw cache.get(key).promise;
  }
}
