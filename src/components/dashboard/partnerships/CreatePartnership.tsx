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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import {
  createPartnership,
  listTransporters,
} from "@/lib/apiHandlers/partnership.apiHandler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Organization } from "@/db/schema";

const formSchema = z.object({
  targetOrganizationId: z.string().min(1, "Please select an organization"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePartnership() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: transporters, isLoading: isLoadingTransporters } = useQuery<
    Organization[]
  >({
    queryKey: ["transporters"],
    queryFn: () => listTransporters(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetOrganizationId: "",
    },
  });

  const { mutate: createPartnershipMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: (targetOrganizationId: string) => createPartnership(organizationSlug as string, targetOrganizationId),
      onSuccess: () => {
        toast.success("Partnership created successfully!");
        router.push(`/ca/${organizationSlug}/partnerships`);
      },
      onError: (error: Error & { response?: { data?: { error?: string } } }) => {
        toast.error(
          error?.response?.data?.error || "Failed to create partnership"
        );
      },
    });

  function onSubmit(values: FormValues) {
    createPartnershipMutation(values.targetOrganizationId);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Partnership</CardTitle>
        <CardDescription>
          Select a transporter organization to create a partnership.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="targetOrganizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingTransporters}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingTransporters
                              ? "Loading..."
                              : "Select a transporter"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transporters?.map((transporter) => (
                        <SelectItem key={transporter.id} value={transporter.id!}>
                          {transporter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Partnership
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 