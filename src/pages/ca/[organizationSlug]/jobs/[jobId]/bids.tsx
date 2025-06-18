"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBidsForJob, getJob, updateBidItems, type Bid, type UpdateBidItemsRequest } from "@/lib/apiHandlers/job.apiHandler";
import ApproveBidDialog from "@/components/dashboard/jobs/ApproveBidDialog";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-200 text-gray-800",
  accepted: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  bidding_accepted: "bg-green-100 text-green-700",
  bidding_rejected: "bg-red-100 text-red-700",
};

export default function JobBidsPage() {
  const router = useRouter();
  const { organizationSlug, jobId } = router.query;
  const queryClient = useQueryClient();
  const [selectedBid, setSelectedBid] = React.useState<Bid | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data: bids = [], isLoading, error } = useQuery<Bid[]>({
    queryKey: ["job-bids", jobId],
    queryFn: () => getBidsForJob(jobId as string, organizationSlug as string),
    enabled: !!organizationSlug && !!jobId,
  });

  const { data: jobData } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId as string, organizationSlug as string),
    enabled: !!organizationSlug && !!jobId,
  });

  const updateBidItemsMutation = useMutation({
    mutationFn: ({ bidId, updates }: { bidId: string; updates: UpdateBidItemsRequest["updates"] }) =>
      updateBidItems(jobId as string, bidId, organizationSlug as string, { updates }),
    onSuccess: () => {
      toast.success(`Bid items updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["job-bids", jobId] });
      setDialogOpen(false);
      setSelectedBid(null);
    },
    onError: (error: import("axios").AxiosError<{ message: string }>) => {
      toast.error(`Failed to update bid items. ${error.response?.data?.message || ""}`);
    },
  });

  const handleOpenBidDialog = (bid: Bid) => {
    setSelectedBid(bid);
    setDialogOpen(true);
  };

  const handleBulkUpdate = (updates: UpdateBidItemsRequest["updates"]) => {
    if (selectedBid) {
      updateBidItemsMutation.mutate({ bidId: selectedBid.id, updates });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching bids: {(error as import("axios").AxiosError<{ message: string }>).response?.data?.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Incoming Bids</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bids for Job #{jobId}</CardTitle>
          <CardDescription>
            Review and manage incoming bids from transporters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transporter</TableHead>
                <TableHead>Bid Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>{bid.transporter.name}</TableCell>
                    <TableCell>{new Date(bid.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[bid.status] || "bg-gray-100 text-gray-700"}`}>{bid.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenBidDialog(bid)}
                        disabled={bid.status !== "pending"}
                      >
                        Review Items
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No bids received yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedBid && (
        <ApproveBidDialog
          isOpen={dialogOpen}
          onClose={() => { setDialogOpen(false); setSelectedBid(null); }}
          bid={selectedBid}
          jobConsignments={jobData?.jobConsignments || []}
          onBulkUpdate={handleBulkUpdate}
          isSubmitting={updateBidItemsMutation.isPending}
        />
      )}
    </div>
  );
} 