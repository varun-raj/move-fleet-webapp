import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { Toaster } from "@/components/ui/sonner"
import { useMemo } from "react";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { ClearingAgencyLayout } from "@/components/layouts/ClearingAgencyLayout";
import { TransporterLayout } from "@/components/layouts/TransporterLayout";
import PrivateLayout from "@/components/layouts/private-layout";


interface IAppProps extends AppProps {
  Component: NextPage & {
    getLayout: React.FC<{ children: React.ReactNode }>;
  };
}

export default function App({ Component, pageProps }: IAppProps) {
  const router = useRouter();
  const { pathname } = router;

  const Layout = useMemo(() => {
    if (pathname === "/") {
      return PrivateLayout;
    }
    if (pathname.startsWith("/auth/")) {
      return AuthLayout;
    }
    if (pathname.startsWith("/ca/")) {
      return ClearingAgencyLayout;
    }

    if (pathname.startsWith("/t/")) {
      return TransporterLayout;
    }

    return AuthLayout;
  }, [pathname]);

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </>
  );
}
