import { isValidYouTubeUrl, getYouTubeVideoId, getValidationMessage } from '../youtube-validator';

describe('YouTube URL Validator', () => {
  describe('isValidYouTubeUrl', () => {
    it('should validate standard YouTube URLs', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should validate youtu.be URLs', () => {
      const validUrls = [
        'https://youtu.be/dQw4w9WgXcQ',
        'http://youtu.be/dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ?t=30',
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should validate embed URLs', () => {
      const validUrls = [
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'https://youtube.com/embed/dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should validate /v/ URLs', () => {
      const validUrls = [
        'https://www.youtube.com/v/dQw4w9WgXcQ',
        'https://youtube.com/v/dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'https://www.google.com',
        'https://vimeo.com/123456789',
        'https://www.youtube.com',
        'https://www.youtube.com/watch',
        'https://www.youtube.com/watch?v=',
        'https://www.youtube.com/watch?v=short',
        'https://www.youtube.com/watch?v=toolongvideoid',
        'https://youtu.be/',
        'https://youtu.be/short',
        'https://www.youtube.com/embed/',
        'https://www.youtube.com/embed/short',
      ];

      invalidUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(false);
      });
    });

    it('should handle null and undefined inputs', () => {
      expect(isValidYouTubeUrl(null as unknown as string)).toBe(false);
      expect(isValidYouTubeUrl(undefined as unknown as string)).toBe(false);
      expect(isValidYouTubeUrl(123 as unknown as string)).toBe(false);
    });

    it('should reject URLs with invalid video IDs', () => {
      const invalidUrls = [
        'https://www.youtube.com/watch?v=invalid@id',
        'https://www.youtube.com/watch?v=spaces in id',
        'https://youtu.be/invalid@id',
        'https://www.youtube.com/embed/invalid@id',
      ];

      invalidUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(false);
      });
    });
  });

  describe('getYouTubeVideoId', () => {
    it('should extract video ID from standard YouTube URLs', () => {
      const testCases = [
        {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
        {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
          expected: 'dQw4w9WgXcQ',
        },
        {
          url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(getYouTubeVideoId(url)).toBe(expected);
      });
    });

    it('should extract video ID from youtu.be URLs', () => {
      const testCases = [
        {
          url: 'https://youtu.be/dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
        {
          url: 'https://youtu.be/dQw4w9WgXcQ?t=30',
          expected: 'dQw4w9WgXcQ',
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(getYouTubeVideoId(url)).toBe(expected);
      });
    });

    it('should extract video ID from embed URLs', () => {
      const testCases = [
        {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
        {
          url: 'https://youtube.com/embed/dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(getYouTubeVideoId(url)).toBe(expected);
      });
    });

    it('should extract video ID from /v/ URLs', () => {
      const testCases = [
        {
          url: 'https://www.youtube.com/v/dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
        {
          url: 'https://youtube.com/v/dQw4w9WgXcQ',
          expected: 'dQw4w9WgXcQ',
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(getYouTubeVideoId(url)).toBe(expected);
      });
    });

    it('should return null for invalid URLs', () => {
      const invalidUrls = [
        'https://www.google.com',
        'https://vimeo.com/123456789',
        'not-a-url',
        '',
        'https://www.youtube.com/watch?v=invalid',
      ];

      invalidUrls.forEach(url => {
        expect(getYouTubeVideoId(url)).toBeNull();
      });
    });
  });

  describe('getValidationMessage', () => {
    it('should return empty string for valid URLs', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(getValidationMessage(url)).toBe('');
      });
    });

    it('should return empty string for empty input', () => {
      expect(getValidationMessage('')).toBe('');
    });

    it('should return error message for invalid URLs', () => {
      const invalidUrls = [
        'https://www.google.com',
        'not-a-url',
        'https://www.youtube.com/watch?v=invalid',
      ];

      invalidUrls.forEach(url => {
        const message = getValidationMessage(url);
        expect(message).toContain('Please enter a valid YouTube video URL');
        expect(message).toContain('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      });
    });
  });
});
