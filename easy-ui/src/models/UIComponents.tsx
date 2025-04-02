export interface UIComponents {
  id: number;
  name: string;
  description: string | null;
  code: string;
  previewUrl: string | null;
  type: string | null;
  framework: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  isActive: boolean;
}
