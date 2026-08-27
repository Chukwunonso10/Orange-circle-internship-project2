"use client";

import { useState, useEffect } from "react";

export function useTour(tourKey: string = "ledgerlite_onboarding_completed") {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Prevent execution during SSR
    if (typeof window === "undefined") return;

    // Check if user has already completed this tour
    const completed = localStorage.getItem(tourKey);
    if (!completed) {
      setRun(true);
    }
  }, [tourKey]);

  const completeTour = () => {
    setRun(false);
    localStorage.setItem(tourKey, "true");
  };

  const restartTour = () => {
    localStorage.removeItem(tourKey);
    setRun(true);
  };

  return {
    run,
    setRun,
    completeTour,
    restartTour,
  };
}
