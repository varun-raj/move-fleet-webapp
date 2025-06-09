import { checkOrg } from "@/lib/middleware/checkOrg.middleware";

export default function Dashboard() {
  return (
    <div>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to your Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start managing your jobs and yards.
          </p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = checkOrg();