'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Link,
  Lock,
  Trophy,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PhishingEmail {
  id: number;
  image: string;
  isPhishing: boolean;
  explanation: string;
  content: string;
}

export default function PhishingGameScreen() {
  const { setCurrentScreen, addXP, unlockBadge, refreshUserData, user } = useAppStore();
  const [currentEmail, setCurrentEmail] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'phishing' | 'legitimate' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const phishingEmails: PhishingEmail[] = [
    {
      id: 1,
      image: "/phishing-email-1.jpg",
      isPhishing: true,
      content: "Your PayPal account has been suspended. Please verify your account immediately by clicking the link below. Failure to do so will result in permanent closure.",
      explanation: "This email is phishing because: It creates a sense of concern by suggesting someone submitted negative or sensitive feedback. It urges you to click a link to view details instead of using official HR communication channels. The sender name \"Automated HR Solutions\" and the generic company reference are vague and not verifiable."
    },
    {
      id: 2,
      image: "/phishing-email-2.jpg",
      isPhishing: true,
      content: "You have received an email that looks like an Apple invoice, claiming you were charged $89.99 for iCloud+ storage and giving fake details such as an order ID, document number, and masked card number. The message urges you to click a link to cancel or dispute the charge.",
      explanation: "Why this is phishing? This email is phishing because it pretends to be an Apple invoice to make you believe you were wrongly charged. It uses fake billing details and an urgent link to trick you into clicking. Real Apple invoices only appear in your official Apple account or App Store, not through random email links."
    },
    {
      id: 3,
      image: "/phishing-email-3.jpg",
      isPhishing: true,
      content: "We detected unusual login attempts on your email account. Please reset your password immediately using the link below.",
      explanation: "This is phishing because it uses generic warnings about login attempts and provides a fake password reset link to steal credentials."
    },
    {
      id: 4,
      image: "/phishing-email-4.jpg",
      isPhishing: true,
      content: "Congratulations! You've won a $500 gift card. Click here to claim your prize before it expires in 24 hours.",
      explanation: "This is phishing because it's too good to be true, uses urgency (24-hour expiration), and you didn't enter any contest."
    },
    {
      id: 5,
      image: "/phishing-email-5.jpg",
      isPhishing: false,
      content: "Your Google account storage is almost full. Please upgrade your plan by visiting Google One.",
      explanation: "This is legitimate because it's a standard notification from Google about storage limits and directs to the official upgrade service."
    },
    {
      id: 6,
      image: "/phishing-email-6.jpg",
      isPhishing: true,
      content: "Your bank account has been locked due to suspicious activity. Click here to unlock it now.",
      explanation: "This is phishing because legitimate banks never send clickable unlock links in emails. They would direct you to call or visit a branch."
    },
    {
      id: 7,
      image: "/phishing-email-7.jpg",
      isPhishing: true,
      content: "Attached is your invoice. Please open the file to confirm payment.",
      explanation: "This is phishing because unexpected attachments are common malware delivery methods, and legitimate invoices come with proper context."
    },
    {
      id: 8,
      image: "/phishing-email-8.jpg",
      isPhishing: false,
      content: "Reminder: Your dentist appointment is scheduled for Tuesday at 10:30 AM. Please call if you need to reschedule.",
      explanation: "This is legitimate because it's a normal appointment reminder with no suspicious links or requests for personal data."
    },
    {
      id: 9,
      image: "/phishing-email-9.jpg",
      isPhishing: true,
      content: "We couldn't deliver your package. Click here to schedule redelivery.",
      explanation: "This is phishing because it lacks specific tracking details, shipping company information, and uses a generic delivery failure message."
    },
    {
      id: 10,
      image: "/phishing-email-10.jpg",
      isPhishing: true,
      content: "Security Alert: Someone tried to log in from China. Confirm your identity by entering your password here.",
      explanation: "This is phishing because legitimate security alerts never ask you to enter your password directly in an email response."
    }
  ];

  const handleBack = () => {
    setCurrentScreen('phishing-intro');
  };

  const handleAnswer = (answer: 'phishing' | 'legitimate') => {
    setSelectedAnswer(answer);
    const email = phishingEmails[currentEmail];
    const isCorrect = answer === (email.isPhishing ? 'phishing' : 'legitimate');
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast.success('✅ Correct! +10 points');
    } else {
      toast.error('❌ Incorrect!');
    }
    
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentEmail < phishingEmails.length - 1) {
      setCurrentEmail(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
      const finalScore = score + (selectedAnswer === (phishingEmails[currentEmail].isPhishing ? 'phishing' : 'legitimate') ? 10 : 0);
      const percentage = (finalScore / 100) * 100;
      
      // Save progress to Firebase
      if (user?.id) {
        try {
          const progressData = {
            completed: phishingEmails.length,
            total: phishingEmails.length,
            score: finalScore,
            percentage: percentage,
            completedAt: new Date().toISOString()
          };
          
          await authService.saveChallengeProgress(user.id, 'phishing', progressData);
          
          // Award XP and badges based on performance
          if (percentage >= 80) {
            await addXP(25);
            await unlockBadge('phishing-detective');
            toast.success('🏆 Badge earned: Phishing Detective!');
          } else if (percentage >= 60) {
            await addXP(15);
            toast.success('Good job! Keep practicing!');
          } else {
            await addXP(5);
            toast('Keep learning! You\'ll get better with practice.');
          }
          
          // Refresh user data to ensure UI is updated
          await refreshUserData();
          
        } catch (error) {
          console.error('Error saving phishing progress:', error);
          toast.error('Error saving progress. Please try again.');
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentEmail(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameCompleted(false);
  };

  const currentEmailData = phishingEmails[currentEmail];

  if (gameCompleted) {
    const finalScore = score + (selectedAnswer === phishingEmails[currentEmail].isPhishing ? 10 : 0);
    const percentage = (finalScore / 100) * 100;
    
    return (
      <>
        <div className="topbar">
          <button className="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="chip">Training Complete</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div 
            className="logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              fontSize: '28px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              margin: '0 auto 16px'
            }}
          >
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="title" style={{ fontSize: '24px', margin: '0 0 8px' }}>
            Training Complete!
          </h1>
          <p className="subtitle">
            You scored {finalScore} out of 100 points ({percentage}%)
          </p>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Performance Rating
          </h2>
          <div style={{ 
            textAlign: 'center', 
            padding: '16px',
            background: 'rgba(34,211,238,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(34,211,238,0.3)'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-2)', marginBottom: '8px' }}>
              {percentage >= 80 ? "Expert Defender 🛡️" :
               percentage >= 60 ? "Security Aware 🔍" :
               percentage >= 40 ? "Learning Progress 📚" :
               "Needs Practice ⚠️"}
            </div>
            <p className="subtitle" style={{ fontSize: '13px' }}>
              {percentage >= 80 ? "Outstanding! You're a phishing detection expert." :
               percentage >= 60 ? "Good job! You have solid security awareness." :
               percentage >= 40 ? "Keep learning! You're making progress." :
               "Don't give up! Practice makes perfect."}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Performance Analysis
          </h2>
          <div className="col" style={{ gap: '8px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Total Score:</span>
              <strong style={{ color: 'var(--accent-2)' }}>{finalScore}/100 points</strong>
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
              <strong style={{ color: 'var(--ok)' }}>Badge Unlocked: Phishing Detective</strong>
            </div>
            <p className="subtitle" style={{ marginTop: '8px', fontSize: '13px' }}>
              Excellent work! You've mastered the art of spotting phishing emails.
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
          Email {currentEmail + 1} of {phishingEmails.length}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Progress</span>
          <span style={{ fontSize: '14px', color: 'var(--accent-2)' }}>Score: {score}</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div style={{ width: `${((currentEmail + 1) / phishingEmails.length) * 100}%` }} />
        </div>
      </div>
      
      <div className="card">
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
          Email {currentEmail + 1} of {phishingEmails.length}
        </h2>
        <div className="card" style={{ background: 'rgba(255,255,255,0.95)', color: '#1a1a1a', fontSize: '13px', padding: '16px' }}>
          <img 
            src={currentEmailData.image} 
            alt={`Email challenge ${currentEmailData.id}`}
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              margin: '0 auto 16px', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'block'
            }}
          />
          <div style={{ 
            background: 'rgba(0,0,0,0.05)', 
            padding: '12px', 
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            <strong>Content Summary:</strong><br />
            {currentEmailData.content}
          </div>
        </div>
      </div>

      {!showExplanation ? (
        <div className="card">
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>
            Is this email legitimate or phishing?
          </h3>
          <div className="col" style={{ gap: '12px' }}>
            <button 
              className="cta" 
              onClick={() => handleAnswer('phishing')}
              style={{ background: 'linear-gradient(135deg, var(--warn) 0%, #dc2626 100%)' }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              This is Phishing
            </button>
            <button 
              className="cta" 
              onClick={() => handleAnswer('legitimate')}
              style={{ background: 'linear-gradient(135deg, var(--ok) 0%, #059669 100%)' }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              This is Legitimate
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>
            Explanation
          </h3>
          <div className="card" style={{ 
            background: selectedAnswer === (currentEmailData.isPhishing ? 'phishing' : 'legitimate') 
              ? 'rgba(34,197,94,0.1)' 
              : 'rgba(248,113,113,0.1)',
            borderColor: selectedAnswer === (currentEmailData.isPhishing ? 'phishing' : 'legitimate') 
              ? 'var(--ok)' 
              : 'var(--warn)'
          }}>
            <p style={{ 
              margin: '0 0 8px', 
              fontWeight: '600',
              color: selectedAnswer === (currentEmailData.isPhishing ? 'phishing' : 'legitimate') 
                ? 'var(--ok)' 
                : 'var(--warn)'
            }}>
              {selectedAnswer === (currentEmailData.isPhishing ? 'phishing' : 'legitimate') ? '✅ Correct!' : '❌ Incorrect!'}
            </p>
            <p className="subtitle" style={{ fontSize: '13px', lineHeight: '1.4' }}>
              {currentEmailData.explanation}
            </p>
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
            {currentEmail < phishingEmails.length - 1 ? 'Next Email' : 'Finish Game'}
          </button>
        )}
        <button className="cta secondary" onClick={handleBack}>
          Back to Intro
        </button>
      </div>
    </>
  );
}
