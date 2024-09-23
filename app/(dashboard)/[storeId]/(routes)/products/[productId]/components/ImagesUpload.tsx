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
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImagesUpload = ({ value, disable, onChange, onRemove }: IProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);

    setIsLoading(true);

    const newUrls: string[] = [];
    let completedUploads = 0;

    files.forEach(async (file: File) => {
      const filePath = `Products/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (uploadError) {
        toast.error(uploadError.message);
        setIsLoading(false);
        return;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      if (!data?.publicUrl) {
        toast.error("Failed to get public URL");
        setIsLoading(false);
        return;
      }

      // store the newly uploaded url
      newUrls.push(data.publicUrl);

      // increment the completed uploads
      completedUploads++;

      // if all uploads are completed, update the state with the new urls
      if (completedUploads === files.length) {
        setIsLoading(false);
      }

      // combine all the new urls with the existing urls
      onChange([...value, ...newUrls]);
    });
  };

  const onDelete = async (url: string) => {
    try {
      onRemove(url as string);
      // Extract the filename from the URL
      const fileName = url.split("/").slice(-1)[0];

      // Define the full path to the file inside the "Products" folder
      const filePath = `Products/${fileName}`;

      // Remove the file from Supabase storage
      const { error } = await supabase.storage
        .from("images")
        .remove([filePath]);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Something went wrong.");
    }
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
                  alt="Product Image"
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
                <PuffLoader size={30} color="#555" />
                <p>{`${processing.toFixed(2)}%`}</p>
              </>
            ) : (
              <>
                <Label>
                  <div className="flex size-full cursor-pointer flex-col items-center justify-center gap-2">
                    <ImagePlus className="size-4" />
                    <p className="text-sm">Upload Products image</p>
                    <input
                      type="file"
                      onChange={onUpload}
                      accept="image/*"
                      className="size-0 "
                      multiple
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

export default ImagesUpload;
