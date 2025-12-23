
export interface Incident {
  id: string;
  timestamp: string;
  vehicleDescription: string;
  actionDescription: string;
  licensePlate: string;
  confidence: number;
  thumbnailUrl?: string;
}

export interface AnalysisResponse {
  incidents: Incident[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
