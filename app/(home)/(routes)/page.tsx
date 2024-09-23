"use client";

import { useStoreModel } from "@/hooks/useStoreModel";
import { useEffect } from "react";

export default function Home() {
  const onOpen = useStoreModel((state) => state.onOpen);
  const isOpen = useStoreModel((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return null;
}
