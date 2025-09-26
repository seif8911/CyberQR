import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateRiskColor(riskScore: number): string {
  if (riskScore >= 3.5) return 'var(--warn)'; // 3.5+ out of 10 = malicious
  if (riskScore >= 1.5) return '#d97706'; // 1.5+ out of 10 = caution
  return 'var(--ok)'; // Below 1.5 = safe
}

export function getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore >= 3.5) return 'high'; // 3.5+ out of 10 = high risk
  if (riskScore >= 1.5) return 'medium'; // 1.5+ out of 10 = medium risk
  return 'low'; // Below 1.5 = low risk
}

export function generateMockUrl(type: 'safe' | 'caution' | 'malicious'): string {
  const urls = {
    safe: [
      'https://www.wikipedia.org',
      'https://store.steampowered.com',
      'https://developer.mozilla.org',
      'https://www.github.com',
      'https://www.stackoverflow.com'
    ],
    caution: [
      'https://bit.ly/3x4mPl9',
      'https://tinyurl.com/abc123',
      'https://short.ly/xyz789',
      'https://t.co/randomlink'
    ],
    malicious: [
      'http://paypa1-secure-login.com',
      'http://g00gle-verify.support.ru',
      'http://micros0ft.account-reset.cn',
      'http://amazn-security.tk',
      'http://bank0famerica-login.ml'
    ]
  };

  const typeUrls = urls[type];
  return typeUrls[Math.floor(Math.random() * typeUrls.length)];
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function isUrlShortener(url: string): boolean {
  const shorteners = ['bit.ly', 'tinyurl.com', 'short.ly', 't.co', 'goo.gl'];
  const domain = extractDomain(url);
  return shorteners.some(shortener => domain.includes(shortener));
}

export function detectTyposquatting(url: string): boolean {
  const suspiciousPatterns = [
    /paypa[0-9]/,
    /g[0-9]ogle/,
    /micros[0-9]ft/,
    /amaz[0-9]n/,
    /bank[0-9]f/,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(url.toLowerCase()));
}

export function getPetTips(): string[] {
  return [
    'Great job! Always verify before you trust 🔍',
    'Look for HTTPS - that "s" matters! 🔒',
    'Hover over links to preview them first 👀',
    'When in doubt, ask someone you trust 🤝',
    'Typos in URLs are red flags! 📝',
    'Shortened links hide the real destination 🎭',
    'Your streak is growing! Keep learning 🚀',
    'Real companies never ask for passwords by email 📧',
    'Check the sender\'s email address carefully 📬',
    'Be suspicious of urgent requests ⏰',
    'Never click links in suspicious emails 🚫',
    'Keep your software updated for security 🔄'
  ];
}

export function getRandomPetTip(): string {
  const tips = getPetTips();
  return tips[Math.floor(Math.random() * tips.length)];
}

export function calculateXPForAction(action: string): number {
  const xpMap: { [key: string]: number } = {
    'qr-scan': 6,
    'basic-lesson': 15,
    'advanced-lesson': 25,
    'vulnerability-found': 10,
    'perfect-quiz': 20,
    'daily-login': 5,
    'streak-milestone': 50,
  };
  
  return xpMap[action] || 0;
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelXP = currentLevel * 100;
  return nextLevelXP - currentXP;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
