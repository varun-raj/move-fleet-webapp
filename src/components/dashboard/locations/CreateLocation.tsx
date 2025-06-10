"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { createLocation } from "@/lib/apiHandlers/location.apiHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const locationCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  locationCoordinates: z.array(z.number()),
  privacy: z.boolean(),
  locationType: z.enum(["yard", "warehouse"]),
});

export type LocationCreate = z.infer<typeof locationCreateSchema>;

export default function CreateLocation() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const form = useForm<LocationCreate>({
    resolver: zodResolver(locationCreateSchema),
    defaultValues: {
      name: "",
      address: "",
      locationCoordinates: [0, 0],
      privacy: false,
      locationType: "yard",
    },
  });

  const { mutate: createLocationMutation, isPending: isSubmitting } = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      toast.success("Location created successfully!");
      router.push(`/ca/${organizationSlug}/locations`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create location");
    },
  }
  );

  function onSubmit(values: LocationCreate) {
    if (typeof organizationSlug !== "string") {
      toast.error("Organization slug not found");
      return;
    }

    createLocationMutation({ location: values, organizationSlug });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Location</CardTitle>
        <CardDescription>
          Fill in the details below to create a new location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name" {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yard">Yard</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "1")}
                      defaultValue={field.value ? "1" : "0"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Private</SelectItem>
                        <SelectItem value="1">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Location
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
