import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { DataTable } from './components/DataTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { parseNetCDFFile } from './utils/netcdf';
import type { SatelliteData } from './types/satellite';

function App() {
  const [data, setData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parsedData = await parseNetCDFFile(file);
      setData(parsedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!data) return;

    const csvContent = Object.entries(data)
      .map(([key, value]) => {
        const valueStr = Array.isArray(value) 
          ? value.map(item => JSON.stringify(item)).join(';')
          : JSON.stringify(value);
        return `${key},${valueStr}`;
      })
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satellite_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="max-w-4xl mx-auto">
          <FileUploader onFileUpload={handleFileUpload} />
          {loading && <LoadingSpinner />}
          {data && <DataTable data={data} onDownload={downloadCSV} />}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;