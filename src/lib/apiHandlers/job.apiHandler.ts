import { Job, JobCreate } from "@/db/schema";
import API from "../utils/API";
import { CREATE_JOB_PATH, LIST_JOBS_PATH } from "@/config/routes";

export const listJobs = async (organizationSlug: string): Promise<Job[]> => {
  return API.get(LIST_JOBS_PATH(organizationSlug)) as Promise<Job[]>;
};

export const createJob = async (job: JobCreate, organizationSlug: string): Promise<Job> => {
  return API.post(CREATE_JOB_PATH(organizationSlug), job) as Promise<Job>;
};    