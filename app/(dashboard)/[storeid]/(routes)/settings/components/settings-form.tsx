"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormvalues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormvalues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
//Save store's name
    const onSubmit = async (data: SettingsFormvalues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeid}`, data);
            router.refresh();
            toast.success("Store updated")
        } catch (error) {
          toast.error("Something went wrong") 
        } finally {
            setLoading(false);
        }
    }

//Delete store
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeid}`);
            router.refresh();
            router.push('/');
            toast.success("Store deleted");
        } catch (error) {
            toast.error("Make sure you remove all products from the store") 
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
                title="Settings's title"
                description="manage Store production"
            />
            <Button
                disabled={loading}
                variant={"destructive"}
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        </div>
        <Separator className="mt-3"/>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store Name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" typeof="submit">
                        Save Changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeid}`} variant="public"/>
    </>
    );
};