"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Model from "@/components/model/Model";
import { useStoreModel } from "@/hooks/useStoreModel";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 3 characters.",
  }),
});

export default function StoreModel() {
  const [isLoading, setIsLoading] = useState(false);
  const storeModel = useStoreModel();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/store", values);
      toast.success("Store Created");
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Model
      title="Create a new store"
      description="Add a new store to manage the products and categories"
      isOpen={storeModel.isOpen}
      onClose={storeModel.onClose}
    >
      <>
        <div className="space-y-4 py-2 pb-4 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter your store name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-end space-x-2 pt-6">
                <Button
                  disabled={isLoading}
                  type="button"
                  size="sm"
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" size="sm">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </>
    </Model>
  );
}
