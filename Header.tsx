import React from 'react';
import { Satellite } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Satellite className="w-12 h-12 text-blue-400" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          TEMPO Sat Overpass Times
        </h1>
      </div>
      <p className="text-gray-300 max-w-2xl mx-auto">
        Upload your NetCDF file to analyze satellite overpass times and data parameters.
        View your data in a structured format and export to CSV.
      </p>
    </header>
  );
}