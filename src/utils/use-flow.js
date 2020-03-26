import {useEffect} from 'react';
import {useStore} from 'react-redux';

export default function useFlow({start, change, end, options = {}}, inputs = []) {
  const store = useStore();
  useEffect(() => {
    let prevState = store.getState();
    if (start) {
      start(prevState);
    }
    let unsubscribe;
    if (change) {
      unsubscribe = store.subscribe(() => {
        const state = store.getState();
        change(state, prevState);
        prevState = state;
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (end) {
        end(store.getState(), prevState);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
