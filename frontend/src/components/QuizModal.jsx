import React, { useState, useEffect } from 'react'
import { X, Trophy, RotateCcw, ChevronRight, Check, Zap, Sparkles } from 'lucide-react'
import { useAppStore } from '../services/store'
import { generateQuizQuestion } from '../services/api'
import {
  QUIZ_LEVELS,
  XP_PER_QUESTION,
  XP_EXTRA_QUESTION,
  RANKS,
  getRankForXp,
  getQuestionsForLevel
} from '../data/quizQuestions'
import './QuizModal.css'

const QuizModal = () => {
  const { isQuizOpen, closeQuiz, quizXp, addQuizXp, setQuizXp, resetQuizXp } = useAppStore()
  const [step, setStep] = useState('levels') // 'levels' | 'quiz' | 'result'
  const [currentLevel, setCurrentLevel] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [levelScore, setLevelScore] = useState(0)
  const [extraLoading, setExtraLoading] = useState(false)
  const [extraError, setExtraError] = useState(null)

  const rank = getRankForXp(quizXp)
  const rankIndex = RANKS.findIndex(r => r.id === rank.id)
  const nextRank = RANKS[rankIndex + 1]
  const xpProgress = nextRank
    ? Math.min(1, (quizXp - rank.minXp) / (nextRank.minXp - rank.minXp))
    : 1

  useEffect(() => {
    if (!isQuizOpen) {
      setStep('levels')
      setCurrentLevel(null)
      setSelectedAnswer(null)
      setAnswered(false)
      setExtraError(null)
      setExtraLoading(false)
    }
  }, [isQuizOpen])

  const handleSelectLevel = (levelId) => {
    const q = getQuestionsForLevel(levelId)
    setQuestions(q)
    setCurrentLevel(levelId)
    setCurrentIndex(0)
    setScore(0)
    setLevelScore(0)
    setStep('quiz')
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const handleAnswer = (optionIndex) => {
    if (answered) return
    setSelectedAnswer(optionIndex)
    setAnswered(true)
    const correct = optionIndex === questions[currentIndex].correctIndex
    if (correct) {
      const earned = currentLevel === 'extra' ? XP_EXTRA_QUESTION : XP_PER_QUESTION
      setLevelScore((s) => s + earned)
      addQuizXp(earned)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setStep(currentLevel === 'extra' ? 'extraResult' : 'result')
    }
  }

  const handleExtraQuestion = async () => {
    setExtraLoading(true)
    setExtraError(null)
    try {
      const data = await generateQuizQuestion()
      setQuestions([{
        question: data.question,
        options: data.options,
        correctIndex: data.correctIndex
      }])
      setCurrentLevel('extra')
      setCurrentIndex(0)
      setLevelScore(0)
      setSelectedAnswer(null)
      setAnswered(false)
      setStep('quiz')
    } catch (err) {
      setExtraError(err.response?.data?.detail || err.message || 'Failed to generate question')
    } finally {
      setExtraLoading(false)
    }
  }

  const handleResetXp = () => {
    if (window.confirm('Reset all experience and rank?')) {
      resetQuizXp()
    }
  }

  if (!isQuizOpen) return null

  return (
    <div className="quiz-modal-overlay" onClick={closeQuiz}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-modal-header">
          <div className="quiz-modal-title">
            <Trophy size={28} />
            <span>Political Navigator Quiz</span>
          </div>
          <div className="quiz-modal-xp">
            <div className="quiz-rank-badge">{rank.name}</div>
            <div className="quiz-xp-bar-wrap">
              <div className="quiz-xp-bar" style={{ width: `${Math.min(100, xpProgress * 100)}%` }} />
              <span className="quiz-xp-text">{quizXp} XP</span>
            </div>
          </div>
          <div className="quiz-modal-actions">
            <button type="button" className="quiz-btn-reset" onClick={handleResetXp} title="Reset experience">
              <RotateCcw size={18} />
              Reset
            </button>
            <button type="button" className="quiz-btn-close" onClick={closeQuiz} aria-label="Close">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="quiz-modal-body">
          {step === 'levels' && (
            <div className="quiz-levels">
              <h2>Choose level</h2>
              <p className="quiz-levels-hint">5 questions per level. +10 XP for each correct answer.</p>
              {QUIZ_LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  className="quiz-level-card"
                  onClick={() => handleSelectLevel(level.id)}
                >
                  <span className="quiz-level-name">{level.name}</span>
                  <span className="quiz-level-desc">{level.description}</span>
                  <ChevronRight size={20} />
                </button>
              ))}
              <div className="quiz-extra-section">
                <button
                  type="button"
                  className="quiz-extra-btn"
                  onClick={handleExtraQuestion}
                  disabled={extraLoading}
                >
                  <Sparkles size={20} />
                  {extraLoading ? 'Generating…' : 'Extra question (AI)'}
                </button>
                {extraError && <p className="quiz-extra-error">{extraError}</p>}
              </div>
            </div>
          )}

          {step === 'quiz' && questions.length > 0 && (
            <div className="quiz-play">
              <div className="quiz-progress">
                {currentLevel === 'extra' ? 'Extra question (AI)' : `Question ${currentIndex + 1} of ${questions.length}`}
              </div>
              <h2 className="quiz-question-text">{questions[currentIndex].question}</h2>
              <div className="quiz-options">
                {questions[currentIndex].options.map((opt, idx) => {
                  const correct = idx === questions[currentIndex].correctIndex
                  const chosen = selectedAnswer === idx
                  let stateClass = ''
                  if (answered) {
                    if (chosen && correct) stateClass = 'correct'
                    else if (chosen && !correct) stateClass = 'wrong'
                    else if (correct) stateClass = 'correct'
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`quiz-option ${stateClass}`}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                    >
                      {opt}
                      {answered && correct && <Check size={18} />}
                    </button>
                  )
                })}
              </div>
              {answered && (
                <button type="button" className="quiz-btn-next" onClick={handleNext}>
                  {currentLevel === 'extra' ? 'See result' : (currentIndex + 1 < questions.length ? 'Next' : 'Results')}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}

          {step === 'extraResult' && (
            <div className="quiz-result quiz-extra-result">
              <Zap size={48} className="quiz-result-icon" />
              <h2>Extra question</h2>
              <p className="quiz-result-score">
                {levelScore > 0 ? `Correct! +${XP_EXTRA_QUESTION} XP` : 'Incorrect'}
              </p>
              <p className="quiz-result-total">Total XP: {quizXp} — {getRankForXp(quizXp).name}</p>
              <div className="quiz-result-actions">
                <button type="button" className="quiz-btn-primary" onClick={handleExtraQuestion} disabled={extraLoading}>
                  {extraLoading ? 'Generating…' : 'Another extra question'}
                </button>
                <button type="button" className="quiz-btn-secondary" onClick={() => { setStep('levels'); setCurrentLevel(null); setExtraError(null); }}>
                  Back to levels
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="quiz-result">
              <Zap size={48} className="quiz-result-icon" />
              <h2>Level {currentLevel} complete</h2>
              <p className="quiz-result-score">
                Correct: {levelScore / XP_PER_QUESTION} of {questions.length}
              </p>
              <p className="quiz-result-xp">+{levelScore} XP for this level</p>
              <p className="quiz-result-total">Total XP: {quizXp} — {getRankForXp(quizXp).name}</p>
              <div className="quiz-result-actions">
                <button type="button" className="quiz-btn-primary" onClick={() => setStep('levels')}>
                  Choose another level
                </button>
                <button type="button" className="quiz-btn-secondary" onClick={closeQuiz}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizModal
