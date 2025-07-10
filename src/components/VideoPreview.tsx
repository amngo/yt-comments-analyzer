'use client';

import { motion } from 'framer-motion';
import { VideoInfo } from '@/lib/youtube';

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

export function VideoPreview({ videoInfo }: VideoPreviewProps) {
  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-32 h-20 object-cover rounded-lg"
          />
          {videoInfo.duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {videoInfo.duration}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-200 line-clamp-2 mb-1">
            {videoInfo.title}
          </h3>
          
          <p className="text-xs text-slate-400 mb-2">
            {videoInfo.channelTitle}
          </p>
          
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {formatNumber(videoInfo.viewCount)} views
            </span>
            
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              {formatNumber(videoInfo.likeCount)} likes
            </span>
            
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              {formatNumber(videoInfo.commentCount)} comments
            </span>
            
            <span>
              {formatDate(videoInfo.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}