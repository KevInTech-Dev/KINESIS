export const COMPANY_STATUSES = [
  "ACTIVE",
  "REJECTED",
  "SUSPENDED",
] as const;

export type CompanyStatus = (typeof COMPANY_STATUSES)[number];
