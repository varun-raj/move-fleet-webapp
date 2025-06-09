import { Job, JobCreate } from "@/db/schema";
import API from "../utils/API";
import { CREATE_JOB_PATH } from "@/config/routes";

export const createJob = async (job: JobCreate, organizationSlug: string): Promise<Job> => {
  return API.post(CREATE_JOB_PATH(organizationSlug), job) as Promise<Job>;
};    