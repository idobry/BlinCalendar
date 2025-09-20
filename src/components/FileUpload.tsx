'use client';

import { TradeRecord } from '@/lib/types';
import { useState } from 'react';

interface FileUploadProps {
  onDataLoaded: (data: TradeRecord[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text) as TradeRecord[];
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('JSON must contain an array of trade records');
      }
      
      // Basic validation of trade record structure
      for (const record of data.slice(0, 5)) { // Check first 5 records
        if (!record.date || !record.action || typeof record.amount_usd !== 'number') {
          throw new Error('Invalid trade record structure. Each record must have date, action, and amount_usd fields.');
        }
      }
      
      onDataLoaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your trading data here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse for a JSON file
            </p>
          </div>
          
          <label className="inline-block">
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="sr-only"
            />
            <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors">
              Choose File
            </span>
          </label>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium">Expected JSON format:</p>
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
{`[
  {
    "date": "2025-09-12",
    "symbol": "AAPL",
    "action": "buy",
    "shares": 10,
    "amount_usd": -1000.00
  }
]`}
        </pre>
      </div>
    </div>
  );
}