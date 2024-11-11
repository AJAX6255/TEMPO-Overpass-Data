import { NetCDFReader } from 'netcdfjs';
import type { SatelliteData } from '../types/satellite';

const isNetCDFFormat = (buffer: ArrayBuffer): { isValid: boolean; format?: string } => {
  try {
    const header = new Uint8Array(buffer.slice(0, 8));
    
    // NetCDF-3 Classic format
    if (header[0] === 67 && header[1] === 68 && header[2] === 70) { // 'CDF'
      return { isValid: true, format: 'NetCDF-3' };
    }
    
    // NetCDF-4/HDF5 format
    if (header[0] === 0x89 && 
        header[1] === 0x48 && // H
        header[2] === 0x44 && // D
        header[3] === 0x46) { // F
      return { isValid: true, format: 'NetCDF-4' };
    }

    // Try to detect 64-bit offset format
    if (header[0] === 67 && header[1] === 68 && header[2] === 70 && header[3] === 2) {
      return { isValid: true, format: 'NetCDF-3 64-bit offset' };
    }

    return { isValid: false };
  } catch (error) {
    console.error('Error checking NetCDF format:', error);
    return { isValid: false };
  }
};

const readVariableData = (reader: NetCDFReader, name: string): any[] => {
  try {
    const variable = reader.variables.find(v => v.name === name);
    if (!variable) {
      console.warn(`Variable ${name} not found`);
      return [];
    }

    const data = reader.getDataVariable(name);
    if (!data || !Array.isArray(data)) {
      console.warn(`Invalid data for variable ${name}`);
      return [];
    }

    return data;
  } catch (error) {
    console.error(`Error reading variable ${name}:`, error);
    return [];
  }
};

export const parseNetCDFFile = async (file: File): Promise<SatelliteData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('The uploaded file is empty');
    }

    const formatCheck = isNetCDFFormat(arrayBuffer);
    if (!formatCheck.isValid) {
      throw new Error(
        'Invalid NetCDF format. Please ensure you are uploading a valid NetCDF file ' +
        '(.nc, .nc4, or .netcdf) in either NetCDF-3 or NetCDF-4 format.'
      );
    }

    console.log(`Detected format: ${formatCheck.format}`);

    let reader: NetCDFReader;
    try {
      reader = new NetCDFReader(arrayBuffer);
    } catch (error) {
      console.error('NetCDF reader error:', error);
      throw new Error(
        'Failed to read the NetCDF file. The file might be corrupted or in an ' +
        'unsupported format. Please ensure you are using a valid NetCDF file.'
      );
    }

    // Log available variables for debugging
    const variables = reader.variables.map(v => v.name);
    console.log('Available variables:', variables);

    // Read all required variables
    const data: SatelliteData = {
      locations: readVariableData(reader, 'locations'),
      satelliteOverpasses: readVariableData(reader, 'satelliteOverpasses'),
      sampleTimes: readVariableData(reader, 'sampleTimes'),
      satelliteData: readVariableData(reader, 'satelliteData'),
      parameters: readVariableData(reader, 'parameters')
    };

    // Validate the data structure
    const emptyVariables = Object.entries(data)
      .filter(([_, value]) => !value || value.length === 0)
      .map(([key]) => key);

    if (emptyVariables.length === Object.keys(data).length) {
      throw new Error(
        'No valid data found in the NetCDF file. The file appears to be empty or ' +
        'does not contain the required variables. Expected variables: ' +
        Object.keys(data).join(', ')
      );
    }

    if (emptyVariables.length > 0) {
      console.warn('Missing or empty variables:', emptyVariables);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while parsing the NetCDF file');
  }
};