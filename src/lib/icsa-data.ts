// ICSA Challenge Data Integration
// This file provides structured access to the ICSA challenge data for the chat API

export interface ICSAQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export interface ICSAModule {
  module: string;
  questions: ICSAQuestion[];
}

export interface ICSAChallenge {
  id: string;
  title: string;
  description: string;
  totalChallenges: number;
  completedChallenges: number;
  route: string;
}

// ICSA Challenge Categories
export const ICSA_CHALLENGES: ICSAChallenge[] = [
  {
    id: 'phishing',
    title: 'Phishing Simulation',
    description: 'Learn to identify and prevent phishing attacks through interactive email analysis',
    totalChallenges: 10,
    completedChallenges: 0,
    route: 'phishing-intro'
  },
  {
    id: 'least-privilege',
    title: 'Least Privilege',
    description: 'Master access control and privilege management principles',
    totalChallenges: 8,
    completedChallenges: 0,
    route: 'least-privilege-intro'
  },
  {
    id: 'secure-coding',
    title: 'Secure Coding',
    description: 'Master secure programming practices and vulnerability prevention',
    totalChallenges: 12,
    completedChallenges: 0,
    route: 'secure-coding-intro'
  },
  {
    id: 'encryption',
    title: 'Digital Forensics Lab',
    description: 'Decrypt files using Caesar cipher techniques and cryptographic analysis',
    totalChallenges: 5,
    completedChallenges: 0,
    route: 'encryption-intro'
  },
  {
    id: 'security-quiz',
    title: 'Social Media Investigation',
    description: 'Analyze social media posts for security risks and privacy violations',
    totalChallenges: 5,
    completedChallenges: 0,
    route: 'security-quiz-intro'
  }
];

// Key ICSA Learning Modules (from the JSON data)
export const ICSA_MODULES = [
  "1. Spotting Phishing Links",
  "2. QR Code Phishing Detection", 
  "3. Email Header Analysis",
  "4. Malicious Attachments",
  "5. Social Engineering Attacks",
  "6. Password Security and Credential Management",
  "7. Multi-Factor Authentication (MFA) Deep Dive",
  "8. Secure Software and Device Updates",
  "9. Public Wi-Fi and Man-in-the-Middle (MITM) Attacks",
  "10. Malware (Types, Tactics, and Infections)",
  "11. Ransomware Attacks (How to Detect, Avoid, and Survive)",
  "12. Malvertising and Drive-By Downloads",
  "13. Malicious Browser Extensions",
  "14. USB Traps and Physical Device Exploits",
  "15. QR Code and NFC Exploits",
  "16. Deepfakes and Voice Spoofing Attacks",
  "17. AI-Powered Phishing and Chatbot Manipulation",
  "18. Synthetic Identity Networks",
  "19. Cyber Threats in Gaming Platforms and Discord Servers"
];

// Sample phishing examples from the ICSA data
export const PHISHING_EXAMPLES = [
  {
    content: "Your PayPal account has been suspended. Please verify your account immediately by clicking the link below. Failure to do so will result in permanent closure.",
    explanation: "This email is phishing because it creates urgency and fear, uses a fake PayPal domain, and requests immediate action through a suspicious link."
  },
  {
    content: "You have received an email that looks like an Apple invoice, claiming you were charged $89.99 for iCloud+ storage and giving fake details such as an order ID, document number, and masked card number.",
    explanation: "This is phishing because it pretends to be an Apple invoice with fabricated billing details and urges you to click a link to dispute charges."
  },
  {
    content: "We detected unusual login attempts on your email account. Please reset your password immediately using the link below.",
    explanation: "This is phishing because it uses generic warnings about login attempts and provides a fake password reset link to steal credentials."
  }
];

// Security principles from secure coding challenges
export const SECURE_CODING_PRINCIPLES = [
  {
    principle: "Input Validation",
    description: "Always validate and sanitize user input to prevent injection attacks",
    example: "Use parameterized queries instead of string concatenation for database queries"
  },
  {
    principle: "Authentication & Authorization",
    description: "Implement proper user authentication and role-based access control",
    example: "Use JWT tokens with proper expiration and implement least privilege access"
  },
  {
    principle: "Secure Communication",
    description: "Encrypt sensitive data in transit and at rest",
    example: "Use HTTPS for all web communications and encrypt sensitive data in databases"
  }
];

// Social media security lessons
export const SOCIAL_MEDIA_SECURITY = [
  {
    scenario: "Daily Snapchat Streaks",
    risk: "Location patterns are visible",
    lesson: "Daily streaks can reveal location patterns and make it easy for stalkers to predict where you'll be."
  },
  {
    scenario: "Instagram Stories with Personal Info",
    risk: "Documents with personal information are dangerous to share",
    lesson: "Documents with personal information (names, IDs, addresses) are the most dangerous to share online."
  },
  {
    scenario: "Hacker's Information Gathering",
    risk: "Hackers connect small clues from multiple posts",
    lesson: "Hackers connect small clues from multiple posts to launch bigger, more convincing attacks."
  }
];

// Function to get ICSA context for chat
export function getICSAContext(): string {
  const challengesInfo = ICSA_CHALLENGES.map(challenge => 
    `- ${challenge.title}: ${challenge.description} (${challenge.totalChallenges} challenges)`
  ).join('\n');

  const modulesInfo = ICSA_MODULES.slice(0, 10).join(', ') + '...';

  const phishingInfo = PHISHING_EXAMPLES.map(example => 
    `Example: "${example.content}" - ${example.explanation}`
  ).join('\n');

  const codingInfo = SECURE_CODING_PRINCIPLES.map(principle => 
    `${principle.principle}: ${principle.description} (Example: ${principle.example})`
  ).join('\n');

  const socialInfo = SOCIAL_MEDIA_SECURITY.map(item => 
    `${item.scenario}: ${item.risk} - ${item.lesson}`
  ).join('\n');

  return `
ICSA CYBERSECURITY CHALLENGE SYSTEM CONTEXT:

AI ASSISTANT IDENTITY:
- Name: Shieldo
- Role: Cute Streak Pet and Cyber Security AI Advisor
- Personality: Friendly, encouraging, knowledgeable, and supportive
- Communication Style: Warm and approachable while maintaining cybersecurity expertise

Available Challenge Categories:
${challengesInfo}

Learning Modules Covered:
${modulesInfo}

Phishing Detection Examples:
${phishingInfo}

Secure Coding Principles:
${codingInfo}

Social Media Security Lessons:
${socialInfo}

The user is participating in an interactive cybersecurity education platform with gamified challenges covering phishing detection, secure coding, encryption, social media security, and access control. Each challenge provides hands-on experience with real-world security scenarios.

As Shieldo, you are their loyal cybersecurity companion who helps them learn, grow, and stay safe online while maintaining their learning streak and encouraging their progress.
`;
}
