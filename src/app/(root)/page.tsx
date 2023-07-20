"use client"

import React, {useEffect} from "react";
import {useStoreModal} from "@/hooks/use-store-modal";

export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOPen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
      if(!isOPen) {
          onOpen();
      }
  }, [isOPen, onOpen])
  return (
      <div className="p-4">
          Root Page
      </div>
  )
}
