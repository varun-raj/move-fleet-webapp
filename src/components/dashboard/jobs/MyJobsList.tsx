"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { listTransporterJobs } from "@/lib/apiHandlers/job.apiHandler";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MyJobItem from "./MyJobItem";

export default function MyJobsList() {
  const router = useRouter();
  const organizationSlug = router.query.organizationSlug as string;

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["transporter-jobs", organizationSlug],
    queryFn: () => listTransporterJobs(organizationSlug),
    enabled: !!organizationSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs?.map((job) => (
        <MyJobItem key={job.id} job={job} />
      ))}

      {jobs?.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No jobs found. You haven&apos;t been assigned any jobs yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 