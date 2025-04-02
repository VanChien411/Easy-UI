export interface Categories {
  id: number;
  name: string;
  description: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  isActive: boolean;
}
