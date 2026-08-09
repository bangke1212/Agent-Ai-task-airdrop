import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncateAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function getTaskTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    connect_wallet: "🔌",
    follow_twitter: "🐦",
    join_telegram: "✈️",
    join_discord: "💬",
    retweet: "🔄",
    like_tweet: "❤️",
    comment: "💭",
    daily_checkin: "📅",
    swap: "💱",
    bridge: "🌉",
    stake: "🥩",
    mint: "🪙",
    custom: "⚙️",
  };
  return icons[type] || "📋";
}
