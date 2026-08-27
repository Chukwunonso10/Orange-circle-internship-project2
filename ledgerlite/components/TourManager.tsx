"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EventData, STATUS } from "react-joyride";

// Dynamically import Joyride with SSR turned off to prevent Next.js server pre-rendering hydration failures
const Joyride = dynamic(
  () => import("react-joyride").then((mod) => mod.Joyride),
  { ssr: false }
);

interface TourManagerProps {
  steps: any[];
}

export default function TourManager({ steps }: TourManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [run, setRun] = useState(false);

  // Guard to ensure component is fully mounted in the client browser
  useEffect(() => {
    setMounted(true);
    
    // Auto-run the tour if the user has not completed it yet
    const completed = localStorage.getItem("ledgerlite_onboarding_completed");
    if (!completed) {
      setRun(true);
    }
  }, []);

  // Listen for manual restart requests from other components (like WelcomeGreeting)
  useEffect(() => {
    const handleRestart = () => {
      localStorage.removeItem("ledgerlite_onboarding_completed");
      setRun(true);
    };
    
    window.addEventListener("ledgerlite-tour-restart", handleRestart);
    return () => {
      window.removeEventListener("ledgerlite-tour-restart", handleRestart);
    };
  }, []);

  if (!mounted) return null;

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // If tour finished or skipped, trigger completion state save
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("ledgerlite_onboarding_completed", "true");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true} // Enables Next buttons instead of forcing user clicks on beacons
      onEvent={handleJoyrideCallback}
      locale={{
        last: "Finish",
        skip: "Skip",
      }}
      options={{
        // Customizing popup styling with LedgerLite's palette
        arrowColor: "#ffffff",
        backgroundColor: "#ffffff",
        overlayColor: "rgba(15, 23, 42, 0.4)", // Translucent dark overlay matching backdrop filter
        primaryColor: "#0B7A75", // Teal accent color matching logo
        textColor: "#1e293b", // Slate 800
        zIndex: 1000,
        showProgress: true, // Shows step index indicators, e.g. "1 of 6"
        buttons: ["back", "close", "primary", "skip"], // Enables Back, Close, Next, and Skip buttons
      }}
      styles={{
        buttonClose: {
          color: "#94a3b8",
        },
        buttonPrimary: {
          borderRadius: "12px",
          fontWeight: 600,
          padding: "8px 16px",
          fontSize: "13px",
          color: "#ffffff",
        },
        buttonBack: {
          color: "#64748b",
          marginRight: "8px",
          fontSize: "13px",
        },
        buttonSkip: {
          color: "#64748b",
          fontSize: "13px",
        },
        tooltip: {
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "20px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipTitle: {
          fontSize: "16px",
          fontWeight: 700,
          color: "#0f172a", // Slate 900
          marginBottom: "8px",
        },
        tooltipContent: {
          fontSize: "14px",
          color: "#475569", // Slate 600
          padding: "0",
        },
      }}
    />
  );
}
