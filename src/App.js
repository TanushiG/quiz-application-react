import React, { useState, useEffect } from 'react';
import questionBank from './question.json'
import "./styles.css";

export default function App() {
  const [showCategory, setShowCategory] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [enableQuiz, setEnableQuiz] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer for each question

  const [score, setScore] = useState(0);
  const [isScoreHigh, setIsScoreHigh] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (enableQuiz) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            handleNextQuestion();
            return 10;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [enableQuiz, currentQuestionIndex]);

  const handleCategorySelection = (category) => {
    setCurrentCategory(category);
    setEnableQuiz(true);
  }

  const startQuiz = () => {
    setShowCategory(false);
  }

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentCategory?.questions?.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeLeft(10);
    } else {
      setEnableQuiz(false);
      if ((score / currentCategory?.questions?.length) > 0.5) {
        setIsScoreHigh(true);
      } else {
        setIsScoreHigh(false);
      }
      setShowScore(true);
    }
  };

  const handleAnswerOptionClick = (selectedOption) => {
    if (selectedOption.charAt(0) === currentCategory?.questions?.[currentQuestionIndex]?.correctAnswer) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  return (
    <div className="App">
      {
        showScore ? (
          <>
            {isScoreHigh ? <div className="high-score">Congratulations</div> : <div className="low-score">Keep Practicing</div>}
            <div className="score-section">
              Your score {(score / currentCategory?.questions?.length).toFixed(2) * 100} %
            </div>
            <div className="score-section">
              You scored {score} out of {currentCategory?.questions?.length}
            </div>
          </>
        ) : (
          <>
            {showCategory ? (
              <>
                <div className="welcome-heading">
                  <span className="welcome-heading-text">Welcome to </span>
                  <span className="welcome-heading-quiz">Quiz</span>
                  <span className="welcome-heading-mania">Mania</span>
                </div>
                <div className="welcome-form-container">
                  <div className="welcome-form">
                    <div className="welcome-info">
                      <div className="welcome-info-text">Please read all the rules about this quiz before you start.</div>
                      <div className="welcome-info-rules">Quiz Rules</div>
                    </div>
                    <div className="welcome-name">
                      <div className="welcome-name-label">Full Name</div>
                      <input className="welcome-name-input" type="text" placeholder="Full Name" />
                    </div>
                    <div className="question-section">
                      <div className="question-text">Please select topic to continue</div>
                    </div>
                    <div className="answer-section">
                      {questionBank?.categories?.map((cat, index) => (
                        <button onClick={() => handleCategorySelection(cat)} key={"cat_" + index}>{cat?.name}</button>
                      ))}
                    </div>
                    <div className="action-button"><button onClick={() => startQuiz()}>Start Quiz</button></div>
                  </div>
                </div>
              </>) : (
              <div className="question-form">
                <div className="question-section">
                  <div>
                    <span className="question-count">{currentQuestionIndex + 1}/{currentCategory?.questions?.length}</span>
                    <span className="timer">{timeLeft}</span>
                  </div>
                  <div className="question-text">{currentCategory?.questions?.[currentQuestionIndex]?.question}</div>
                </div>
                <div className="answer-section">
                  {currentCategory?.questions?.[currentQuestionIndex]?.options.map((option, index) => (
                    <button onClick={() => handleAnswerOptionClick(option)} key={"option_" + index}>{option}</button>
                  ))}
                </div>
                <div className="action-button"><button onClick={() => handleAnswerOptionClick()}>Next</button></div>
              </div>)}
          </>

        )}
    </div>
  );
}
