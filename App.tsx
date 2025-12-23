
import React, { useState, useEffect } from 'react';
import VideoUploader from './components/VideoUploader';
import AnalysisResults from './components/AnalysisResults';
import { analyzeVideoFrames } from './services/geminiService';
import { extractFrames } from './utils/videoUtils';
import { Incident, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    setError(null);
    setIncidents([]);
    setStatus(AnalysisStatus.IDLE);
  };

  const startAnalysis = async () => {
    if (!videoFile) return;

    try {
      setStatus(AnalysisStatus.PROCESSING);
      setProgress('Extracting key frames from video...');
      
      // Sample video frames (1 every 1 second, up to 15 frames)
      const frames = await extractFrames(videoFile, 1.5, 12);
      
      if (frames.length === 0) {
        throw new Error("Could not extract frames from the video.");
      }

      setProgress('AI is scanning for two-wheelers and waste disposal...');
      const result = await analyzeVideoFrames(frames);
      
      setIncidents(result.incidents);
      setStatus(AnalysisStatus.SUCCESS);
      setProgress('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setStatus(AnalysisStatus.ERROR);
      setProgress('');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              EcoWatch AI
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-500">
            <span>Surveillance System</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-indigo-600">Active Monitor</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload and Preview */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Input Data</h2>
              <VideoUploader 
                onFileSelect={handleVideoSelect} 
                disabled={status === AnalysisStatus.PROCESSING} 
              />
              
              {videoFile && (
                <div className="mt-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">Selected File</p>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-700 truncate">{videoFile.name}</p>
                        <p className="text-xs text-slate-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>

                  {status === AnalysisStatus.IDLE && (
                    <button 
                      onClick={startAnalysis}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
                    >
                      Process Video
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Analysis Status */}
            {status === AnalysisStatus.PROCESSING && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-center">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Analyzing...</h3>
                  <p className="text-slate-500 text-sm mt-1">{progress}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-3">
                <div className="flex items-center space-x-2 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">Error Occurred</span>
                </div>
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setStatus(AnalysisStatus.IDLE)}
                  className="text-xs font-bold text-red-800 underline uppercase tracking-widest"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Results Display */}
          <div className="lg:col-span-8">
            {status === AnalysisStatus.SUCCESS ? (
              <AnalysisResults incidents={incidents} />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 p-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-600">No Analysis results yet</h3>
                <p className="text-center max-w-sm mt-2 text-slate-400">
                  Upload a video and click "Process" to start the automated two-wheeler waste disposal detection system.
                </p>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                  <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="text-indigo-500 font-bold mb-1">1</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Video Frame Extraction</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="text-indigo-500 font-bold mb-1">2</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Two-Wheeler Detection</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="text-indigo-500 font-bold mb-1">3</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Waste Action Scan</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <div className="text-indigo-500 font-bold mb-1">4</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight">Plate OCR Retrieval</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            Powered by Gemini AI Multimodal Analysis &bull; Private & Secure Surveillance Processing
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
