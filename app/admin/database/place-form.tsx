"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WeatAPI } from "@/lib/api";
import { DEFAULT_MAP_CAMERA_PROPS, PlaceTypes } from "@/lib/constants";
import type { API } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LucideCircleHelp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type PlaceFormProps = { action: "create"; place?: API.Place } | { action: "update" | "duplicate"; place: API.Place };

const REQUEST_METHODS = {
  create: "POST",
  update: "PUT",
  duplicate: "POST",
};

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  name_zh: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  type: z.nativeEnum(PlaceTypes),
  location: z.object({
    latitude: z.coerce
      .number()
      .min(-90, {
        message: "Latitude must be between -90 and 90.",
      })
      .max(90, {
        message: "Latitude must be between -90 and 90.",
      }),
    longitude: z.coerce
      .number()
      .min(-180, {
        message: "Longitude must be between -180 and 180.",
      })
      .max(180, {
        message: "Longitude must be between -180 and 180.",
      }),
  }),
  address: z.string().trim().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  google_maps_url: z
    .string()
    .trim()
    .url({
      message: "Google Maps URL must be a valid URL.",
    })
    .refine((val) => val.startsWith("https://maps.app.goo.gl/"), {
      message: "Google Maps URL must start with https://maps.app.goo.gl/",
    }),
  google_maps_place_id: z.string().trim().length(27, {
    message: "Google Maps Place ID must be 27 characters.",
  }),
  phone_number: z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  website_url: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().url().nullable(),
  ),
  opening_hours: z.array(z.string().trim()),
  properties: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          // Return the string to trigger validation error
          return val;
        }
      }

      return val;
    },
    // This will validate that the value is actually an object after preprocessing
    z
      .record(z.string(), z.unknown())
      .default({})
      .refine((val) => typeof val !== "string", { message: "Please enter valid JSON" }),
  ),
  tags: z.array(z.string().trim()),
});

const PlaceForm = ({ action, place }: PlaceFormProps) => {
  const { data: session } = useSession();

  const mutatePlaceQuery = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await WeatAPI.request({
        method: REQUEST_METHODS[action],
        url: action === "update" ? `/admin/places/${place!.id}` : "/admin/places/",
        data,
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success(`Place ${action}d successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to ${action} place: ${error.message}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: place?.name ?? "",
      name_zh: place?.name_zh ?? null,
      type: place?.type ?? PlaceTypes.FOOD,
      location: {
        latitude: place?.location.latitude ?? 0,
        longitude: place?.location.longitude ?? 0,
      },
      address: place?.address ?? "",
      google_maps_url: place?.google_maps_url ?? "",
      google_maps_place_id: place?.google_maps_place_id ?? "",
      phone_number: place?.phone_number ?? null,
      website_url: place?.website_url ?? null,
      opening_hours: place?.opening_hours ?? [],
      properties: place?.properties ?? {},
      tags: place?.tags ?? [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // if (!session || status !== "authenticated") {
    //   toast.error("Not authenticated. Please log in.");
    //
    //   return;
    // }

    console.log(values);
    // mutatePlaceQuery.mutate(values);
  };

  return (
    <div className="flex max-h-[80vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-1">
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input className="font-mono" defaultValue={place?.id ?? ""} disabled />
              </FormControl>
              <FormDescription>For validation only. Do not modify.</FormDescription>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Wintery Software" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_zh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (zh) (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="简体中文" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PlaceTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.0000001}
                      placeholder={DEFAULT_MAP_CAMERA_PROPS.defaultCenter.lat.toString()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.0000001}
                      placeholder={DEFAULT_MAP_CAMERA_PROPS.defaultCenter.lng.toString()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex items-center gap-2">
                <Label>Advanced Properties</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <LucideCircleHelp className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Properties that are used in the detail page.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Separator className="my-2 w-full" />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Example St, Santa Clara, CA 95050" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="google_maps_place_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps Place ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ChIJ_Yjh6Za1j4AR8IgGUZGDDTs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Hours (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Example St, Santa Clara, CA 95050" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="properties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Properties (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-mono"
                      value={typeof field.value === "object" ? JSON.stringify(field.value, null, 2) : field.value}
                      onChange={(e) => {
                        try {
                          // When user edits, try to parse as JSON
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch {
                          // If parsing fails, just store the raw string
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-t pt-6">
            <Button className="w-full" type="submit" disabled={mutatePlaceQuery.isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlaceForm;
