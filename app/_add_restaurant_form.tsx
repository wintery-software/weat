"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  name_zh: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  google_maps_url: z.string().url(),
  cuisine: z.string().min(1).max(255),
});

export const AddRestaurantForm = ({ className }: { className?: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      name_zh: "",
      address: "",
      google_maps_url: "",
      cuisine: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Restaurant Name" {...field} />
              </FormControl>
              <FormDescription>The restaurant name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name_zh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (Chinese)</FormLabel>
              <FormControl>
                <Input placeholder="餐厅名称" {...field} />
              </FormControl>
              <FormDescription>The restaurant name in Chinese.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormDescription>The restaurant address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="google_maps_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Maps URL</FormLabel>
              <FormControl>
                <Input placeholder="https://maps.app.goo.gl/..." {...field} />
              </FormControl>
              <FormDescription>The Google Maps URL to the restaurant.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisine</FormLabel>
              <FormControl>
                <Input placeholder="Chinese" {...field} />
              </FormControl>
              <FormDescription>The restaurant cuisine.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
