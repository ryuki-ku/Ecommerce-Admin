"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code"
    })
});

type ColorFormvalues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color| null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product's color" : "Create Product's color";
    const description = initialData ? "Edit a Product's color" : "Add a new Product's color";
    const toastMessage = initialData ? "Product'color updated" : "Product's color created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColorFormvalues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        },
    });
//Save size
    const onSubmit = async (data: ColorFormvalues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeid}/colors/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeid}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeid}/colors`)
            toast.success(toastMessage)
        } catch (error) {
          toast.error("Something went wrong") 
        } finally {
            setLoading(false);
        }
    }

//Delete size
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeid}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeid}/colors`);
            toast.success("Color's value deleted");
        } catch (error) {
            toast.error("Make sure you remove all products using this color first") 
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
                title={title}
                description={description}
            />
            {initialData && (
                <Button
                disabled={loading}
                variant={"destructive"}
                size="sm"
                onClick={() => setOpen(true)}
            >
                 <Trash className="h-4 w-4"/>
                </Button>
            )}
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
                                    <Input disabled={loading} placeholder="Color's name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                    <Input disabled={loading} placeholder="Color's value" {...field}/>
                                    <div 
                                        className="border p-4 rounded-full"
                                        style={{backgroundColor: field.value}}                                
                                    />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" typeof="submit">
                        {action}
                </Button>
            </form>
        </Form>
    </>
    );
};