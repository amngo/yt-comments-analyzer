'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoAnalyzer } from '@/components/VideoAnalyzer';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { AnalysisResult } from '@/lib/ai-analysis';
import { VideoInfo } from '@/lib/youtube';

export default function Home() {
  const [results, setResults] = useState<{ videoInfo: VideoInfo; analysis: AnalysisResult } | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            YouTube Comment Analyzer
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Turn your YouTube comments into actionable content ideas. Get insights on what your audience really wants.
          </motion.p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <VideoAnalyzer 
            onAnalyze={setResults} 
            loading={loading}
            setLoading={setLoading}
          />
        </motion.div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsDisplay results={results} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
