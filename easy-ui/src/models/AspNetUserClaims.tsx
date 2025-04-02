export interface AspNetUserClaims {
  id: number;
  userId: string;
  claimType: string | null;
  claimValue: string | null;
}
