"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  ProductFormSchema,
  ProductFormSchemaType,
} from "@/lib/validators/product-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

interface ProductFormProps {
  product:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}
const ProductForm = ({
  product,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const title = product ? "Edit product" : "Create product";
  const description = product ? "Edit your product" : "Create a new product";
  const toastMessage = product ? "Product updated" : "Product created";
  const action = product ? "Save changes" : "Create";

  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product
      ? {
          ...product,
          price: parseFloat(String(product?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          quantity: 0,
          categoryId: "",
          sizeId: "",
          colorId: "",
          isArchived: false,
          isFeatured: false,
        },
  });

  const { mutate: CreateUpdate, isPending: CreateUpdateLoading } = useMutation({
    mutationFn: async (payload: ProductFormSchemaType) => {
      if (product) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          payload
        );
        return data;
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/products`,
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
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success(toastMessage);
    },
  });

  const { mutate: Delete, isPending: DeleteLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/${params.storeId}/products/${params.productId}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          return toast.error("Product not found");
        }

        if (err.response?.status === 401) {
          return toast.error("Unauthorized");
        }
      }

      return toast.error("Internal server error, try again later.");
    },
    onSuccess: () => {
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("Product Deleted.");
    },
  });

  const onSubmit = async (payload: ProductFormSchemaType) => {
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

        {product && (
          <Button
            variant="destructive"
            disabled={CreateUpdateLoading || DeleteLoading}
            size="icon"
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
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((image) => image.url !== url)
                      )
                    }
                    value={field.value.map((image) => image.url)}
                    disabled={CreateUpdateLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="images"
            control={form.control}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={CreateUpdateLoading}
                      placeholder="Product name"
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        type="number"
                        disabled={CreateUpdateLoading}
                        placeholder="Product price"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="price"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        type="number"
                        disabled={CreateUpdateLoading}
                        placeholder="Quantity in stock"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="quantity"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={CreateUpdateLoading || DeleteLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              name="categoryId"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={CreateUpdateLoading || DeleteLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a color"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              name="colorId"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={CreateUpdateLoading || DeleteLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              name="sizeId"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
              name="isFeatured"
              control={form.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
              name="isArchived"
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

export default ProductForm;
