"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Bid } from "@/lib/apiHandlers/job.apiHandler";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApproveBidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bid: Bid | null;
  jobConsignments: Array<{
    id: string;
    containerIdentifier: string;
    containerType: string;
    status: string;
  }>;
  onBulkUpdate: (updates: Array<{ bidLineItemId: string; consignmentId: string; status: "accepted" | "rejected" }>) => void;
  isSubmitting: boolean;
}

export default function ApproveBidDialog({
  isOpen,
  onClose,
  bid,
  jobConsignments,
  onBulkUpdate,
  isSubmitting,
}: ApproveBidDialogProps) {
  // Track status for each bid item
  const [itemStatuses, setItemStatuses] = React.useState<Record<string, "accepted" | "rejected" | "pending">>({});
  // Track selected consignment for each bid item
  const [selectedConsignments, setSelectedConsignments] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen && bid) {
      // Reset statuses when dialog opens
      const initialStatuses: Record<string, "pending"> = {};
      const initialConsignments: Record<string, string> = {};
      bid.bidLineItems.forEach((item) => {
        initialStatuses[item.id] = "pending";
        // Pre-select the current consignment if it exists
        if (item.jobConsignment) {
          initialConsignments[item.id] = item.jobConsignment.id;
        }
      });
      setItemStatuses(initialStatuses);
      setSelectedConsignments(initialConsignments);
    }
  }, [bid, isOpen]);

  const handleStatusChange = (bidLineItemId: string, status: "accepted" | "rejected") => {
    setItemStatuses((prev) => ({
      ...prev,
      [bidLineItemId]: status,
    }));

    // Reset consignment selection if rejected
    if (status === "rejected") {
      setSelectedConsignments((prev) => {
        const newState = { ...prev };
        delete newState[bidLineItemId];
        return newState;
      });
    }
  };

  const handleConsignmentChange = (bidLineItemId: string, consignmentId: string) => {
    // Check if this consignment is already assigned to another vehicle
    const isAlreadyAssigned = Object.entries(selectedConsignments).some(
      ([itemId, selectedId]) => itemId !== bidLineItemId && selectedId === consignmentId
    );

    if (isAlreadyAssigned) {
      toast.error("This consignment is already assigned to another vehicle");
      return;
    }

    setSelectedConsignments((prev) => ({
      ...prev,
      [bidLineItemId]: consignmentId,
    }));
  };

  const handleSubmit = () => {
    // Check for duplicate consignment assignments
    const assignedConsignments = new Set<string>();
    const hasDuplicates = Object.values(selectedConsignments).some(consignmentId => {
      if (assignedConsignments.has(consignmentId)) {
        return true;
      }
      assignedConsignments.add(consignmentId);
      return false;
    });

    if (hasDuplicates) {
      toast.error("Each consignment can only be assigned to one vehicle");
      return;
    }

    // Get all items that have been marked as accepted or rejected
    const pendingUpdates = bid?.bidLineItems
      .filter(item => itemStatuses[item.id] === "accepted" || itemStatuses[item.id] === "rejected")
      .map(item => ({
        bidLineItemId: item.id,
        consignmentId: selectedConsignments[item.id] || item.jobConsignment.id,
        status: itemStatuses[item.id] as "accepted" | "rejected",
      })) || [];

    if (pendingUpdates.length === 0) {
      toast.error("Please select at least one item to update");
      return;
    }

    onBulkUpdate(pendingUpdates);
  };

  // Filter out already assigned consignments from the dropdown
  const getAvailableConsignments = (currentItemId: string) => {
    return jobConsignments.filter(consignment => {
      // Show consignments that are in bidding status
      if (consignment.status !== "bidding") return false;

      // Show the currently selected consignment for this item
      if (selectedConsignments[currentItemId] === consignment.id) return true;

      // Hide consignments that are selected for other items
      return !Object.entries(selectedConsignments).some(
        ([itemId, selectedId]) => itemId !== currentItemId && selectedId === consignment.id
      );
    });
  };

  if (!bid) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Bid Items</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {bid.bidLineItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border rounded p-3">
              <div className="flex-1">
                <div className="font-medium">Vehicle: {item.vehicle.registrationNumber}</div>
                <div className="text-sm text-muted-foreground">Floor Size: {item.vehicle.floorSize}</div>
                {itemStatuses[item.id] !== "rejected" && (
                  <div className="mt-2">
                    <Select
                      value={selectedConsignments[item.id] || item.jobConsignment?.id}
                      onValueChange={(value) => handleConsignmentChange(item.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select consignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableConsignments(item.id).map((consignment) => (
                          <SelectItem key={consignment.id} value={consignment.id}>
                            {consignment.containerIdentifier} ({consignment.containerType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={itemStatuses[item.id] === "accepted" ? "default" : "outline"}
                  onClick={() => handleStatusChange(item.id, "accepted")}
                  disabled={isSubmitting}
                >
                  Accept
                </Button>
                <Button
                  variant={itemStatuses[item.id] === "rejected" ? "destructive" : "outline"}
                  onClick={() => handleStatusChange(item.id, "rejected")}
                  disabled={isSubmitting}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !Object.values(itemStatuses).some(s => s === "accepted" || s === "rejected")}
          >
            Update Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 