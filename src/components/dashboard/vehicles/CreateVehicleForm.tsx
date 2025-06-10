"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createVehicle } from "@/lib/apiHandlers/vehicle.apiHandler";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleCreate } from "@/db/schema";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  floorSize: z.enum(["20ft", "40ft"]),
  status: z.enum(["active", "in_job", "inactive", "maintenance", "out_of_service"]),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function CreateVehicleForm() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: "",
      floorSize: "20ft",
      status: "active",
    },
  });

  const mutation = useMutation({
    mutationFn: (newVehicle: VehicleCreate) =>
      createVehicle(newVehicle, organizationSlug as string),
    onSuccess: () => {
      router.push(`/t/${organizationSlug}/vehicles`);
    },
  });

  const onSubmit = (values: VehicleFormData) => {
    const dataToSubmit: VehicleCreate = {
      ...values,
      status: values.status,
    };
    mutation.mutate(dataToSubmit);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AB-123-CD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Size</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a floor size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="20ft">20ft</SelectItem>
                              <SelectItem value="40ft">40ft</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="in_job">In Job</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="out_of_service">Out of Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                      </FormItem>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding Vehicle..." : "Add Vehicle"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  );
} 