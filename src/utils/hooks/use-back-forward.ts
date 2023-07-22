import {useEffect} from "react";

export default function useBackForward(fn: () => void, deps = []){
  // Хук работает только в браузере.
  useEffect(() => {
    window.addEventListener('popstate', fn);
    return () => {
      window.removeEventListener('popstate', fn);
    };
  }, deps);
}
