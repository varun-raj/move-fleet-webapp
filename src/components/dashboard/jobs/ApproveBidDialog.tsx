"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { JobConsignment } from "@/db/schema";

interface ApproveBidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bid: { bidId: string; vehicleId: string } | null;
  jobConsignments: JobConsignment[];
  onApprove: (bidId: string, consignmentId: string) => void;
  isSubmitting: boolean;
}

export default function ApproveBidDialog({
  isOpen,
  onClose,
  bid,
  jobConsignments,
  onApprove,
  isSubmitting,
}: ApproveBidDialogProps) {
  const [selectedConsignment, setSelectedConsignment] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedConsignment(null);
    }
  }, [isOpen]);

  const handleApprove = () => {
    if (!bid || !selectedConsignment) return;
    onApprove(bid.bidId, selectedConsignment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Consignment</DialogTitle>
          <DialogDescription>
            Choose a consignment to assign to this vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedConsignment || ""}
            onValueChange={setSelectedConsignment}
            className="space-y-4"
          >
            {jobConsignments.map((consignment) => (
              <div key={consignment.id} className="flex items-center space-x-2">
                <RadioGroupItem value={consignment.id} id={consignment.id} />
                <Label htmlFor={consignment.id} className="flex flex-col">
                  <span className="font-medium">{consignment.containerIdentifier}</span>
                  <span className="text-sm text-muted-foreground">{consignment.containerType} Container</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={!selectedConsignment || isSubmitting}
          >
            {isSubmitting ? "Accepting..." : "Accept Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 