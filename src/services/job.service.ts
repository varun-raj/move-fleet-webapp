import { job, Job, JobConsignment, jobConsignment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export class JobService {
  static async getJobById(jobId: string): Promise<Job> {
    const jobData = await db.select().from(job).where(eq(job.id, jobId));
    return jobData[0];
  }

  static async getJobConsignments(jobId: string): Promise<JobConsignment[]> {
    const jobConsignments = await db.select().from(jobConsignment).where(eq(jobConsignment.jobId, jobId));
    return jobConsignments;
  }
}