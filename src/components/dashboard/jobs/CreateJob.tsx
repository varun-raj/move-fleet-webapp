"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { createJob } from "@/lib/apiHandlers/job.apiHandler";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

const consignmentSchema = z.object({
  containerIdentifier: z.string().min(1, "Container identifier is required"),
  containerType: z.enum(["20ft", "40ft"]),
});

const formSchema = z.object({
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  dueDate: z.string().min(1, "Due date is required"),
  consignments: z.array(consignmentSchema).min(1, "At least one consignment is required"),
});

type FormValues = z.infer<typeof formSchema>;

const dummyLocations = [
  { id: "loc1", name: "New York" },
  { id: "loc2", name: "Los Angeles" },
  { id: "loc3", name: "Chicago" },
];

export default function CreateJob() {
  const [ft20, setFt20] = useState(0);
  const [ft40, setFt40] = useState(0);
  const router = useRouter();
  const { organizationSlug } = router.query;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      dueDate: "",
      consignments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "consignments",
  });

  const populateConsignments = () => {
    const newConsignments: { containerIdentifier: string; containerType: "20ft" | "40ft" }[] = [];
    for (let i = 0; i < ft20; i++) {
      newConsignments.push({ containerIdentifier: "", containerType: "20ft" });
    }
    for (let i = 0; i < ft40; i++) {
      newConsignments.push({ containerIdentifier: "", containerType: "40ft" });
    }
    append(newConsignments);
  };

  const { mutate: createJobMutation, isPending: isSubmitting } = useMutation({
    mutationFn: ({ job, organizationSlug }: { job: Parameters<typeof createJob>[0], organizationSlug: string }) => createJob(job, organizationSlug),
    onSuccess: (data) => {
      toast.success("Job created successfully!");
      // TODO: Redirect to the job details page
      console.log("Newly created job", data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create job");
    },
  });

  function onSubmit(values: FormValues) {
    if (typeof organizationSlug !== "string") {
      toast.error("Organization slug not found");
      return;
    }

    const { fromLocation, toLocation, dueDate, ...rest } = values;

    const jobData = {
      ...rest,
      fromLocationId: fromLocation,
      toLocationId: toLocation,
      dueDate: new Date(dueDate),
    };

    createJobMutation({ job: jobData, organizationSlug });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Job</CardTitle>
        <CardDescription>
          Fill in the details below to create a new job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fromLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dummyLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dummyLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Consignments</CardTitle>
                <Button
                  type="button"
                  onClick={() => append({ containerIdentifier: "", containerType: "20ft" })}
                >
                  Add Consignment
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.length === 0 && (
                  <div className="flex items-end gap-4 rounded-lg border p-4">
                    <div>
                      <Label htmlFor="20ft">20ft Containers</Label>
                      <Input
                        id="20ft"
                        type="number"
                        value={ft20}
                        onChange={(e) => setFt20(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="40ft">40ft Containers</Label>
                      <Input
                        id="40ft"
                        type="number"
                        value={ft40}
                        onChange={(e) => setFt40(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                    <Button type="button" onClick={populateConsignments}>
                      Populate
                    </Button>
                  </div>
                )}
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`consignments.${index}.containerIdentifier`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Container Identifier</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter container identifier" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`consignments.${index}.containerType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Container Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="20ft">20ft</SelectItem>
                              <SelectItem value="40ft">40ft</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Job
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
