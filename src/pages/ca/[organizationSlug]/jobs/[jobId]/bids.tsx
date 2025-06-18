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
import API from "@/lib/utils/API";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type BidLineItem = {
  id: string;
  vehicle: {
    id: string;
    registrationNumber: string;
    floorSize: string;
  };
};

type Bid = {
  id: string;
  status: string;
  createdAt: string;
  transporter: {
    name: string;
  };
  bidLineItems: BidLineItem[];
};

const fetchBids = async (organizationSlug: string, jobId: string): Promise<Bid[]> => {
  return API.get(`/api/manage/${organizationSlug}/jobs/${jobId}/bids`) as Promise<Bid[]>;
};

export default function JobBidsPage() {
  const router = useRouter();
  const { organizationSlug, jobId } = router.query;
  const queryClient = useQueryClient();

  const { data: bids = [], isLoading, error } = useQuery<Bid[]>({
    queryKey: ["job-bids", jobId],
    queryFn: () => fetchBids(organizationSlug as string, jobId as string),
    enabled: !!organizationSlug && !!jobId,
  });

  const updateBidStatusMutation = useMutation({
    mutationFn: ({ bidId, status }: { bidId: string; status: "accepted" | "rejected" }) =>
      API.patch(`/api/manage/${organizationSlug}/jobs/${jobId}/bids/${bidId}`, { status }),
    onSuccess: (_, variables) => {
      toast.success(`Bid ${variables.status} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["job-bids", jobId] });
    },
    onError: (error: import("axios").AxiosError<{ message: string }>, variables) => {
      toast.error(`Failed to ${variables.status} bid. ${error.response?.data?.message || ""}`);
    },
  });

  const flattenedBids = React.useMemo(() => {
    return bids.flatMap((bid) =>
      bid.bidLineItems.map((item) => ({
        ...item,
        bidId: bid.id,
        bidStatus: bid.status,
        bidCreatedAt: bid.createdAt,
        transporterName: bid.transporter.name,
      }))
    );
  }, [bids]);

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
                <TableHead>Vehicle Registration</TableHead>
                <TableHead>Vehicle Floor Size</TableHead>
                <TableHead>Bid Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flattenedBids.length > 0 ? (
                flattenedBids.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.transporterName}</TableCell>
                    <TableCell>{item.vehicle.registrationNumber}</TableCell>
                    <TableCell>{item.vehicle.floorSize}</TableCell>
                    <TableCell>
                      {new Date(item.bidCreatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.bidStatus === 'pending' ? 'secondary' : item.bidStatus === 'accepted' ? 'default' : 'destructive'}>{item.bidStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBidStatusMutation.mutate({ bidId: item.bidId, status: "accepted" })}
                        disabled={item.bidStatus !== 'pending' || updateBidStatusMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateBidStatusMutation.mutate({ bidId: item.bidId, status: "rejected" })}
                        disabled={item.bidStatus !== 'pending' || updateBidStatusMutation.isPending}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No bids received yet.
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