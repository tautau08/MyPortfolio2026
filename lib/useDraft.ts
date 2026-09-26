"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

/**
 * State that survives a reload by living in this browser's localStorage.
 * Storage can be unavailable (private mode, blocked site data), so every access is guarded
 * and the state simply starts empty.
 */
export function useDraft<T extends object>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState(initial);
  const initialRef = useRef(initial);
  const restored = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue({ ...initialRef.current, ...JSON.parse(saved) });
    } catch {
      // No storage, or a corrupt draft: start empty.
    }
  }, [key]);

  useEffect(() => {
    // Skip the first run so the empty initial state never overwrites a saved draft.
    if (!restored.current) {
      restored.current = true;
      return;
    }
    try {
      if (value === initialRef.current) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: the draft just won't persist.
    }
  }, [key, value]);

  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to clear.
    }
    setValue(initialRef.current);
  };

  return [value, setValue, clear];
}
