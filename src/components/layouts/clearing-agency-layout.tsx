import Link from "next/link";
import {
  Bell,
  Home,
  Package2,
  Users,
  Building,
  Truck,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { useCallback, useEffect, useState } from "react";
import { RootData } from "@/zod/root.zod";
import { getRootData } from "@/lib/apiHandlers/organization.apiHandler";

type isActiveProps = {
  pathname: string;
  asPath: string;
  query: ParsedUrlQuery;
}
interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: (props: isActiveProps) => boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/ca/[organizationSlug]/dashboard",
    icon: Home,
    isActive: ({ pathname, }) => {
      return pathname === "/ca/dashboard";
    }
  },
  {
    label: "Jobs",
    href: "/ca/[organizationSlug]/jobs",
    icon: Truck,
    isActive: ({ pathname }) => {
      return pathname === "/ca/jobs";
    }
  },
  {
    label: "Locations",
    href: "/ca/[organizationSlug]/locations",
    icon: Building,
    isActive: ({ pathname }) => {
      return pathname === "/ca/locations";
    }
  },
  {
    label: "Transport Partners",
    href: "/ca/[organizationSlug]/transporters",
    icon: Users,
    isActive: ({ pathname }) => {
      return pathname === "/ca/transporters";
    }
  },
  {
    label: "Settings",
    href: "/ca/[organizationSlug]/settings",
    icon: Settings,
    isActive: ({ pathname }) => {
      return pathname === "/ca/settings";
    }
  },
];

export function ClearingAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { pathname, query, asPath } = router;
  const [rootData, setRootData] = useState<RootData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRootData = useCallback(async () => {
    setIsLoading(true);
    return getRootData(query.organizationSlug as string).then((data) => {
      setRootData(data);
      setIsLoading(false);
    }).catch((error) => {
      setError(error.message);
      setIsLoading(false);
    });
  }, [query.organizationSlug]);

  const pathMapper = useCallback((path: string) => {
    return path.replace("[organizationSlug]", query.organizationSlug as string);
  }, [query.organizationSlug]);

  useEffect(() => {
    if (query.organizationSlug) {
      fetchRootData();
    }
  }, [query.organizationSlug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!rootData) {
    return <div>No root data</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">Move Fleet</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={pathMapper(item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      item.isActive({ pathname: pathname, query: query, asPath: asPath }) && "bg-primary text-primary-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4">
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
} 