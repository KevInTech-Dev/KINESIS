export const VOYAGE_STATUSES = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EXPIREE",
  "ANNULEE",
] as const;

export type VoyageStatus = (typeof VOYAGE_STATUSES)[number];
