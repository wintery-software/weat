"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WeatAPI } from "@/lib/api";
import { DEFAULT_MAP_CAMERA_PROPS, PlaceTypes } from "@/lib/constants";
import type { API } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flatten } from "flat";
import { LucideCheck, LucideCircleHelp, LucideCopy, LucidePencil, LucideSend } from "lucide-react";
import { useSession } from "next-auth/react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const FORM_ID = "admin-place-form";

type PlaceFormProps =
  | { action: "create"; place?: API.Place }
  | {
      action: "update" | "duplicate";
      place: API.Place;
    };

const ACTIONS = {
  create: {
    action: "Create",
    icon: null,
    title: "Create Place",
    method: "POST",
  },
  update: {
    action: "Edit",
    icon: <LucidePencil />,
    title: "Edit Place",
    method: "PUT",
  },
  duplicate: {
    action: "Duplicate",
    icon: <LucideCopy />,
    title: "Duplicate Place",
    method: "POST",
  },
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
});

export const PlaceDialog = ({ action, place }: PlaceFormProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutatePlaceQuery = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await WeatAPI.request({
        method: ACTIONS[action].method,
        url: action === "create" ? "/admin/places" : `/admin/places/${place!.id}`,
        data,
        headers: {
          Authorization: `Bearer ${session!.accessToken}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the places query to refetch the data in the table
      // noinspection JSIgnoredPromiseFromCall
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
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
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema> | null) => {
    // if (!session || status !== "authenticated") {
    //   toast.error("Not authenticated. Please log in.");
    //
    //   return;
    // }

    console.log(values);
    // mutatePlaceQuery.mutate(values);
  };

  const watchedValues = useWatch({ control: form.control });
  const flatValues = flatten(watchedValues) as Record<string, unknown>;

  const unfilledFields = Object.entries(flatValues).filter((field) => {
    const v = field[1];

    if (v === undefined || v === null) {
      return true;
    }

    if (typeof v === "string" && v.trim() === "") {
      return true;
    }

    return typeof v === "object" && !Array.isArray(v) && Object.values(v).every((val) => !val);
  });

  const totalFields = Object.keys(flatValues);
  const filledFieldsCount = totalFields.length - unfilledFields.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {ACTIONS[action].icon}
          {ACTIONS[action].action}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ACTIONS[action].title}</DialogTitle>
          {place?.id && <DialogDescription className="font-mono text-xs">{place.id}</DialogDescription>}
        </DialogHeader>

        <ScrollArea className="flex h-[50vh] pr-2">
          <Form {...form}>
            <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 overflow-y-auto p-1">
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
                      <FormLabel>
                        Name (zh) <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
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
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="location.latitude"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
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
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Advanced Properties</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <LucideCircleHelp className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Properties that are used in the detail page.</p>
                    </TooltipContent>
                  </Tooltip>
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
                        <Input placeholder="ChIJ_Yjh6Za1j4AR8IgGUZGDDTs" className="font-mono" {...field} />
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
                      <FormLabel>
                        Phone Number <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
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
                      <FormLabel>
                        Website URL <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
        <div className="flex items-center justify-center gap-1 sm:justify-end">
          {filledFieldsCount === totalFields.length ? (
            <LucideCheck className="size-5 font-black text-green-700" strokeWidth={3} />
          ) : (
            <div className="size-4">
              <CircularProgressbar value={(filledFieldsCount / totalFields.length) * 100} strokeWidth={16} />
            </div>
          )}
          {filledFieldsCount === totalFields.length ? (
            <span className="w-32 text-right text-sm">
              {filledFieldsCount} / {totalFields.length} field
              {filledFieldsCount > 1 && "s"} filled
            </span>
          ) : (
            <Tooltip>
              <TooltipTrigger className="w-32 text-right text-sm">
                {filledFieldsCount} / {totalFields.length} field
                {filledFieldsCount > 1 && "s"} filled
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Unfilled fields</p>
                <ul className="list-inside list-disc">
                  {unfilledFields.map((field) => (
                    <li key={field[0]}>{field[0]}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button form={FORM_ID} type="submit" disabled={!form.formState.isValid || mutatePlaceQuery.isPending}>
              <LucideSend />
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
