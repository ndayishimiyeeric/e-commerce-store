"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  BillboardFormSchema,
  BillboardFormSchemaType,
} from "@/lib/validators/billboard-form";
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
import ImageUpload from "@/components/ui/ImageUpload";

interface BillboardFormProps {
  billboard: Billboard | null;
}
const BillboardForm = ({ billboard }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const title = billboard ? "Edit billboard" : "Create billboard";
  const description = billboard
    ? "Edit your billboard"
    : "Create a new billboard";
  const toastMessage = billboard ? "Billboard updated" : "Billboard created";
  const action = billboard ? "Save changes" : "Create";

  const form = useForm<BillboardFormSchemaType>({
    resolver: zodResolver(BillboardFormSchema),
    defaultValues: billboard || {
      label: "",
      imageUrl: "",
    },
  });

  const {
    mutate: CreateUpdateBillboard,
    isPending: CreateUpdateBillboardIsLoading,
  } = useMutation({
    mutationFn: async (payload: BillboardFormSchemaType) => {
      if (billboard) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          payload
        );
        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/billboards`,
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
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      toast.success(toastMessage);
    },
  });

  const { mutate: DeleteBillboard, isPending: DeleteBIllboardLoading } =
    useMutation({
      mutationFn: async () => {
        const { data } = await axios.delete(
          `/api/${params.storeId}/billboards/${params.billboardId}`
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

        return toast.error("Something went wrong");
      },
      onSuccess: () => {
        router.push(`/${params.storeId}/billboards`);
        router.refresh();
        toast.success("Billboard Deleted.");
      },
    });

  const onSubmit = async (payload: BillboardFormSchemaType) => {
    await CreateUpdateBillboard(payload);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={DeleteBillboard}
        loading={CreateUpdateBillboardIsLoading || DeleteBIllboardLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {billboard && (
          <Button
            variant="destructive"
            disabled={CreateUpdateBillboardIsLoading || DeleteBIllboardLoading}
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
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}
                    disabled={CreateUpdateBillboardIsLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="imageUrl"
            control={form.control}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={CreateUpdateBillboardIsLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="label"
              control={form.control}
            />
          </div>

          <Button
            type="submit"
            className="ml-auto"
            disabled={CreateUpdateBillboardIsLoading || DeleteBIllboardLoading}
          >
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </>
  );
};

export default BillboardForm;
