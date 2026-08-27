"use client";

import { useEffect, useState } from "react";

interface WelcomeGreetingProps {
  name: string;
  initialGreeting: string;
}

export default function WelcomeGreeting({ name, initialGreeting }: WelcomeGreetingProps) {
  const [greeting, setGreeting] = useState(initialGreeting);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleRestartTour = () => {
    window.dispatchEvent(new Event("ledgerlite-tour-restart"));
  };

  return (
    <div className="flex justify-between items-center w-full flex-wrap gap-2">
      <h1 className="text-2xl font-bold text-[#032523]">
        {greeting}, <span className="text-[#0B7A75]">{name}</span>
      </h1>
      <button
        type="button"
        onClick={handleRestartTour}
        className="text-xs bg-slate-100 hover:bg-[#0B7A75]/10 text-slate-600 hover:text-[#0B7A75] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0B7A75]/25 transition duration-150 cursor-pointer flex items-center gap-1.5 font-medium"
      >
        <span>💡 Need Help? Run Tour</span>
      </button>
    </div>
  );
}
