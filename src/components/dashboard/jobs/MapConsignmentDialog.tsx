"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MapConsignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // TODO: Add props for bid line item and consignments
}

export default function MapConsignmentDialog({
  isOpen,
  onClose,
}: MapConsignmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map to Consignment</DialogTitle>
          <DialogDescription>
            Select a consignment to assign to the selected vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Consignment selection will go here */}
          <p>Consignment mapping UI will be here.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button>Map Consignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 