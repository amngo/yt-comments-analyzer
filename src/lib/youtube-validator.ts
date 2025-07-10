export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Check for YouTube domains
    const validDomains = [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be'
    ];
    
    if (!validDomains.includes(urlObj.hostname)) {
      return false;
    }

    // For youtu.be links, the video ID is in the pathname
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // Remove leading slash
      return isValidVideoId(videoId);
    }

    // For youtube.com links, check for video parameter or embed path
    if (urlObj.hostname.includes('youtube.com')) {
      // Check for /watch?v= format
      const videoParam = urlObj.searchParams.get('v');
      if (videoParam) {
        return isValidVideoId(videoParam);
      }

      // Check for /embed/ format
      const embedMatch = urlObj.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})$/);
      if (embedMatch) {
        return isValidVideoId(embedMatch[1]);
      }

      // Check for /v/ format
      const vMatch = urlObj.pathname.match(/^\/v\/([a-zA-Z0-9_-]{11})$/);
      if (vMatch) {
        return isValidVideoId(vMatch[1]);
      }

      return false;
    }

    return false;
  } catch {
    return false;
  }
}

function isValidVideoId(videoId: string): boolean {
  // YouTube video IDs are 11 characters long and contain alphanumeric characters, hyphens, and underscores
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(videoId);
}

export function getYouTubeVideoId(url: string): string | null {
  if (!isValidYouTubeUrl(url)) {
    return null;
  }

  try {
    const urlObj = new URL(url);

    // For youtu.be links
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    // For youtube.com links
    if (urlObj.hostname.includes('youtube.com')) {
      // Check for /watch?v= format
      const videoParam = urlObj.searchParams.get('v');
      if (videoParam) {
        return videoParam;
      }

      // Check for /embed/ format
      const embedMatch = urlObj.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})$/);
      if (embedMatch) {
        return embedMatch[1];
      }

      // Check for /v/ format
      const vMatch = urlObj.pathname.match(/^\/v\/([a-zA-Z0-9_-]{11})$/);
      if (vMatch) {
        return vMatch[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function getValidationMessage(url: string): string {
  if (!url) {
    return '';
  }

  if (!isValidYouTubeUrl(url)) {
    return 'Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)';
  }

  return '';
}