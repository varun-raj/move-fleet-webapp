"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { listJobs } from "@/lib/apiHandlers/job.apiHandler";
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
import { JobListType } from "@/lib/apiHandlers/job.apiHandler";

export default function ListJobs() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: jobs, isLoading } = useQuery<JobListType[]>({
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
              <TableHead>Bids</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs && jobs.length > 0 ? (
              jobs.map(({ fromLocationName, toLocationName, job, bidCount }) => (
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
                  <TableCell>{bidCount}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/ca/${organizationSlug}/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        View Job
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
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
