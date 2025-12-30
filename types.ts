export interface RawCompanyData {
  id: string;
  name: string;
  batch: string;
  rawDescription: string;
  website: string;
}

export interface AiAnalysis {
  isAiNative: boolean;
  category: string; // e.g., "Infrastructure", "Healthcare", "Fintech"
  subCategory: string; // e.g., "Vector DB", "Drug Discovery"
  summary: string;
  tags: string[];
}

export interface Company extends RawCompanyData {
  analysis?: AiAnalysis;
  status: 'new' | 'analyzed' | 'pending';
}

export interface DashboardStats {
  totalCompanies: number;
  aiNativeCount: number;
  categoryDistribution: { name: string; value: number }[];
  batchTrends: { name: string; count: number }[];
}
