import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import type { FileUploaderProps } from '../types/satellite';

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.nc') || file.name.endsWith('.nc4') || file.name.endsWith('.netcdf'))) {
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(event);
    } else {
      alert('Please upload a valid NetCDF file (.nc, .nc4, or .netcdf)');
    }
  }, [onFileUpload]);

  return (
    <div className="mb-8">
      <label 
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-blue-900/30 border-2 border-blue-400 border-dashed rounded-lg cursor-pointer hover:bg-blue-900/40"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-blue-400" />
          <p className="mb-2 text-sm text-gray-300">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">NetCDF files only (.nc, .nc4, .netcdf)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".nc,.nc4,.netcdf"
          onChange={onFileUpload}
        />
      </label>
      <div className="mt-2 flex items-center gap-2 text-xs text-blue-300">
        <AlertCircle className="w-4 h-4" />
        <span>Supports both NetCDF-3 (CDF) and NetCDF-4 (HDF5) formats</span>
      </div>
    </div>
  );
}