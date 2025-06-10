"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FindJobListItem, findJobs } from "@/lib/apiHandlers/job.apiHandler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BidModal from "./BidModal";

export default function FindJobs() {
  const router = useRouter();
  const { organizationSlug } = router.query;
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<FindJobListItem | null>(null);

  const { data: jobs = [], isLoading } = useQuery<FindJobListItem[]>({
    queryKey: ["find-jobs", organizationSlug],
    queryFn: () => findJobs(organizationSlug as string),
    enabled: !!organizationSlug,
  });

  console.log(jobs);

  const handleOpenBidModal = (job: FindJobListItem) => {
    setSelectedJob(job);
    setIsBidModalOpen(true);
  };

  const handleCloseBidModal = () => {
    setSelectedJob(null);
    setIsBidModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
        <p className="text-muted-foreground">
          A list of all open jobs from your partners available for bidding.
        </p>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>
                      {job.fromLocation.name} → {job.toLocation.name}
                    </CardTitle>
                    <CardDescription>
                      {job.dueDate
                        ? `Due by ${new Date(
                          job.dueDate,
                        ).toLocaleDateString()}`
                        : "No due date specified"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenBidModal(job)}
                    className="flex-shrink-0"
                    disabled={job.hasBid}
                  >
                    {job.hasBid ? "Bid Placed" : "View & Bid"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    20ft Consignments
                  </p>
                  <p className="text-sm font-semibold">
                    {job.twentyFtConsignments}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    40ft Consignments
                  </p>
                  <p className="text-sm font-semibold">
                    {job.fortyFtConsignments}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex h-48 flex-col items-center justify-center space-y-2 text-center">
            <p className="text-lg font-medium">No Biddable Jobs Found</p>
            <p className="text-sm text-muted-foreground">
              Check back later for more opportunities.
            </p>
          </CardContent>
        </Card>
      )}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={handleCloseBidModal}
        job={selectedJob}
        organizationSlug={organizationSlug as string}
      />
    </div>
  );
}
