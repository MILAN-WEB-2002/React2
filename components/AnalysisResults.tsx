
import React from 'react';
import { Incident } from '../types';

interface AnalysisResultsProps {
  incidents: Incident[];
  onSeekTo?: (seconds: number) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ incidents, onSeekTo }) => {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No Incidents Detected</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">The video appears to be clean. No two-wheeler waste disposal was identified.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Detected Violations ({incidents.length})</h3>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Attention Required</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {incidents.map((incident, idx) => (
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-all flex flex-col">
            {/* Thumbnail Image */}
            <div 
              className="aspect-video bg-slate-200 relative overflow-hidden group cursor-pointer"
              onClick={() => onSeekTo?.(parseFloat(incident.timestamp))}
            >
              {incident.thumbnailUrl ? (
                <img 
                  src={incident.thumbnailUrl} 
                  alt={`Incident at ${incident.timestamp}s`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 p-2 rounded-full text-indigo-600 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono">
                {parseFloat(incident.timestamp).toFixed(1)}s
              </div>
            </div>

            <div className="p-5 space-y-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Vehicle</p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{incident.vehicleDescription}</p>
                  </div>
                </div>
                <div className="bg-orange-50 px-2 py-1 rounded text-[10px] font-bold text-orange-600 border border-orange-100 shrink-0">
                  {Math.round(incident.confidence * 100)}% MATCH
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-slate-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Violation Detail</p>
                    <p className="text-sm text-slate-600 leading-tight">"{incident.actionDescription}"</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 mt-auto space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1">Plate Number</p>
                  <div className="bg-slate-900 text-white font-mono text-center py-2 rounded-md border-2 border-slate-700 shadow-inner">
                    <span className="text-lg tracking-widest font-bold">
                      {incident.licensePlate || 'NOT VISIBLE'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onSeekTo?.(parseFloat(incident.timestamp))}
                  className="w-full py-2 flex items-center justify-center space-x-2 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>REVIEW MOMENT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;
