import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface Comment {
  id: string;
  text: string;
  author: string;
  likeCount: number;
  publishedAt: string;
  replies?: Comment[];
}

export interface VideoInfo {
  title: string;
  description: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  publishedAt: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
}

export function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function getVideoInfo(videoId: string): Promise<VideoInfo> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [videoId],
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw new Error('Video not found');
    }

    // Get the highest quality thumbnail available
    const thumbnails = video.snippet?.thumbnails;
    const thumbnail = thumbnails?.maxres?.url || 
                     thumbnails?.high?.url || 
                     thumbnails?.medium?.url || 
                     thumbnails?.default?.url || '';

    // Parse duration from ISO 8601 format (PT4M13S) to readable format
    const duration = video.contentDetails?.duration || '';
    const parsedDuration = parseDuration(duration);

    return {
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
      publishedAt: video.snippet?.publishedAt || '',
      channelTitle: video.snippet?.channelTitle || '',
      thumbnail,
      duration: parsedDuration,
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

function parseDuration(duration: string): string {
  if (!duration) return '';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export async function getComments(videoId: string, maxResults: number = 100): Promise<Comment[]> {
  try {
    const comments: Comment[] = [];
    let nextPageToken: string | undefined;

    while (comments.length < maxResults) {
      const response = await youtube.commentThreads.list({
        part: ['snippet', 'replies'],
        videoId: videoId,
        maxResults: Math.min(100, maxResults - comments.length),
        order: 'relevance',
        pageToken: nextPageToken,
      });

      if (!response.data.items?.length) break;

      for (const item of response.data.items) {
        const comment = item.snippet?.topLevelComment?.snippet;
        if (comment) {
          const replies: Comment[] = [];
          
          if (item.replies?.comments) {
            for (const reply of item.replies.comments) {
              const replySnippet = reply.snippet;
              if (replySnippet) {
                replies.push({
                  id: reply.id || '',
                  text: replySnippet.textDisplay || '',
                  author: replySnippet.authorDisplayName || '',
                  likeCount: replySnippet.likeCount || 0,
                  publishedAt: replySnippet.publishedAt || '',
                });
              }
            }
          }

          comments.push({
            id: item.snippet?.topLevelComment?.id || '',
            text: comment.textDisplay || '',
            author: comment.authorDisplayName || '',
            likeCount: comment.likeCount || 0,
            publishedAt: comment.publishedAt || '',
            replies,
          });
        }
      }

      nextPageToken = response.data.nextPageToken || undefined;
      if (!nextPageToken) break;
    }

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}