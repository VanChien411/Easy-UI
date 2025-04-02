export interface Comments {
  id: number;
  componentId: number;
  userId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  isActive: boolean;
}
