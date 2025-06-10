"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getJob } from "@/lib/apiHandlers/job.apiHandler";
import { Job, JobConsignment } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type JobDetailsType = Job & {
  jobConsignments: JobConsignment[];
  fromLocationName: string | null;
  toLocationName: string | null;
};

export default function JobDetails() {
  const router = useRouter();
  const { organizationSlug, jobId } = router.query;

  const { data: job, isLoading } = useQuery<JobDetailsType>({
    queryKey: ["job", jobId],
    queryFn: () =>
      getJob(jobId as string, organizationSlug as string) as Promise<JobDetailsType>,
    enabled: !!jobId && !!organizationSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Information about job {job.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">From Location</p>
              <p>{job.fromLocationName || job.fromLocationId}</p>
            </div>
            <div>
              <p className="font-semibold">To Location</p>
              <p>{job.toLocationName || job.toLocationId}</p>
            </div>
            <div>
              <p className="font-semibold">Due Date</p>
              <p>{job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{job.status || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Consignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Container Identifier</TableHead>
                <TableHead>Container Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {job.jobConsignments && job.jobConsignments.length > 0 ? (
                job.jobConsignments.map((consignment) => (
                  <TableRow key={consignment.id}>
                    <TableCell>{consignment.containerIdentifier}</TableCell>
                    <TableCell>{consignment.containerType}</TableCell>
                    <TableCell>{consignment.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No consignments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 