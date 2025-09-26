import {
  formatDate,
  calculateRiskColor,
  getRiskLevel,
  generateMockUrl,
  validateUrl,
  extractDomain,
  isUrlShortener,
  detectTyposquatting,
  getRandomPetTip,
  calculateXPForAction,
  getLevelFromXP,
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });
  });

  describe('calculateRiskColor', () => {
    it('returns correct color for high risk', () => {
      expect(calculateRiskColor(80)).toBe('var(--warn)');
    });

    it('returns correct color for medium risk', () => {
      expect(calculateRiskColor(50)).toBe('#d97706');
    });

    it('returns correct color for low risk', () => {
      expect(calculateRiskColor(20)).toBe('var(--ok)');
    });
  });

  describe('getRiskLevel', () => {
    it('returns high for scores >= 70', () => {
      expect(getRiskLevel(80)).toBe('high');
    });

    it('returns medium for scores >= 30', () => {
      expect(getRiskLevel(50)).toBe('medium');
    });

    it('returns low for scores < 30', () => {
      expect(getRiskLevel(20)).toBe('low');
    });
  });

  describe('generateMockUrl', () => {
    it('generates safe URLs', () => {
      const url = generateMockUrl('safe');
      expect(url).toMatch(/^https:\/\//);
    });

    it('generates caution URLs', () => {
      const url = generateMockUrl('caution');
      expect(url).toMatch(/bit\.ly|tinyurl|short\.ly|t\.co/);
    });

    it('generates malicious URLs', () => {
      const url = generateMockUrl('malicious');
      expect(url).toMatch(/http:\/\//);
    });
  });

  describe('validateUrl', () => {
    it('validates correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('extracts domain from URL', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
    });

    it('returns empty string for invalid URL', () => {
      expect(extractDomain('not-a-url')).toBe('');
    });
  });

  describe('isUrlShortener', () => {
    it('detects URL shorteners', () => {
      expect(isUrlShortener('https://bit.ly/abc123')).toBe(true);
      expect(isUrlShortener('https://tinyurl.com/xyz')).toBe(true);
    });

    it('does not detect regular URLs as shorteners', () => {
      expect(isUrlShortener('https://example.com')).toBe(false);
    });
  });

  describe('detectTyposquatting', () => {
    it('detects typosquatting patterns', () => {
      expect(detectTyposquatting('http://paypa1-login.com')).toBe(true);
      expect(detectTyposquatting('http://g00gle.com')).toBe(true);
    });

    it('does not detect legitimate URLs', () => {
      expect(detectTyposquatting('https://paypal.com')).toBe(false);
    });
  });

  describe('getRandomPetTip', () => {
    it('returns a string', () => {
      const tip = getRandomPetTip();
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });
  });

  describe('calculateXPForAction', () => {
    it('returns correct XP for known actions', () => {
      expect(calculateXPForAction('qr-scan')).toBe(6);
      expect(calculateXPForAction('basic-lesson')).toBe(15);
    });

    it('returns 0 for unknown actions', () => {
      expect(calculateXPForAction('unknown-action')).toBe(0);
    });
  });

  describe('getLevelFromXP', () => {
    it('calculates level correctly', () => {
      expect(getLevelFromXP(0)).toBe(1);
      expect(getLevelFromXP(100)).toBe(2);
      expect(getLevelFromXP(250)).toBe(3);
    });
  });
});
