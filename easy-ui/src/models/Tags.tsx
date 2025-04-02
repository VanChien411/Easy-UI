export interface Tags {
  id: number;
  name: string;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  isActive: boolean;
}
