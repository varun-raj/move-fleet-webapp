import { Job, JobCreate, JobConsignment } from "@/db/schema";
import API from "../utils/API";
import { CREATE_JOB_PATH } from "@/config/routes";
import axios from "axios";

type JobWithConsignments = Job & {
  jobConsignments: JobConsignment[];
  fromLocationName: string | null;
  toLocationName: string | null;
};

type JobListType = {
  job: Job;
  fromLocationName: string | null;
  toLocationName: string | null;
};

export const getJob = async (
  jobId: string,
  organizationSlug: string
): Promise<JobWithConsignments> => {
  const response = await axios.get(`/api/job/${jobId}`, {
    params: { organizationSlug },
  });
  return response.data;
};

export const listJobs = async (
  organizationSlug: string
): Promise<JobListType[]> => {
  const response = await axios.get(`/api/job/list`, {
    params: { organizationSlug },
  });
  return response.data;
};

export const createJob = async (
  job: JobCreate,
  organizationSlug: string
): Promise<Job> => {
  return API.post(CREATE_JOB_PATH(organizationSlug), job) as Promise<Job>;
};    