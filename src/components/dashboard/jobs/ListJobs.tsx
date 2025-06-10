"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { listJobs } from "@/lib/apiHandlers/job.apiHandler";
import { Job } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type JobList = {
  job: Job;
  fromLocationName: string | null;
  toLocationName: string | null;
};

export default function ListJobs() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: jobs, isLoading } = useQuery<JobList[]>({
    queryKey: ["jobs", organizationSlug],
    queryFn: () => listJobs(organizationSlug as string),
    enabled: !!organizationSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>
              A list of all jobs in your organization.
            </CardDescription>
          </div>
          <Link href={`/ca/${organizationSlug}/jobs/create`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Job
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs && jobs.length > 0 ? (
              jobs.map(({ job, fromLocationName, toLocationName }) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <Link
                      href={`${router.asPath}/${job.id}`}
                      className="hover:underline"
                    >
                      {job.id}
                    </Link>
                  </TableCell>
                  <TableCell>{fromLocationName}</TableCell>
                  <TableCell>{toLocationName}</TableCell>
                  <TableCell>
                    {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>{job.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
