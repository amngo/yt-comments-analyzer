'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/lib/ai-analysis';
import { VideoInfo } from '@/lib/youtube';
import { Toast } from './Toast';

interface ResultsDisplayProps {
  results: {
    videoInfo: VideoInfo;
    analysis: AnalysisResult;
  };
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { videoInfo, analysis } = results;

  const exportResults = () => {
    const exportData = {
      videoInfo,
      analysis,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-analysis-${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, message: string = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(message);
      setToastVisible(true);
    }).catch(() => {
      setToastMessage('Failed to copy to clipboard');
      setToastVisible(true);
    });
  };

  const showToast = () => {
    setToastVisible(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Questions' },
    { id: 'painpoints', label: 'Pain Points' },
    { id: 'emotions', label: 'Emotions' },
    { id: 'topics', label: 'Learning Topics' },
    { id: 'ideas', label: 'Video Ideas' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="border-b border-slate-700 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {videoInfo.title}
            </motion.h2>
            <motion.p
              className="text-slate-300 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              by {videoInfo.channelTitle}
            </motion.p>
          </div>
          <motion.button
            onClick={exportResults}
            className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"

            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Export Results
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="border-b border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <nav className="flex overflow-x-auto">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap relative ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}

              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={containerVariants}
              >
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg"
                  variants={itemVariants}

                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-emerald-100 mb-2">Total Comments</h3>
                  <motion.p
                    className="text-3xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {analysis.overview.totalComments}
                  </motion.p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg"
                  variants={itemVariants}

                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-blue-100 mb-2">Engagement Level</h3>
                  <motion.p
                    className="text-3xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    {analysis.overview.averageEngagement}%
                  </motion.p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg"
                  variants={itemVariants}

                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium text-purple-100 mb-2">Overall Sentiment</h3>
                  <motion.p
                    className="text-3xl font-bold text-white capitalize"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    {analysis.overview.topSentiment}
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.h3
                  className="text-lg font-semibold text-white mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Top Video Ideas
                </motion.h3>
                <motion.div
                  className="space-y-3"
                  variants={containerVariants}
                >
                  {analysis.videoIdeas.slice(0, 5).map((idea, index) => (
                    <motion.div
                      key={index}
                      className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm"
                      variants={itemVariants}

                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-lg">{idea.title}</h4>
                          <p className="text-sm text-slate-300 mt-2">{idea.description}</p>
                          <span className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full mt-3">
                            {idea.category}
                          </span>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm text-slate-400">Interest Level</div>
                          <motion.div
                            className="text-2xl font-bold text-emerald-400"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                          >
                            {idea.estimatedInterest}/10
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Most Asked Questions</h3>
            {analysis.frequentQuestions.map((question, index) => (
              <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white text-lg">{question.question}</h4>
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-3 py-1 rounded-full">
                    {question.count} times
                  </span>
                </div>
                <div className="space-y-3">
                  {question.examples.map((example, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-sm text-slate-300">&ldquo;{example}&rdquo;</p>
                      <button
                        onClick={() => copyToClipboard(example, 'Comment copied!')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 mt-2"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'painpoints' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Common Pain Points</h3>
            {analysis.painPoints.map((pain, index) => (
              <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white text-lg">{pain.issue}</h4>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    pain.severity === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                    pain.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                    'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}>
                    {pain.severity} severity
                  </span>
                </div>
                <div className="space-y-3">
                  {pain.examples.map((example, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-sm text-slate-300">&ldquo;{example}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'emotions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Emotional Sentiment</h3>
            {analysis.emotions.map((emotion, index) => {
              const getEmotionColor = (emotionType: string) => {
                switch(emotionType.toLowerCase()) {
                  case 'excited': return 'from-green-500 to-green-600';
                  case 'frustrated': return 'from-red-500 to-red-600';
                  case 'confused': return 'from-yellow-500 to-yellow-600';
                  case 'satisfied': return 'from-blue-500 to-blue-600';
                  default: return 'from-purple-500 to-purple-600';
                }
              };
              return (
                <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-white text-lg capitalize">{emotion.emotion}</h4>
                    <span className="text-emerald-400 font-bold text-xl">{emotion.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 mb-4">
                    <motion.div
                      className={`bg-gradient-to-r ${getEmotionColor(emotion.emotion)} h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="space-y-3">
                    {emotion.examples.map((example, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <p className="text-sm text-slate-300">&ldquo;{example}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Learning Topics</h3>
            {analysis.learningTopics.map((topic, index) => (
              <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white text-lg">{topic.topic}</h4>
                  <span className="text-emerald-400 font-bold text-xl">Demand: {topic.demand}/10</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(topic.demand / 10) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="space-y-3">
                  {topic.examples.map((example, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-sm text-slate-300">&ldquo;{example}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Video Ideas</h3>
            {analysis.videoIdeas.map((idea, index) => {
              const getCategoryColor = (category: string) => {
                switch(category) {
                  case 'FAQ': return 'from-blue-500 to-blue-600';
                  case 'Tutorial': return 'from-green-500 to-green-600';
                  case 'Deep Dive': return 'from-purple-500 to-purple-600';
                  case 'Problem Solving': return 'from-orange-500 to-orange-600';
                  default: return 'from-gray-500 to-gray-600';
                }
              };
              return (
                <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-lg">{idea.title}</h4>
                      <p className="text-sm text-slate-300 mt-2">{idea.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-slate-400">Interest</div>
                      <div className="text-2xl font-bold text-emerald-400">{idea.estimatedInterest}/10</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(idea.estimatedInterest / 10) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block bg-gradient-to-r ${getCategoryColor(idea.category)} text-white text-xs px-3 py-1 rounded-full`}>
                      {idea.category}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${idea.title}\n\n${idea.description}`, 'Video idea copied!')}
                      className="text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Copy Idea
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Toast 
        message={toastMessage}
        isVisible={toastVisible}
        onClose={showToast}
      />
    </motion.div>
  );
}
