"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { listPartnerships } from "@/lib/apiHandlers/partnership.apiHandler";
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
import { PlusCircle } from "lucide-react";
import { partnership, Organization } from "@/db/schema";

type Partnership = typeof partnership.$inferSelect;
type PartnershipWithPartner = Partnership & { targetOrganization: Organization };

export default function ListPartnerships() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: partnerships, isLoading } = useQuery<PartnershipWithPartner[]>({
    queryKey: ["partnerships", organizationSlug],
    queryFn: () => listPartnerships(organizationSlug as string),
    enabled: !!organizationSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  const basePath = router.asPath;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Partnerships</CardTitle>
            <CardDescription>
              A list of all your partner organizations.
            </CardDescription>
          </div>
          <Link href={`${basePath}/create`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Partnership
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Partner Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerships && partnerships.length > 0 ? (
              partnerships.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.targetOrganization.name}</TableCell>
                  <TableCell>{p.targetOrganization.organizationType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No partnerships found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 