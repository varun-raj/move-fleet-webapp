import { job, Job, JobConsignment, jobConsignment, jobBid } from "@/db/schema";
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

  static async getBiddableJobs(partnerIds: string[], transporterId: string) {
    if (partnerIds.length === 0) {
      return [];
    }


    const jobs = await db.query.job.findMany({
      where: and(
        inArray(job.organizationId, partnerIds),
        eq(job.status, 'active')
      ),
      with: {
        fromLocation: true,
        toLocation: true,
        organization: true,
        jobConsignments: true,
        bids: {
          where: (jobBid, { eq }) => eq(jobBid.transporterId, transporterId),
          columns: {
            id: true,
          }
        }
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
      bids: undefined,
      hasBid: job.bids.length > 0,
      twentyFtConsignments: job.jobConsignments.filter(consignment => consignment.containerType === '20ft').length,
      fortyFtConsignments: job.jobConsignments.filter(consignment => consignment.containerType === '40ft').length,
    }));
  }

  static async getBidsForJob(jobId: string) {
    const bids = await db.query.jobBid.findMany({
      where: eq(jobBid.jobId, jobId),
      with: {
        transporter: {
          columns: {
            name: true,
          },
        },
        bidLineItems: {
          with: {
            vehicle: {
              columns: {
                id: true,
                registrationNumber: true,
                floorSize: true,
              },
            },
          },
        },
      },
    });
    return bids;
  }
}