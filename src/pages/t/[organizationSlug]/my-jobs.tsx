import MyJobsList from "@/components/dashboard/jobs/MyJobsList";

export default function MyJobsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Jobs</h1>
      <MyJobsList />
    </div>
  );
} 