import { useState, useEffect } from "react";

export function useTypewriter(activeQuestions, onboardingQ, signUpStep, authMode, pathfinderMode) {
  const [typedQuestion, setTypedQuestion] = useState("");
  const [isTypingQuestion, setIsTypingQuestion] = useState(false);

  useEffect(() => {
    if (authMode !== "signup" || signUpStep !== 2 || !pathfinderMode) return;
    const qText = activeQuestions[onboardingQ]?.question || "";
    setTypedQuestion("");
    setIsTypingQuestion(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < qText.length) {
        setTypedQuestion(qText.slice(0, i + 1));
        i++;
      } else {
        setIsTypingQuestion(false);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [onboardingQ, signUpStep, authMode, pathfinderMode, activeQuestions]);

  return { typedQuestion, isTypingQuestion };
}
