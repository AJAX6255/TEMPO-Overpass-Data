export interface SatelliteData {
  locations: any[];
  satelliteOverpasses: any[];
  sampleTimes: any[];
  satelliteData: any[];
  parameters: any[];
}

export interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export interface DataTableProps {
  data: SatelliteData;
  onDownload: () => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}