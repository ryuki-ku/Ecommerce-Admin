"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";

//Check if user input only one character
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Please input at least one character!!!"
    }),
    // age: z.coerce.number({
    //     invalid_type_error: "Please enter your age",
    //     required_error: "Your age must be 18 or above"
    // }).gte(18)
});


export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
        
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('/api/stores', values);

            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast.error("something went wrong");
        } finally {
            setLoading(false)
        }
    };

    return (
    <Modal
        title="Create store"
        description="Add a new store to manage product and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
         <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={loading} 
                                placeholder="E-commerce" 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                
                    {/* <FormField 
                        control={form.control}
                        name="age"
                        render={({field}) => (
                          <FormItem className="pt-4">
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter number here" {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                    /> */}
                    <div className="pt-6 space-x-2 items-center flex justify-end w-full">
                        <Button 
                        disabled={loading} 
                        type="submit"
                        >
                            Continue
                            </Button>

                        <Button 
                        disabled={loading}
                        variant={"ghost"} 
                        onClick={storeModal.onClose}
                        >
                            Cancel
                            </Button>
                    </div>
                            
                </form>
            </Form>
         </div>
        </div>
    </Modal>
    );
};