"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Color } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  ColorFormSchema,
  ColorFormSchemaType,
} from "@/lib/validators/color-form";
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

interface ColorFormProps {
  color: Color | null;
}
const ColorForm = ({ color }: ColorFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const title = color ? "Edit color" : "Create color";
  const description = color ? "Edit your color" : "Create a new color";
  const toastMessage = color ? "Color updated" : "Color created";
  const action = color ? "Save changes" : "Create";

  const form = useForm<ColorFormSchemaType>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: color || {
      name: "",
      value: "",
    },
  });

  const { mutate: CreateUpdate, isPending: CreateUpdateLoading } = useMutation({
    mutationFn: async (payload: ColorFormSchemaType) => {
      if (color) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          payload
        );
        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/colors`,
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
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success(toastMessage);
    },
  });

  const { mutate: Delete, isPending: DeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Color not found");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized");
        }
      }

      return toast.error(
        "Make sure to delete all products using this color first."
      );
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/colors`);
      router.refresh();
      toast.success("Color Deleted.");
    },
  });

  const onSubmit = async (payload: ColorFormSchemaType) => {
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

        {color && (
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
                  <FormLabel>Color name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={CreateUpdateLoading}
                      placeholder="Color name"
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
                  <FormLabel>Color Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={CreateUpdateLoading}
                        placeholder="Color Value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;
