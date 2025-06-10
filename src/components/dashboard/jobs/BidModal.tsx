"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FindJobListItem } from "@/lib/apiHandlers/job.apiHandler";
import { listVehicles } from "@/lib/apiHandlers/vehicle.apiHandler";
import { Vehicle } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  calculateVehicleCapacity,
  calculateRemainingConsignments,
  isBidValid,
} from "@/lib/utils/bidUtils";

interface BidModalProps {
  job: FindJobListItem | null;
  isOpen: boolean;
  onClose: () => void;
  organizationSlug: string;
}

export default function BidModal({
  job,
  isOpen,
  onClose,
  organizationSlug,
}: BidModalProps) {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery<
    Vehicle[]
  >({
    queryKey: ["vehicles", organizationSlug],
    queryFn: () => listVehicles(organizationSlug),
    enabled: !!organizationSlug && isOpen,
  });

  const availableVehicles = useMemo(() => {
    if (!job) return [];
    return vehicles.filter((vehicle) => {
      const is20ftMatch =
        job.twentyFtConsignments > 0 && vehicle.floorSize === "20ft";
      const is40ftMatch =
        job.fortyFtConsignments > 0 && vehicle.floorSize === "40ft";
      return (
        vehicle.status === "active" && (is20ftMatch || is40ftMatch)
      );
    });
  }, [vehicles, job]);

  const { remainingConsignments, bidIsValid } = useMemo(() => {
    if (!job) {
      return {
        remainingConsignments: { "20ft": 0, "40ft": 0 },
        bidIsValid: false,
      };
    }
    const selectedVehicleData = vehicles.filter((v) =>
      selectedVehicles.includes(v.id)
    );
    const capacity = calculateVehicleCapacity(selectedVehicleData);
    const remaining = calculateRemainingConsignments(job, capacity);
    const isValid = isBidValid(remaining);
    return { remainingConsignments: remaining, bidIsValid: isValid };
  }, [selectedVehicles, vehicles, job]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handlePlaceBid = () => {
    console.log(
      "Placing bid for job:",
      job?.id,
      "with vehicles:",
      selectedVehicles
    );
    // TODO: Implement actual bid placement logic
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            For job from {job.fromLocation.name} to {job.toLocation.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Select available vehicles</h4>
            <div className="space-y-2">
              {isLoadingVehicles ? (
                <p>Loading vehicles...</p>
              ) : availableVehicles.length > 0 ? (
                availableVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={vehicle.id}
                      onCheckedChange={() => handleVehicleSelect(vehicle.id)}
                      checked={selectedVehicles.includes(vehicle.id)}
                    />
                    <Label htmlFor={vehicle.id} className="w-full">
                      <div className="flex justify-between p-2 border rounded-md">
                        <span>{vehicle.registrationNumber}</span>
                        <span className="text-muted-foreground">
                          {vehicle.floorSize}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No matching vehicles available.
                </p>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg border bg-muted/30 text-sm">
            <h4 className="font-semibold mb-2">Summary</h4>
            {bidIsValid ? (
              <p className="text-green-600 font-medium">
                All consignments are covered by the selected vehicles.
              </p>
            ) : (
              <div>
                <p className="font-medium">Remaining consignments to be covered:</p>
                <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                  {remainingConsignments["40ft"] > 0 && (
                    <li>{remainingConsignments["40ft"]} x 40ft consignments</li>
                  )}
                  {remainingConsignments["20ft"] > 0 && (
                    <li>{remainingConsignments["20ft"]} x 20ft consignments</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePlaceBid} disabled={!bidIsValid}>
            Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 