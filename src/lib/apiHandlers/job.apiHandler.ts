import { Job, JobCreate, JobConsignment, Location } from "@/db/schema";
import API from "../utils/API";
import { CREATE_JOB_PATH, FIND_JOBS_PATH, LIST_JOBS_PATH, GET_JOB_BIDS_PATH, UPDATE_JOB_BID_PATH } from "@/config/routes";
import axios from "axios";

type JobWithConsignments = Job & {
  jobConsignments: JobConsignment[];
  fromLocationName: string | null;
  toLocationName: string | null;
};

export type JobListType = {
  job: Job;
  fromLocationName: string | null;
  toLocationName: string | null;
};

export type FindJobListItem = Job & {
  fromLocation: Location;
  toLocation: Location;
  twentyFtConsignments: number;
  fortyFtConsignments: number;
  hasBid: boolean;
};

export type BidLineItem = {
  id: string;
  vehicle: {
    id: string;
    registrationNumber: string;
    floorSize: string;
  };
};

export type Bid = {
  id: string;
  status: string;
  createdAt: string;
  transporter: {
    name: string;
  };
  bidLineItems: BidLineItem[];
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
  return API.get(LIST_JOBS_PATH(organizationSlug)) as Promise<JobListType[]>;
};

export const findJobs = async (
  organizationSlug: string
): Promise<FindJobListItem[]> => {
  return API.get(FIND_JOBS_PATH(organizationSlug)) as Promise<FindJobListItem[]>;
};

export const createJob = async (
  job: JobCreate,
  organizationSlug: string
): Promise<Job> => {
  return API.post(CREATE_JOB_PATH(organizationSlug), job) as Promise<Job>;
};

export const getBidsForJob = async (
  jobId: string,
  organizationSlug: string
): Promise<Bid[]> => {
  return API.get(GET_JOB_BIDS_PATH(organizationSlug, jobId)) as Promise<Bid[]>;
};

export const updateBidStatus = async (
  jobId: string,
  bidId: string,
  organizationSlug: string,
  data: { status: "accepted" | "rejected"; consignmentId?: string }
): Promise<void> => {
  return API.patch(UPDATE_JOB_BID_PATH(organizationSlug, jobId, bidId), data) as Promise<void>;
};    