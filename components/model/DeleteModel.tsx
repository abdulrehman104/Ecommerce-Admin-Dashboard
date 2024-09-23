"use client";

import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DProps {
  isOpen: boolean;
  onClose: () => void;
  onConform: () => void;
  loading: boolean;
}

const DeleteModel = ({ isOpen, onClose, onConform, loading }: DProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Model
      title="Are you sure?"
      description="This action cannot be undone!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end gap-x-5">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConform}>
          Continue
        </Button>
      </div>
    </Model>
  );
};

export default DeleteModel;
