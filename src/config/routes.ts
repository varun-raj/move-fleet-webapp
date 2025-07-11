export const LIST_ORGANIZATIONS_PATH = "/api/organization/list";
export const CREATE_ORGANIZATION_PATH = "/api/organization/create";
export const GET_ROOT_DATA_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/root`;

// Jobs
export const CREATE_JOB_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/jobs/create`;
export const GET_JOB_PATH = (organizationSlug: string, jobId: string) => `/api/manage/${organizationSlug}/jobs/${jobId}`;
export const LIST_JOBS_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/jobs/list`;
export const FIND_JOBS_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/jobs/find-jobs`;

// Job Bids
export const GET_JOB_BIDS_PATH = (organizationSlug: string, jobId: string) => `/api/manage/${organizationSlug}/jobs/${jobId}/bids`;
export const UPDATE_JOB_BID_PATH = (organizationSlug: string, jobId: string, bidId: string) => `/api/manage/${organizationSlug}/jobs/${jobId}/bids/${bidId}`;

// Locations
export const CREATE_LOCATION_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/locations/create`;
export const LIST_LOCATIONS_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/locations/list`;
export const GET_LOCATION_PATH = (organizationSlug: string, locationId: string) => `/api/manage/${organizationSlug}/locations/${locationId}`;

// Partnerships
export const CREATE_PARTNERSHIP_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/partners/create`;
export const LIST_PARTNERSHIPS_PATH = (organizationSlug: string) => `/api/manage/${organizationSlug}/partners/list`;

export const HOME_PATH = "/";
export const AUTH_PATH = "/auth";
export const APP_DASHBOARD_PATH = "/dashboard";

export const CREATE_VEHICLE_PATH = (organizationSlug: string) =>
  `/api/manage/${organizationSlug}/vehicles/create`;
export const LIST_VEHICLES_PATH = (organizationSlug: string) =>
  `/api/manage/${organizationSlug}/vehicles/list`;

// Transporter Jobs
export const LIST_TRANSPORTER_JOBS_PATH = (organizationSlug: string) =>
  `/api/manage/${organizationSlug}/jobs/my-assigned-jobs`;