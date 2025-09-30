'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  ArrowLeft,
  Timer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MapPin,
  Calendar,
  User,
  Trophy,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialMediaPost {
  id: number;
  platform: string;
  content: string;
  image: string;
  timestamp: string;
  location?: string;
  risks: string[];
  questions: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

const socialMediaPosts: SocialMediaPost[] = [
  {
    id: 1,
    platform: "Instagram",
    content: "Just moved into my new apartment! 🏠 So excited to start this new chapter. The view from my balcony is amazing!",
    image: "/quiz-instagram-items.jpg",
    timestamp: "2 hours ago",
    location: "Downtown District",
    risks: ["Location sharing", "Home address exposure", "Routine establishment"],
    questions: [
      {
        question: "What security risk does this post create?",
        options: [
          "None, it's just a normal post",
          "Reveals her exact home address",
          "Shows her daily routine",
          "Exposes her financial information"
        ],
        correct: 1,
        explanation: "The post reveals her new home location and could help attackers identify her residence."
      }
    ]
  },
  {
    id: 2,
    platform: "Snapchat",
    content: "Morning jog complete! Same route as always - love this neighborhood. #fitness #morningroutine",
    image: "/quiz-snapchat-street.jpg",
    timestamp: "6 hours ago",
    location: "Riverside Park",
    risks: ["Routine exposure", "Location tracking", "Schedule predictability"],
    questions: [
      {
        question: "What pattern does this post reveal?",
        options: [
          "Her shopping habits",
          "Her morning exercise routine",
          "Her work schedule",
          "Her social circle"
        ],
        correct: 1,
        explanation: "The post reveals her consistent morning jogging routine, making her schedule predictable."
      }
    ]
  },
  {
    id: 3,
    platform: "Facebook",
    content: "Working late again! This project deadline is killing me. At least the office has great coffee ☕",
    image: "/quiz-hacker-notebook.jpg",
    timestamp: "1 day ago",
    risks: ["Work schedule exposure", "Stress level indication", "Location confirmation"],
    questions: [
      {
        question: "What information could an attacker use from this post?",
        options: [
          "Her coffee preferences",
          "Her work schedule and stress levels",
          "Her project details",
          "Her office location"
        ],
        correct: 1,
        explanation: "The post reveals her work schedule, stress levels, and could be used for social engineering attacks."
      }
    ]
  },
  {
    id: 4,
    platform: "Twitter",
    content: "Just got my new credit card in the mail! Time to update all my online accounts. So many passwords to remember 😅",
    image: "/quiz-rideshare-receipt.jpg",
    timestamp: "3 days ago",
    risks: ["Financial information", "Password management issues", "Account vulnerability"],
    questions: [
      {
        question: "What security risk does this post highlight?",
        options: [
          "She's good at managing passwords",
          "She might reuse passwords across accounts",
          "She's careful with financial information",
          "She uses strong security practices"
        ],
        correct: 1,
        explanation: "The post suggests she might reuse passwords or have weak password management practices."
      }
    ]
  },
  {
    id: 5,
    platform: "Instagram",
    content: "Beach day with the girls! 🏖️ Love these summer vibes. #beachlife #friends #summer2024",
    image: "/quiz-final-scene.jpg",
    timestamp: "1 week ago",
    location: "Sunset Beach",
    risks: ["Location sharing", "Social circle exposure", "Schedule predictability"],
    questions: [
      {
        question: "What privacy concern does this post raise?",
        options: [
          "She's sharing too much personal information",
          "She's not using proper hashtags",
          "She's posting at the wrong time",
          "She's not tagging her friends"
        ],
        correct: 0,
        explanation: "The post shares location, social connections, and establishes patterns that could be exploited."
      }
    ]
  }
];

export default function SecurityQuizGameScreen() {
  const { setCurrentScreen, addXP, unlockBadge, user, refreshUserData } = useAppStore();
  const [currentPost, setCurrentPost] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Calculate total questions
  useEffect(() => {
    const total = socialMediaPosts.reduce((sum, post) => sum + post.questions.length, 0);
    setTotalQuestions(total);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleTimeout();
    }
  }, [timeLeft, gameCompleted]);

  const handleTimeout = useCallback(async () => {
    setGameCompleted(true);
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Save progress to Firebase
    if (user?.id) {
      try {
        const progressData = {
          completed: score,
          total: totalQuestions,
          score,
          percentage: percentage,
          completedAt: new Date().toISOString()
        };
        
        await authService.saveChallengeProgress(user.id, 'security-quiz', progressData);
        
        // Award XP and badges based on performance
        if (percentage >= 80) {
          await addXP(30);
          await unlockBadge('digital-detective');
          toast.success('🏆 Badge earned: Digital Detective!');
        } else if (percentage >= 60) {
          await addXP(20);
          toast.success('Good investigation work!');
        } else {
          await addXP(10);
          toast('Keep practicing your digital forensics skills!');
        }
        
        // Refresh user data to ensure UI is updated
        await refreshUserData();
        
      } catch (error) {
        console.error('Error saving security quiz progress:', error);
        toast.error('Error saving progress. Please try again.');
      }
    }
    
    // Also save to localStorage for backward compatibility
    localStorage.setItem('security-quiz-progress', JSON.stringify({
      completed: score,
      total: totalQuestions,
      score,
      lastPlayed: new Date().toISOString()
    }));
  }, [score, totalQuestions, addXP, unlockBadge, user?.id, refreshUserData]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentPostData = socialMediaPosts[currentPost];
    const currentQuestionData = currentPostData.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuestionData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Correct! Good analysis.');
    } else {
      toast.error('Incorrect. Review the explanation.');
    }

    const result = {
      postId: currentPost + 1,
      questionId: currentQuestion + 1,
      question: currentQuestionData.question,
      selectedAnswer,
      correctAnswer: currentQuestionData.correct,
      isCorrect,
      explanation: currentQuestionData.explanation
    };
    
    setGameResults(prev => [...prev, result]);
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentQuestion + 1 < socialMediaPosts[currentPost].questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentPost + 1 < socialMediaPosts.length) {
      setCurrentPost(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      setGameCompleted(true);
      const percentage = Math.round((score / totalQuestions) * 100);
      
      // Save progress to Firebase
      if (user?.id) {
        try {
          const progressData = {
            completed: score,
            total: totalQuestions,
            score,
            percentage: percentage,
            completedAt: new Date().toISOString()
          };
          
          await authService.saveChallengeProgress(user.id, 'security-quiz', progressData);
          
          // Award XP and badges based on performance
          if (percentage >= 80) {
            await addXP(30);
            await unlockBadge('digital-detective');
            toast.success('🏆 Badge earned: Digital Detective!');
          } else if (percentage >= 60) {
            await addXP(20);
            toast.success('Good investigation work!');
          } else {
            await addXP(10);
            toast('Keep practicing your digital forensics skills!');
          }
          
          // Refresh user data to ensure UI is updated
          await refreshUserData();
          
        } catch (error) {
          console.error('Error saving security quiz progress:', error);
          toast.error('Error saving progress. Please try again.');
        }
      }
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('security-quiz-progress', JSON.stringify({
        completed: score,
        total: totalQuestions,
        score,
        lastPlayed: new Date().toISOString()
      }));
    }
    
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleBack = () => {
    setCurrentScreen('security-quiz-intro');
  };

  const handleRestart = () => {
    setCurrentPost(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(60);
    setGameResults([]);
    setShowExplanation(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const correctAnswers = gameResults.filter(r => r.isCorrect).length;
    
    return (
      <>
        <div className="topbar">
          <button className="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="chip">Investigation Complete</div>
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
            Investigation Complete!
          </h1>
          <p className="subtitle">
            You analyzed {socialMediaPosts.length} social media posts and answered {correctAnswers}/{totalQuestions} questions correctly ({percentage}%)
          </p>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Security Risks Identified
          </h2>
          <div className="col" style={{ gap: '8px' }}>
            {socialMediaPosts.map((post, index) => (
              <div key={index} className="card" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)' }}>
                <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Post {index + 1}:</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-2)' }}>{post.platform}</span>
                </div>
                <div className="col" style={{ gap: '4px' }}>
                  {post.risks.map((risk, riskIndex) => (
                    <div key={riskIndex} className="row" style={{ gap: '6px', alignItems: 'center' }}>
                      <AlertTriangle className="w-3 h-3" style={{ color: 'var(--warn)', minWidth: '12px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--warn)' }}>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {percentage >= 80 && (
          <div className="card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'var(--ok)' }}>
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--ok)' }} />
              <strong style={{ color: 'var(--ok)' }}>Badge Unlocked: Digital Detective</strong>
            </div>
            <p className="subtitle" style={{ marginTop: '8px', fontSize: '13px' }}>
              Excellent work! You've mastered the art of digital forensics and privacy analysis.
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

  if (currentPost >= socialMediaPosts.length) {
    return <div>Game Complete</div>;
  }

  const currentPostData = socialMediaPosts[currentPost];
  const currentQuestionData = currentPostData.questions[currentQuestion];
  const progress = ((currentPost * socialMediaPosts[0].questions.length + currentQuestion + 1) / totalQuestions) * 100;

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">
          Post {currentPost + 1} of {socialMediaPosts.length}
        </div>
      </div>
      
      {/* Header */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>Digital Forensics Investigation</h1>
          <div className="row" style={{ gap: '16px', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent-2)', fontWeight: '600' }}>Score: {score}/{totalQuestions}</span>
            <div className="row" style={{ gap: '4px', alignItems: 'center' }}>
              <Timer className="w-4 h-4" />
              <span style={{ 
                fontFamily: 'ui-monospace', 
                color: timeLeft <= 10 ? 'var(--warn)' : 'var(--accent-2)',
                fontWeight: '600'
              }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px' }}>Progress: {currentPost + 1}/{socialMediaPosts.length}</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-2)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Social Media Post */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <div 
            className="logo" 
            style={{ 
              width: '32px', 
              height: '32px', 
              fontSize: '14px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)'
            }}
          >
            <User className="w-4 h-4" />
          </div>
          <div className="col" style={{ gap: '2px', flex: 1 }}>
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px' }}>Laila</strong>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>•</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{currentPostData.timestamp}</span>
            </div>
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-2)' }}>{currentPostData.platform}</span>
              {currentPostData.location && (
                <>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>•</span>
                  <div className="row" style={{ gap: '4px', alignItems: 'center' }}>
                    <MapPin className="w-3 h-3" style={{ color: 'var(--muted)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{currentPostData.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <p style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '12px' }}>
          {currentPostData.content}
        </p>
        
        <img 
          src={currentPostData.image} 
          alt={`Social media post ${currentPost + 1}`}
          style={{ 
            width: '100%', 
            borderRadius: '8px',
            maxHeight: '200px',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>
          {currentQuestionData.question}
        </h3>
        
        <div className="col" style={{ gap: '8px' }}>
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              className={`cta ${selectedAnswer === index ? 'primary' : 'secondary'}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              style={{ 
                textAlign: 'left',
                justifyContent: 'flex-start',
                padding: '12px',
                fontSize: '13px',
                lineHeight: '1.4'
              }}
            >
              <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
                {selectedAnswer === index ? (
                  selectedAnswer === currentQuestionData.correct ? (
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', minWidth: '16px' }} />
                  ) : (
                    <XCircle className="w-4 h-4" style={{ color: 'var(--warn)', minWidth: '16px' }} />
                  )
                ) : (
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    minWidth: '16px'
                  }} />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedAnswer !== null && !showExplanation && (
          <button 
            className="cta" 
            onClick={handleSubmitAnswer}
            style={{ marginTop: '12px', width: '100%' }}
          >
            Submit Answer
          </button>
        )}

        {showExplanation && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '8px',
            border: `1px solid ${selectedAnswer === currentQuestionData.correct ? 'var(--ok)' : 'var(--warn)'}`
          }}>
            <div className="row" style={{ gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              {selectedAnswer === currentQuestionData.correct ? (
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)' }} />
              ) : (
                <XCircle className="w-4 h-4" style={{ color: 'var(--warn)' }} />
              )}
              <strong style={{ 
                fontSize: '14px',
                color: selectedAnswer === currentQuestionData.correct ? 'var(--ok)' : 'var(--warn)'
              }}>
                {selectedAnswer === currentQuestionData.correct ? 'Correct!' : 'Incorrect'}
              </strong>
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
              {currentQuestionData.explanation}
            </p>
            <button 
              className="cta" 
              onClick={handleNext}
              style={{ marginTop: '12px', width: '100%' }}
            >
              {currentQuestion + 1 < currentPostData.questions.length || currentPost + 1 < socialMediaPosts.length ? 'Next' : 'Complete Investigation'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
