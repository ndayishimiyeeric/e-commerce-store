"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Size } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { SizeFormSchema, SizeFormSchemaType } from "@/lib/validators/size-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import AlertModal from "@/components/modals/alert-modal";

interface SizeFormProps {
  size: Size | null;
}
const SizeForm = ({ size }: SizeFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const title = size ? "Edit size" : "Create size";
  const description = size ? "Edit your size" : "Create a new size";
  const toastMessage = size ? "Size updated" : "Size created";
  const action = size ? "Save changes" : "Create";

  const form = useForm<SizeFormSchemaType>({
    resolver: zodResolver(SizeFormSchema),
    defaultValues: size || {
      name: "",
      value: "",
    },
  });

  const { mutate: CreateUpdate, isPending: CreateUpdateLoading } = useMutation({
    mutationFn: async (payload: SizeFormSchemaType) => {
      if (size) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          payload
        );
        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/sizes`,
          payload
        );
        return data;
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Unauthorized");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthenticated");
        }

        if (err.response?.status === 422) {
          return toast.error("Invalid data passed");
        }
      }

      return toast.error("Something went wrong");
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      toast.success(toastMessage);
    },
  });

  const { mutate: Delete, isPending: DeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Billboard not found");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized");
        }
      }

      return toast.error(
        "Make sure to delete all products using this size first."
      );
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
      toast.success("Size Deleted.");
    },
  });

  const onSubmit = async (payload: SizeFormSchemaType) => {
    await CreateUpdate(payload);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={Delete}
        loading={CreateUpdateLoading || DeleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {size && (
          <Button
            variant="destructive"
            disabled={CreateUpdateLoading || DeleteLoading}
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={CreateUpdateLoading}
                      placeholder="Size Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="name"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={CreateUpdateLoading}
                      placeholder="Size Value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="value"
              control={form.control}
            />
          </div>

          <Button
            type="submit"
            className="ml-auto"
            disabled={CreateUpdateLoading || DeleteLoading}
          >
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  );
};

export default SizeForm;
