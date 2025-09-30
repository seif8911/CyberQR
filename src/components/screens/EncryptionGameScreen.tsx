'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/firebase';
import { 
  ArrowLeft,
  Timer,
  Lightbulb,
  SkipForward,
  Eye,
  Lock,
  Trophy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Level {
  id: number;
  title: string;
  scenario: string;
  image: string;
  encryptedText: string;
  correctAnswer: string;
  hints: string[];
  timeSeconds: number;
  basePoints: number;
  hintCost: { points: number; time: number };
  maxAttempts: number;
}

const levels: Level[] = [
  {
    id: 1,
    title: "File 1 — Welcome Note",
    scenario: "Found in the Desktop folder, appears to be the hacker's entry message.",
    image: "/level-1-file.jpg",
    encryptedText: "KHOOR",
    correctAnswer: "HELLO",
    hints: ["Try shift 3", "H becomes K when shifted forward by 3"],
    timeSeconds: 300,
    basePoints: 10,
    hintCost: { points: 3, time: 10 },
    maxAttempts: 5
  },
  {
    id: 2,
    title: "File 2 — Meeting Notes",
    scenario: "Located in Documents/Personal, mentions a meeting location.",
    image: "/level-2-desktop.jpg",
    encryptedText: "PHHW DW FDIH",
    correctAnswer: "MEET AT CAFE",
    hints: ["Same shift as previous", "Shift back by 3"],
    timeSeconds: 300,
    basePoints: 10,
    hintCost: { points: 3, time: 10 },
    maxAttempts: 5
  },
  {
    id: 3,
    title: "File 3 — Email Draft",
    scenario: "Draft email found in temp folder, never sent but contains plans.",
    image: "/level-3-email.jpg",
    encryptedText: "SODQ LV UHDGB",
    correctAnswer: "PLAN IS READY",
    hints: ["Try shift 3 again", "Same pattern as before"],
    timeSeconds: 300,
    basePoints: 10,
    hintCost: { points: 3, time: 10 },
    maxAttempts: 5
  },
  {
    id: 4,
    title: "File 4 — Chat Backup",
    scenario: "Encrypted chat messages from secure messaging app backup.",
    image: "/level-4-messages.jpg",
    encryptedText: "XEVKIX MW FERQ QEREKIV NSLR",
    correctAnswer: "TARGET IS BANK MANAGER JOHN",
    hints: ["Try shift 4", "X becomes T when shifted back by 4"],
    timeSeconds: 300,
    basePoints: 10,
    hintCost: { points: 3, time: 10 },
    maxAttempts: 5
  },
  {
    id: 5,
    title: "File 5 — Operations Log",
    scenario: "Found in hidden system folder, tracks operational timeline.",
    image: "/level-5-documents.jpg",
    encryptedText: "FHYNAFYJ GFHPITTU FY 3000",
    correctAnswer: "ACTIVATE BACKDOOR AT 3000",
    hints: ["Numbers stay the same", "Try shift 6"],
    timeSeconds: 300,
    basePoints: 10,
    hintCost: { points: 3, time: 10 },
    maxAttempts: 5
  }
];

export default function EncryptionGameScreen() {
  const { setCurrentScreen, addXP, unlockBadge, user, refreshUserData } = useAppStore();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedShift, setSelectedShift] = useState(1);
  const [timeLeft, setTimeLeft] = useState(levels[0].timeSeconds);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [evidenceFragments, setEvidenceFragments] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isLocked && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isLocked && !gameCompleted) {
      handleTimeout();
    }
  }, [timeLeft, isLocked, gameCompleted]);

  // Initialize timer when level changes
  useEffect(() => {
    if (currentLevel < levels.length && !gameCompleted) {
      setTimeLeft(levels[currentLevel].timeSeconds);
      setUserInput("");
      setAttempts(0);
      setHintsUsed(0);
      setFeedback("");
      setIsLocked(false);
    }
  }, [currentLevel, gameCompleted]);

  const caesarDecrypt = (text: string, shift: number): string => {
    return text
      .split('')
      .map(char => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        } else if (char.match(/[a-z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const generateShiftedAlphabet = (shift: number): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => 
      String.fromCharCode(((letter.charCodeAt(0) - 65 + shift) % 26) + 65)
    ).join(' ');
  };

  const getEvidenceFragment = (levelId: number): string => {
    const fragments = [
      "Hacker's welcome message confirmed",
      "Meeting location: downtown cafe",
      "Attack plan is ready",
      "Target: bank manager John",
      "Backdoor activation at 3AM"
    ];
    return fragments[levelId - 1] || "Evidence fragment recovered";
  };

  const handleTimeout = useCallback(() => {
    setIsLocked(true);
    const result = {
      level: currentLevel + 1,
      points: 0,
      timeTaken: levels[currentLevel].timeSeconds,
      hintsUsed,
      attempts,
      status: 'timeout',
      correctAnswer: levels[currentLevel].correctAnswer
    };
    setGameResults(prev => [...prev, result]);
    setFeedback(`Time's up! The correct answer was: ${levels[currentLevel].correctAnswer}`);
    
    toast.error("Time's Up! Moving to next file...");
    setTimeout(() => nextLevel(), 3000);
  }, [currentLevel, hintsUsed, attempts]);

  const handleSubmit = () => {
    if (isLocked || userInput.trim() === "") return;

    const currentLevelData = levels[currentLevel];
    const isCorrect = userInput.toUpperCase().trim() === currentLevelData.correctAnswer;

    if (isCorrect) {
      const points = currentLevelData.basePoints;
      setScore(prev => prev + points);
      setIsLocked(true);
      
      const evidenceFragment = getEvidenceFragment(currentLevel + 1);
      setEvidenceFragments(prev => [...prev, evidenceFragment]);
      
      const result = {
        level: currentLevel + 1,
        points,
        timeTaken: currentLevelData.timeSeconds - timeLeft,
        hintsUsed,
        attempts: attempts + 1,
        status: 'success',
        correctAnswer: currentLevelData.correctAnswer,
        evidence: evidenceFragment
      };
      setGameResults(prev => [...prev, result]);
      
      setFeedback(`Decrypted successfully! File unlocked. Evidence: ${evidenceFragment}`);
      
      toast.success(`File Decrypted! Evidence recovered: ${evidenceFragment}`);
      setTimeout(() => nextLevel(), 3000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= currentLevelData.maxAttempts) {
        setIsLocked(true);
        const result = {
          level: currentLevel + 1,
          points: 0,
          timeTaken: currentLevelData.timeSeconds - timeLeft,
          hintsUsed,
          attempts: newAttempts,
          status: 'failed',
          correctAnswer: currentLevelData.correctAnswer
        };
        setGameResults(prev => [...prev, result]);
        setFeedback(`Maximum attempts reached. The correct answer was: ${currentLevelData.correctAnswer}`);
        setTimeout(() => nextLevel(), 3000);
      } else {
        setFeedback(`Decryption failed. File remains locked. Attempts left: ${currentLevelData.maxAttempts - newAttempts}. Remember: weak encryption allows hackers to succeed.`);
      }
    }
  };

  const handleHint = (hintIndex: number) => {
    if (isLocked || hintsUsed > hintIndex) return;
    
    const currentLevelData = levels[currentLevel];
    const hint = currentLevelData.hints[hintIndex];
    
    setScore(prev => prev - currentLevelData.hintCost.points);
    setTimeLeft(prev => Math.max(0, prev - currentLevelData.hintCost.time));
    setHintsUsed(hintIndex + 1);
    
    toast(`Hint ${hintIndex + 1}: ${hint}`);
  };

  const handleSkip = () => {
    setIsLocked(true);
    const result = {
      level: currentLevel + 1,
      points: 0,
      timeTaken: levels[currentLevel].timeSeconds - timeLeft,
      hintsUsed,
      attempts,
      status: 'skipped',
      correctAnswer: levels[currentLevel].correctAnswer
    };
    setGameResults(prev => [...prev, result]);
    setFeedback(`Skipped. The correct answer was: ${levels[currentLevel].correctAnswer}`);
    setTimeout(() => nextLevel(), 2000);
  };

  const nextLevel = async () => {
    if (currentLevel + 1 >= levels.length) {
      setGameCompleted(true);
      
      const percentage = Math.round((score / (levels.length * 10)) * 100);
      
      // Save progress to Firebase
      if (user?.id) {
        try {
          const progressData = {
            completed: evidenceFragments.length,
            total: levels.length,
            score,
            percentage: percentage,
            lastPlayed: new Date().toISOString(),
            completedAt: new Date().toISOString()
          };
          
          await authService.saveChallengeProgress(user.id, 'encryption', progressData);
          
          // Award XP and badges
          if (percentage >= 80) {
            await addXP(30);
            await unlockBadge('crypto-detective');
            toast.success('🏆 Badge earned: Crypto Detective!');
          } else if (percentage >= 60) {
            await addXP(20);
            toast.success('Good job! You cracked the case.');
          } else {
            await addXP(10);
            toast('Keep practicing! Cryptanalysis takes skill.');
          }
          
          // Refresh user data to ensure UI is updated
          await refreshUserData();
          
        } catch (error) {
          console.error('Error saving encryption progress:', error);
          toast.error('Error saving progress. Please try again.');
        }
      }
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('encryption-progress', JSON.stringify({
        completed: evidenceFragments.length,
        total: levels.length,
        score,
        lastPlayed: new Date().toISOString()
      }));
    } else {
      setCurrentLevel(prev => prev + 1);
      setSelectedShift(1);
    }
  };

  const handleBack = () => {
    setCurrentScreen('encryption-intro');
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setUserInput("");
    setSelectedShift(1);
    setTimeLeft(levels[0].timeSeconds);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setFeedback("");
    setGameResults([]);
    setIsLocked(false);
    setEvidenceFragments([]);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const percentage = Math.round((score / (levels.length * 10)) * 100);
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
            You decrypted {evidenceFragments.length}/{levels.length} files and scored {score} points ({percentage}%)
          </p>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Evidence Recovered
          </h2>
          <div className="col" style={{ gap: '8px' }}>
            {evidenceFragments.map((fragment, index) => (
              <div key={index} className="row" style={{ gap: '8px', alignItems: 'center' }}>
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--ok)', minWidth: '16px' }} />
                <span className="subtitle" style={{ fontSize: '12px' }}>
                  {fragment}
                </span>
              </div>
            ))}
          </div>
        </div>

        {percentage >= 80 && (
          <div className="card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'var(--ok)' }}>
            <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
              <Trophy className="w-5 h-5" style={{ color: 'var(--ok)' }} />
              <strong style={{ color: 'var(--ok)' }}>Badge Unlocked: Crypto Detective</strong>
            </div>
            <p className="subtitle" style={{ marginTop: '8px', fontSize: '13px' }}>
              Excellent work! You've mastered the art of cryptanalysis.
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

  if (currentLevel >= levels.length) {
    return <div>Game Complete</div>;
  }

  const currentLevelData = levels[currentLevel];
  const progress = ((currentLevel + 1) / levels.length) * 100;

  return (
    <>
      <div className="topbar">
        <button className="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="chip">
          File {currentLevel + 1} of {levels.length}
        </div>
      </div>
      
      {/* Header */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>Digital Forensics Lab</h1>
          <div className="row" style={{ gap: '16px', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent-2)', fontWeight: '600' }}>Score: {score}</span>
            <div className="row" style={{ gap: '4px', alignItems: 'center' }}>
              <Timer className="w-4 h-4" />
              <span style={{ 
                fontFamily: 'ui-monospace', 
                color: timeLeft <= 30 ? 'var(--warn)' : 'var(--accent-2)',
                fontWeight: '600'
              }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px' }}>Progress: {currentLevel + 1}/{levels.length}</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-2)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Alphabet Helper */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Caesar Cipher Helper:</h3>
        <div className="col" style={{ gap: '4px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'ui-monospace' }}>
            Normal: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'ui-monospace', color: 'var(--accent-2)' }}>
            Shift {selectedShift}: {generateShiftedAlphabet(selectedShift)}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="col" style={{ gap: '12px', marginBottom: '18px' }}>
        {/* File Info */}
        <div className="card">
          <h2 style={{ margin: '0 0 8px', fontSize: '16px' }}>{currentLevelData.title}</h2>
          <img 
            src={currentLevelData.image} 
            alt={`Level ${currentLevel + 1} evidence`}
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              marginBottom: '8px',
              maxHeight: '200px',
              objectFit: 'cover'
            }}
          />
          <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
            {currentLevelData.scenario}
          </p>
        </div>

        {/* Encrypted Content */}
        <div className="card">
          <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Encrypted File Content:</h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '12px', 
            borderRadius: '8px', 
            fontFamily: 'ui-monospace', 
            color: 'var(--accent-2)', 
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {currentLevelData.encryptedText}
          </div>
        </div>

        {/* Shift Selection */}
        <div className="card">
          <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Select Caesar Shift:</h3>
          <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px' }}>Shift by:</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(Number(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '6px 8px',
                color: 'var(--text)',
                fontSize: '12px',
                fontFamily: 'ui-monospace'
              }}
              disabled={isLocked}
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map(shift => (
                <option key={shift} value={shift}>{shift} letters</option>
              ))}
            </select>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>letters</span>
          </div>
        </div>

        {/* Decryption Input */}
        <div className="card">
          <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Decryption Input:</h3>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter decrypted message here..."
            style={{
              width: '100%',
              height: '60px',
              padding: '8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text)',
              fontFamily: 'ui-monospace',
              fontSize: '12px',
              resize: 'none'
            }}
            disabled={isLocked}
          />
          <div className="row" style={{ gap: '8px', marginTop: '8px' }}>
            <button 
              className="cta" 
              onClick={handleSubmit}
              disabled={isLocked || userInput.trim() === ""}
              style={{ flex: 1 }}
            >
              Submit
            </button>
            <button 
              className="cta secondary"
              onClick={handleSkip}
              disabled={isLocked}
              style={{ minWidth: '80px' }}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hints */}
        <div className="card">
          <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Investigation Tools:</h3>
          <div className="col" style={{ gap: '6px' }}>
            {currentLevelData.hints.map((_, index) => (
              <button
                key={index}
                className="cta secondary"
                onClick={() => handleHint(index)}
                disabled={isLocked || hintsUsed > index}
                style={{ fontSize: '12px', padding: '8px 12px' }}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint {index + 1} 
                {hintsUsed > index ? ' (Used)' : ` (-${currentLevelData.hintCost.points}pts, -${currentLevelData.hintCost.time}s)`}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="card">
            <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>Analysis Result:</h3>
            <p className="subtitle" style={{ fontSize: '12px', lineHeight: '1.4' }}>
              {feedback}
            </p>
          </div>
        )}

        {/* Attempts Info */}
        <div className="card">
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Attempts: {attempts}/{currentLevelData.maxAttempts} | 
            Hints Used: {hintsUsed}/{currentLevelData.hints.length}
          </div>
        </div>
      </div>
    </>
  );
}
