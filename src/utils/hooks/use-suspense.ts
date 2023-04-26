import React, { useEffect } from "react";

let cache = new Map();

export default function useSuspense(callback: Function, key: NonNullable<unknown>) {
  useEffect(() => {
    return cache.clear();
  });
  if (!cache.has(key)) {
    cache.set(key, callback());
  }
  let promise = cache.get(key) as Promise<string> & {status: string; value: any; reason: any};
  if (promise.status === 'fulfilled') {
    // return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else {
    // promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
  return promise.value;
}
