"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Size } from "@prisma/client";
import DeleteModel from "@/components/model/DeleteModel";

interface SFProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const SizeForm = ({ initialData }: SFProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add a new Size";
  const toastMessage = initialData ? "Size Updated" : "Size Created";
  const action = initialData ? "Update Changes" : "Create Size";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data,
        );
      } else {
        const response = await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      toast.success(toastMessage);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/sizes/${initialData?.id}`);
      router.refresh();
      toast.success("Size removed");
      router.push(`/${params.storeId}/sizes`);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <>
      <DeleteModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConform={onDelete}
        loading={isLoading}
      />

      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => setIsOpen(true)}
          >
            <Trash className="size-4 " />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Size Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Size Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} size={"sm"} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
