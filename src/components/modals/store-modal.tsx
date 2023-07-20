"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import Modal from "@/components/ui/Modal";
import {useStoreModal} from "@/hooks/use-store-modal";
import {CreateStoreFormScheme, CreateStoreFormType} from "@/lib/validators/store-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import toast from "react-hot-toast";

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const form = useForm<CreateStoreFormType>({
        resolver: zodResolver(CreateStoreFormScheme),
        defaultValues: {
            name: "",
        },
    });

    const {mutate: createStore, isLoading} = useMutation({
        mutationFn: async (values: CreateStoreFormType) => {
            const {data} = await axios.post('/api/stores', values);
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    return toast.error('Store already exists');
                }

                if (error.response?.status === 401) {
                    return toast.error('Unauthorized');
                }

                if (error.response?.status === 422) {
                    return toast.error('Invalid data');
                }
            }

            return toast.error('Something went wrong');
        },
        onSuccess: () => {
            toast.success(`Store created`);
        },
    })
    const onSubmit = async (values: CreateStoreFormType) => {
        await createStore(values);
    }

    return (
        <Modal
            title="Create store"
            description="Add a new store to manage your products and categories."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="E-commerce"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                name='name'
                                control={form.control}
                            />

                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button
                                    variant='outline'
                                    onClick={storeModal.onClose}
                                    disabled={isLoading}
                                >Cancel</Button>
                                <Button
                                    type='submit'
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                >Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
