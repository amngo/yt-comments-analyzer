'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { AnalysisResult } from '@/lib/ai-analysis';
// import { VideoInfo, extractVideoId } from '@/lib/youtube';
import { isValidYouTubeUrl, getValidationMessage } from '@/lib/youtube-validator';
// import { VideoPreview } from './VideoPreview';

interface VideoAnalyzerProps {
  onAnalyze: (results: { analysis: AnalysisResult }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function VideoAnalyzer({ onAnalyze, loading, setLoading }: VideoAnalyzerProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [loadingPhase, setLoadingPhase] = useState('Extracting comments...');
//   const [videoPreview, setVideoPreview] = useState<VideoInfo | null>(null);
//   const [fetchingPreview, setFetchingPreview] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      setTimeRemaining(60);
      setLoadingPhase('Extracting comments...');

      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }

          // Update phase based on time remaining
          if (prev > 45) {
            setLoadingPhase('Extracting comments...');
          } else if (prev > 30) {
            setLoadingPhase('Analyzing sentiment...');
          } else if (prev > 15) {
            setLoadingPhase('Generating insights...');
          } else {
            setLoadingPhase('Finalizing results...');
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setUrlError('');
    // setVideoPreview(null);

    if (newUrl.trim()) {
      const validationMessage = getValidationMessage(newUrl);
      setUrlError(validationMessage);

    //   // If URL is valid, fetch video preview
    //   if (!validationMessage && isValidYouTubeUrl(newUrl)) {
    //     const videoId = extractVideoId(newUrl);
    //     if (videoId) {
    //       setFetchingPreview(true);
    //       try {
    //         const response = await fetch('/api/video-info', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({ videoId }),
    //         });

    //         if (response.ok) {
    //           const videoInfo = await response.json();
    //           setVideoPreview(videoInfo);
    //         }
    //       } catch (error) {
    //         console.error('Error fetching video preview:', error);
    //       } finally {
    //         setFetchingPreview(false);
    //       }
    //     }
    //   }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate YouTube URL before submitting
    if (!isValidYouTubeUrl(url)) {
      setUrlError(getValidationMessage(url));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video');
      }

      const data = await response.json();
      onAnalyze(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-slate-800 rounded-xl shadow-2xl p-8 mb-8 border border-slate-700"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label htmlFor="url" className="block text-sm font-medium text-slate-200 mb-2">
            YouTube Video URL
          </label>
          <motion.input
            type="url"
            id="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:border-transparent text-white placeholder-slate-400 transition-all ${
              urlError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-emerald-500'
            }`}
            required
          />
        </motion.div>

        {urlError && (
          <motion.div
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-300">{urlError}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* {videoPreview && !loading && (
          <VideoPreview videoInfo={videoPreview} />
        )}

        {fetchingPreview && (
          <motion.div
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-300">Loading video preview...</span>
            </div>
          </motion.div>
        )} */}

        <motion.button
          type="submit"
          disabled={loading || !url || !!urlError}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{loadingPhase}</span>
            </div>
          ) : (
            'Analyze Comments'
          )}
        </motion.button>
      </form>

      {loading && (
        <motion.div
          className="mt-6 bg-slate-700/50 rounded-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{loadingPhase}</p>
                  <p className="text-xs text-slate-400">
                    {timeRemaining > 0 ? `Estimated time: ${timeRemaining} seconds` : 'Almost done...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  className="text-2xl font-bold text-emerald-400"
                  key={timeRemaining}
                  initial={{ scale: 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {timeRemaining > 0 ? `${timeRemaining}s` : '✓'}
                </motion.div>
                <p className="text-xs text-slate-400">remaining</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className={`text-center py-1 rounded ${timeRemaining <= 60 && timeRemaining > 45 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                Extract
              </div>
              <div className={`text-center py-1 rounded ${timeRemaining <= 45 && timeRemaining > 30 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                Analyze
              </div>
              <div className={`text-center py-1 rounded ${timeRemaining <= 30 && timeRemaining > 15 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                Generate
              </div>
              <div className={`text-center py-1 rounded ${timeRemaining <= 15 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                Finalize
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
