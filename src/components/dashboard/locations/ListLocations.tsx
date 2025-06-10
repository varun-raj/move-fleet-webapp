"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { listLocations } from "@/lib/apiHandlers/location.apiHandler";
import { Location } from "@/db/schema";
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

export default function ListLocations() {
  const router = useRouter();
  const { organizationSlug } = router.query;

  const { data: locations, isLoading } = useQuery<Location[]>({
    queryKey: ["locations", organizationSlug],
    queryFn: () => listLocations(organizationSlug as string),
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
            <CardTitle>Locations</CardTitle>
            <CardDescription>
              A list of all locations in your organization.
            </CardDescription>
          </div>
          <Link href={`${basePath}/create`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Privacy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations && locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.locationType}</TableCell>
                  <TableCell>{location.privacy ? "Public" : "Private"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
