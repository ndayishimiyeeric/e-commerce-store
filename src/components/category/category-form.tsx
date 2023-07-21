"use client"

import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {Trash} from "lucide-react";
import {Billboard, Category} from "@prisma/client";
import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Separator} from "@/components/ui/Separator";
import {CategoryFormSchema, CategoryFormSchemaType} from "@/lib/validators/category-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";
import AlertModal from "@/components/modals/alert-modal";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/Select";

interface CategoryFormProps {
    category: Category | null;
    billboards: Billboard[];
}
const CategoryForm = ({category, billboards}: CategoryFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);

    const title = category ? 'Edit category' : 'Create category';
    const description = category ? 'Edit your category' : 'Create a new category';
    const toastMessage = category ? 'Category updated' : 'Category created';
    const action = category ? 'Save changes' : 'Create';

    const form = useForm<CategoryFormSchemaType>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: category || {
            name: '',
            billboardId: '',
        },
    });

    const {mutate: CreateUpdate, isLoading: CreateUpdateLoading} = useMutation({
        mutationFn: async (payload: CategoryFormSchemaType) => {
            if (category) {
                const {data} = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, payload)
                return data;
            } else {
                const {data} = await axios.post(`/api/${params.storeId}/categories`, payload)
                return data;
            }
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    return toast.error('Unauthorized');
                }

                if (err.response?.status === 401) {
                    return toast.error('Unauthenticated');
                }

                if (err.response?.status === 422) {
                    return toast.error('Invalid data passed');
                }
            }

            return toast.error('Something went wrong');
        },
        onSuccess: () => {
            router.push(`/${params.storeId}/categories`);
            router.refresh();
            toast.success(toastMessage)
        },
    })

    const {mutate: Delete, isLoading: DeleteLoading} = useMutation({
        mutationFn: async () => {
            const {data} = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    return toast.error('Category not found');
                }

                if (err.response?.status === 401) {
                    return toast.error('Unauthorized');
                }
            }

            return toast.error('Make sure you delete all products using this category first.');
        },
        onSuccess: () => {
            router.push(`/${params.storeId}/categories`);
            router.refresh();
            toast.success('Category Deleted.')
        },
    })

    const onSubmit = async (payload: CategoryFormSchemaType) => {
        await CreateUpdate(payload);
    };

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={Delete} loading={CreateUpdateLoading || DeleteLoading}/>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>

                {category && (<Button
                    variant="destructive"
                    disabled={CreateUpdateLoading || DeleteLoading}
                    isLoading={DeleteLoading}
                    size="sm"
                    onClick={() => {
                        setOpen(true)
                    }}
                    className="bg-red-600"
                >
                    <Trash className="h-4 w-4"/>
                </Button>)}
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={CreateUpdateLoading || DeleteLoading} placeholder="Category Name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="name"
                            control={form.control}
                        />

                        <FormField
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
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
                                                    placeholder="Select a billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                >
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="billboardId"
                            control={form.control}
                        />
                    </div>


                    <Button
                        type="submit"
                        className="ml-auto"
                        disabled={CreateUpdateLoading || DeleteLoading}
                        isLoading={CreateUpdateLoading}
                    >{action}</Button>
                </form>
            </Form>

            <Separator />
        </>
    )
};

export default CategoryForm;
