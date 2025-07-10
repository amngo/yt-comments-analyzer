import { NextRequest, NextResponse } from 'next/server';
import { extractVideoId, getVideoInfo, getComments } from '@/lib/youtube';
import { analyzeComments } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get video info
    const videoInfo = await getVideoInfo(videoId);
    
    // Get comments
    const comments = await getComments(videoId, 200);
    
    if (comments.length === 0) {
      return NextResponse.json({ 
        error: 'No comments found for this video' 
      }, { status: 404 });
    }

    // Analyze comments
    const analysis = await analyzeComments(comments);

    return NextResponse.json({
      videoInfo,
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}