"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { type Store, type AllowedOrigin } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  CreateStoreFormScheme,
  CreateStoreFormType,
} from "@/lib/validators/store-form";
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
import ApiAlert from "@/components/ui/ApiAlert";
import { useOrigin } from "@/hooks/use-origin";
import {
  AllowedOriginSchema,
  AllowedOriginType,
} from "@/lib/validators/allowed-origin";
import { badgeVariants } from "./ui/Badge";

interface SettingsFormProps {
  store: Store;
  allowedOrigins: AllowedOrigin[];
}
const SettingsForm = ({ store, allowedOrigins }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<CreateStoreFormType>({
    resolver: zodResolver(CreateStoreFormScheme),
    defaultValues: store,
  });

  const allowedOriginsForm = useForm<AllowedOriginType>({
    resolver: zodResolver(AllowedOriginSchema),
    defaultValues: { origin: "" },
  });

  const { mutate: UpdateStore, isPending: UpdateIsLoading } = useMutation({
    mutationFn: async (payload: CreateStoreFormType) => {
      const { data } = await axios.patch(
        `/api/stores/${params.storeId}`,
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Store not found");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized");
        }

        if (err.response?.status === 422) {
          return toast.error("Invalid data passed");
        }
      }

      return toast.error("Something went wrong");
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Store updated");
    },
  });

  const { mutate: DeleteStore, isPending: DeleteStoreLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/stores/${params.storeId}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Store not found");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized");
        }
      }

      return toast.error("Make sure you deleted all products and categories");
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
      toast.success("Store deleted");
    },
  });

  const { mutate: AddAllowedOrigin, isPending: addOriginLoading } = useMutation(
    {
      mutationFn: async (payload: AllowedOriginType) => {
        const { data } = await axios.post(
          `/api/${params.storeId}/origins`,
          payload
        );
        return data as AllowedOrigin;
      },

      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error("Origin not added");
        }
      },

      onSuccess: () => {
        router.refresh();
        allowedOriginsForm.reset();
        toast.success("Origin added");
      },
    }
  );

  const onSubmit = async (payload: CreateStoreFormType) => {
    UpdateStore(payload);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={DeleteStore}
        loading={UpdateIsLoading || DeleteStoreLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />

        <Button
          variant="destructive"
          disabled={UpdateIsLoading || DeleteStoreLoading}
          size="icon"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                      disabled={UpdateIsLoading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="name"
              control={form.control}
            />
          </div>

          <Button
            type="submit"
            className="ml-auto"
            disabled={UpdateIsLoading || DeleteStoreLoading || addOriginLoading}
          >
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />

      <Separator />

      <div className="space-y-3">
        <h4 className="font-medium text-base">Allowed origins</h4>

        <ul className="grid gap-2">
          {allowedOrigins.map((item) => (
            <AllowedOrigin key={item.id} origin={item} />
          ))}
        </ul>

        <Form {...allowedOriginsForm}>
          <form
            onSubmit={allowedOriginsForm.handleSubmit((payload) =>
              AddAllowedOrigin(payload)
            )}
            className="space-x-2 w-full flex items-start"
          >
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={UpdateIsLoading}
                      placeholder="Allowed url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="origin"
              control={allowedOriginsForm.control}
            />

            <Button
              type="submit"
              disabled={
                UpdateIsLoading || DeleteStoreLoading || addOriginLoading
              }
              size="sm"
              variant="outline"
            >
              Add
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default SettingsForm;

const AllowedOrigin = ({
  origin,
  key,
}: {
  origin: AllowedOrigin;
  key?: string;
}) => {
  const router = useRouter();

  const { mutate: DeleteOrigin, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${origin.storeId}/origins/${origin.id}`
      );
      return data;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Origin not deleted");
      }
    },

    onSuccess: () => {
      toast.success("Origin deleted");
      router.refresh();
    },
  });

  return (
    <li
      key={key}
      className="p-1 text-sm border rounded-lg flex items-center gap-2 max-w-fit"
    >
      {origin.origin}
      <button
        className={badgeVariants({ variant: "destructive" })}
        onClick={async () => DeleteOrigin()}
        disabled={isPending}
      >
        remove
      </button>
    </li>
  );
};
