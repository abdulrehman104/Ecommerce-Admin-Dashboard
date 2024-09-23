"use client";

import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import toast from "react-hot-toast";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

interface IProps {
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUploder = ({ value, disable, onChange, onRemove }: IProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: any) => {
    const imageFile = e.target.files[0];

    setIsLoading(true);

    const fileName = `images-${Date.now()}-${imageFile.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: imageFile.type,
      });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    if (!publicURL) {
      toast.error("Failed to get public URL");
      setIsLoading(false);
      return;
    }

    onChange(publicURL.publicUrl);
    setIsLoading(false);
  };

  const onDelete = async (url: string) => {
    onRemove(url as string);

    const filePath = url.split("/").slice(-1)[0];

    const { error } = await supabase.storage.from("images").remove([filePath]);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Image deleted successfully");
  };

  return (
    <>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative size-52 overflow-hidden rounded-md"
                key={url}
              >
                <Image
                  fill
                  className="object-cover"
                  alt="Billboard Image"
                  src={url}
                />
                <div className="z-2 absolute right-2 top-2 ">
                  <Button
                    type="button"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => onDelete(url)}
                  >
                    <Trash className="size-3 " />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex size-52 flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-200">
            {isLoading ? (
              <>
                <PuffLoader size={30} />
                <p>{` ${processing.toFixed(2)}%`}</p>
              </>
            ) : (
              <>
                <Label>
                  <div className="flex size-full cursor-pointer flex-col items-center justify-center gap-2">
                    <ImagePlus className="size-4" />
                    <p className="text-sm">Upload an image</p>
                    <input
                      type="file"
                      onChange={onUpload}
                      accept="image/*"
                      className="size-0 "
                    />
                  </div>
                </Label>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ImageUploder;
