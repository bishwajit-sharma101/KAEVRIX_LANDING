import { useState, useEffect } from "react";
import * as sound from "../../../utils/audio";
import { ENHANCED_CLASSES } from "../constants";

export function useCharacterCarousel(selectedClassId, setSelectedClassId, authMode, signUpStep) {
  const [carouselDir, setCarouselDir] = useState(null);
  const selectedClassIdx = ENHANCED_CLASSES.findIndex(c => c.id === selectedClassId);

  const navigateCarousel = (dir) => {
    sound.playClockTick(true);
    setCarouselDir(dir);
    setTimeout(() => {
      if (dir === 'right') {
        const nextIdx = (selectedClassIdx + 1) % ENHANCED_CLASSES.length;
        setSelectedClassId(ENHANCED_CLASSES[nextIdx].id);
      } else {
        const prevIdx = (selectedClassIdx - 1 + ENHANCED_CLASSES.length) % ENHANCED_CLASSES.length;
        setSelectedClassId(ENHANCED_CLASSES[prevIdx].id);
      }
      setCarouselDir(null);
    }, 180);
  };

  useEffect(() => {
    if (authMode !== 'signup' || signUpStep !== 1) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') navigateCarousel('left');
      if (e.key === 'ArrowRight') navigateCarousel('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authMode, signUpStep, selectedClassIdx]);

  return {
    selectedClassIdx,
    carouselDir,
    navigateCarousel
  };
}
