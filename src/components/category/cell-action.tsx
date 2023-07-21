"use client"

import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import {CategoryColumn} from "@/types/category-column";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import {Button} from "@/components/ui/Button";
import {onCopy} from "@/lib/utils";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
    data: CategoryColumn;
}

const CellAction = ({data}: CellActionProps) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState<boolean>(false);

    const {mutate: deleteCategory, isLoading} = useMutation({
        mutationFn: async () => {
            const res = await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
            return res.data;
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

            return toast.error('Make sure you deleted all products using this category.');
        },
        onSuccess: () => {
            router.push(`/${params.storeId}/categories`);
            router.refresh();
            toast.success('Category Deleted.')
        },
    })

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={deleteCategory}
                loading={isLoading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id, "Category Id copied")}>
                        <Copy className="mr-2 w-4 h-4"/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}
                    >
                        <Edit className="mr-2 w-4 h-4"/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="mr-2 w-4 h-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}


export default CellAction;
