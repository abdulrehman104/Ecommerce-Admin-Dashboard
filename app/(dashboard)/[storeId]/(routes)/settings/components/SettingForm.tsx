"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import ApiAlter from "@/components/ApiAlter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import DeleteModel from "@/components/model/DeleteModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Store } from "@prisma/client";
import useOrigin from "@/hooks/useOrigin";

interface SFProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 3 characters.",
  }),
});

const SettingForm = ({ initialData }: SFProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/store/${params.storeId}`, data);
      toast.success("Store Updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/store/${params.storeId}`);
      toast.success("Store Removed");
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onClosed = () => {
    setIsOpen(false);
  };

  return (
    <>
      <DeleteModel
        isOpen={isOpen}
        onClose={onClosed}
        onConform={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => setIsOpen(true)}
        >
          <Trash className="size-4 " />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} size={"sm"} type="submit">
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlter
        title="NEXT_PUBLIC_API_URL"
        desc={`${origin}/api/${params.storeId}`}
        varient="public"
      />
    </>
  );
};

export default SettingForm;
