"use client"

import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {Store} from "@prisma/client";
import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useForm} from "react-hook-form";
import {CreateStoreFormScheme, CreateStoreFormType} from "@/lib/validators/store-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";

interface SettingsFormProps {
    store: Store;
}
const SettingsForm = ({store}: SettingsFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm<CreateStoreFormType>({
        resolver: zodResolver(CreateStoreFormScheme),
        defaultValues: store,
    });

    const {mutate: UpdateStore, isLoading: UpdateIsLoading} = useMutation({
        mutationFn: async (payload: CreateStoreFormType) => {
            const {data} = await axios.patch(`/api/stores/${store.id}`, payload)
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    return toast.error('Store not found');
                }

                if (err.response?.status === 401) {
                    return toast.error('Unauthorized');
                }

                if (err.response?.status === 422) {
                    return toast.error('Invalid data passed');
                }
            }

            return toast.error('Something went wrong');
        },
        onSuccess: () => {
            router.refresh();
            toast.success('Store updated')
        },
    })

    const onSubmit = async (payload: CreateStoreFormType) => {
        await UpdateStore(payload);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store preferences"/>

                <Button
                    variant="destructive"
                    disabled={UpdateIsLoading}
                    size="sm"
                    onClick={() => {setOpen(true)}}
                    className="bg-red-600"
                >
                    <Trash className="h-4 w-4"/>
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
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={UpdateIsLoading} placeholder="Store name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="name"
                            control={form.control}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="ml-auto"
                        disabled={UpdateIsLoading}
                        isLoading={UpdateIsLoading}
                    >Save changes</Button>
                </form>
            </Form>
        </>
    )
};

export default SettingsForm;
