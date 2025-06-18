"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TransporterJob } from "@/lib/apiHandlers/job.apiHandler";

interface MyJobItemProps {
  job: TransporterJob;
}

export default function MyJobItem({ job }: MyJobItemProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Job #{job.id.slice(0, 8)}</CardTitle>
            <CardDescription>
              {job.fromLocationName} → {job.toLocationName}
            </CardDescription>
          </div>
          <Badge
            variant={
              job.status === "active"
                ? "default"
                : job.status === "closed"
                  ? "secondary"
                  : "destructive"
            }
          >
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <p>{job.dueDate ? format(new Date(job.dueDate), "PPP") : "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accepted At</p>
              <p>
                {job.acceptedAt
                  ? format(new Date(job.acceptedAt), "PPP")
                  : "Not accepted yet"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Consignments
            </p>
            <div className="grid gap-2">
              {(job.jobConsignments || []).map((consignment) => (
                <div
                  key={consignment.id}
                  className="flex justify-between items-center p-2 bg-muted rounded-md"
                >
                  <span>{consignment.containerIdentifier}</span>
                  <Badge variant="outline">{consignment.containerType}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 