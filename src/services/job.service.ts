import { job, Job, JobConsignment, jobConsignment } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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

  static async getBiddableJobs(organizationIds: string[]) {
    if (organizationIds.length === 0) {
      return [];
    }


    const jobs = await db.query.job.findMany({
      where: and(
        inArray(job.organizationId, organizationIds),
        eq(job.status, 'active')
      ),
      with: {
        fromLocation: true,
        toLocation: true,
        organization: true,
        jobConsignments: true,
      },
      columns: {
        id: true,
        dueDate: true,
        status: true,
        createdAt: true,
      }
    });

    return jobs.map(job => ({
      ...job,
      jobConsignments: undefined,
      consignmentCount: job.jobConsignments.length
    }));
  }
}