
import React from 'react';
import { Incident } from '../types';

interface AnalysisResultsProps {
  incidents: Incident[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ incidents }) => {
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
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Timestamp</p>
                    <p className="text-sm font-bold text-slate-700">{incident.timestamp}</p>
                  </div>
                </div>
                <div className="bg-orange-50 px-2 py-1 rounded text-[10px] font-bold text-orange-600 border border-orange-100">
                  CONFIDENCE: {Math.round(incident.confidence * 100)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Vehicle</p>
                    <p className="text-sm text-slate-700 font-semibold">{incident.vehicleDescription}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Violation</p>
                    <p className="text-sm text-slate-600 italic">"{incident.actionDescription}"</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs font-medium text-slate-400 mb-1">Extracted License Plate</p>
                <div className="bg-slate-900 text-white font-mono text-center py-2 rounded-md border-2 border-slate-700 shadow-inner">
                  <span className="text-xl tracking-widest font-bold">
                    {incident.licensePlate || 'NOT VISIBLE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;
