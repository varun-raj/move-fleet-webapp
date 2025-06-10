"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FindJobListItem, findJobs } from "@/lib/apiHandlers/job.apiHandler";
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


export default function FindJobs() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: jobs = [], isLoading } = useQuery<FindJobListItem[]>({
    queryKey: ["find-jobs", organizationSlug],
    queryFn: () => findJobs(organizationSlug as string),
    enabled: !!organizationSlug,
  });

  console.log(jobs);

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
            <CardTitle>Find Jobs</CardTitle>
            <CardDescription>
              A list of all open jobs from your partners available for bidding.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.fromLocation.name}</TableCell>
                  <TableCell>{job.toLocation.name}</TableCell>
                  <TableCell>
                    {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Link href={`/tr/${organizationSlug}/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        View & Bid
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No biddable jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
