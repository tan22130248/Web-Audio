import { useState, useCallback } from "react";

const DEFAULT_REQUIRED_VIEWS = 3;

export function useAdRequirement(requiredViews = DEFAULT_REQUIRED_VIEWS) {
  const [viewCount, setViewCount] = useState(0);

  const increment = useCallback(() => {
    setViewCount((prev) => prev + 1);
  }, []);

  const isUnlocked = viewCount >= requiredViews;
  const remaining = Math.max(0, requiredViews - viewCount);

  return {
    viewCount,
    requiredViews,
    isUnlocked,
    remaining,
    increment,
  };
}

export function shouldShowAds() {
  const email = localStorage.getItem("email");
  if (!email) return true;

  const planType = (localStorage.getItem("planType") || "FREE").toUpperCase();

  if (planType === "PREMIUM" || planType === "VIP") return false;

  return true;
}
