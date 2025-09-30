'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Code,
  Shield,
  Bug,
  Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CodingChallenge {
  id: number;
  title: string;
  code: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  vulnerability: string;
}

export default function SecureCodingGameScreen() {
  const { setCurrentScreen, addXP, unlockBadge } = useAppStore();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const challenges: CodingChallenge[] = [
    {
      id: 1,
      title: "SQL Injection Vulnerability",
      code: `// Vulnerable code
String query = "SELECT * FROM users WHERE id = " + userId;
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(query);`,
      question: "What's the main security issue with this code?",
      options: [
        "No input validation",
        "SQL injection vulnerability",
        "Missing error handling",
        "No authentication"
      ],
      correctAnswer: 1,
      explanation: "This code is vulnerable to SQL injection because it directly concatenates user input into the SQL query without proper sanitization.",
      vulnerability: "SQL Injection"
    },
    {
      id: 2,
      title: "Cross-Site Scripting (XSS)",
      code: `// Vulnerable code
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}`,
      question: "What security vulnerability does this code have?",
      options: [
        "Buffer overflow",
        "Cross-Site Scripting (XSS)",
        "SQL injection",
        "Authentication bypass"
      ],
      correctAnswer: 1,
      explanation: "This code directly inserts user input into the DOM without sanitization, allowing malicious scripts to be executed.",
      vulnerability: "Cross-Site Scripting (XSS)"
    },
    {
      id: 3,
      title: "Secure Input Validation",
      code: `// Secure code
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
}`,
      question: "What security practice is demonstrated here?",
      options: [
        "Input validation",
        "Error handling",
        "Data sanitization",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "This code demonstrates proper input validation, error handling, and data sanitization - all essential security practices.",
      vulnerability: "None - This is secure code"
    }
  ];

  const handleBack = () => {
    setCurrentScreen('secure-coding-intro');
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const challenge = challenges[currentChallenge];
    const isCorrect = answerIndex === challenge.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('✅ Correct!');
    } else {
      toast.error('❌ Incorrect!');
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
      const finalScore = selectedAnswer === challenges[currentChallenge].correctAnswer ? score + 1 : score;
      const percentage = Math.round((finalScore / challenges.length) * 100);
      
      if (percentage >= 80) {
        addXP(25);
        unlockBadge('secure-coder');
        toast.success('🏆 Badge earned: Secure Coder!');
      } else if (percentage >= 60) {
        addXP(15);
        toast.success('Good job! Keep learning!');
      } else {
        addXP(5);
        toast('Keep studying! Security is a journey.');
      }
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameCompleted(false);
  };

  const currentChallengeData = challenges[currentChallenge];

  if (gameCompleted) {
    const percentage = Math.round((score / challenges.length) * 100);
    return (
      <>
        <div className="topbar">
          <button className="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="chip">Challenge Complete</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div 
            className="logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              fontSize: '28px',
              background: 'linear-gradient(135deg, var(--ok) 0%, var(--accent-2) 100%)',
              margin: '0 auto 16px'
            }}
          >
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
            Challenge Complete!
          </h1>
          <p className="subtitle">
            You scored {score}/{challenges.length} ({percentage}%)
          </p>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Performance Analysis
          </h2>
          <div className="col" style={{ gap: '8px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Correct Answers:</span>
              <strong style={{ color: 'var(--ok)' }}>{score}/{challenges.length}</strong>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Accuracy:</span>
              <strong style={{ color: percentage >= 80 ? 'var(--ok)' : percentage >= 60 ? 'var(--accent)' : 'var(--warn)' }}>
                {percentage}%
              </strong>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>XP Earned:</span>
              <strong style={{ color: 'var(--accent-2)' }}>
                {percentage >= 80 ? '25' : percentage >= 60 ? '15' : '5'} XP
              </strong>
            </div>
          </div>
        </div>

        {percentage >= 80 && (
          <div className="card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'var(--ok)' }}>
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--ok)' }} />
              <strong style={{ color: 'var(--ok)' }}>Badge Unlocked: Secure Coder</strong>
            </div>
            <p className="subtitle" style={{ marginTop: '8px', fontSize: '13px' }}>
              Excellent work! You understand secure coding principles.
            </p>
          </div>
        )}

        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.35))', 
          padding: '14px 10px 8px', 
          display: 'flex', 
          gap: '10px' 
        }}>
          <button className="cta" onClick={handleRestart}>
            Try Again
          </button>
          <button className="cta secondary" onClick={handleBack}>
            Back to Hub
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">
          Challenge {currentChallenge + 1} of {challenges.length}
        </div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          {currentChallengeData.title}
        </h2>
        <div className="card" style={{ 
          background: 'rgba(0,0,0,0.3)', 
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {currentChallengeData.code}
          </pre>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>
          {currentChallengeData.question}
        </h3>
        <div className="col" style={{ gap: '8px' }}>
          {currentChallengeData.options.map((option, index) => (
            <button 
              key={index}
              className={`cta ${selectedAnswer === index ? 'active' : ''}`}
              onClick={() => !showExplanation && handleAnswer(index)}
              style={{ 
                textAlign: 'left',
                background: selectedAnswer === index 
                  ? (selectedAnswer === currentChallengeData.correctAnswer 
                      ? 'linear-gradient(135deg, var(--ok) 0%, #059669 100%)'
                      : 'linear-gradient(135deg, var(--warn) 0%, #dc2626 100%)')
                  : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                opacity: showExplanation && selectedAnswer !== index ? 0.5 : 1
              }}
            >
              <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
                {showExplanation && selectedAnswer === index && (
                  selectedAnswer === currentChallengeData.correctAnswer ? 
                    <CheckCircle className="w-4 h-4" /> : 
                    <XCircle className="w-4 h-4" />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="card">
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>
            Explanation
          </h3>
          <div className="card" style={{ 
            background: selectedAnswer === currentChallengeData.correctAnswer 
              ? 'rgba(34,197,94,0.1)' 
              : 'rgba(248,113,113,0.1)',
            borderColor: selectedAnswer === currentChallengeData.correctAnswer 
              ? 'var(--ok)' 
              : 'var(--warn)'
          }}>
            <p style={{ 
              margin: '0 0 8px', 
              fontWeight: '600',
              color: selectedAnswer === currentChallengeData.correctAnswer 
                ? 'var(--ok)' 
                : 'var(--warn)'
            }}>
              {selectedAnswer === currentChallengeData.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
            </p>
            <p className="subtitle" style={{ fontSize: '13px', lineHeight: '1.4' }}>
              {currentChallengeData.explanation}
            </p>
            <div style={{ marginTop: '8px' }}>
              <span className="chip" style={{ fontSize: '11px' }}>
                Vulnerability: {currentChallengeData.vulnerability}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        position: 'sticky', 
        bottom: 0, 
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.35))', 
        padding: '14px 10px 8px', 
        display: 'flex', 
        gap: '10px' 
      }}>
        {showExplanation && (
          <button className="cta" onClick={handleNext}>
            {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'Finish'}
          </button>
        )}
        <button className="cta secondary" onClick={handleBack}>
          Back to Intro
        </button>
      </div>
    </>
  );
}
