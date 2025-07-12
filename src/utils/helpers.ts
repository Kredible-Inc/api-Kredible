import { Request } from "express";

export function generateApiKey(): string {
  return (
    "sk_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function validateStellarAddress(address: string): boolean {
  // Basic Stellar address validation
  const stellarAddressRegex = /^G[A-Z2-7]{55}$/;
  return stellarAddressRegex.test(address);
}

export function getPlatformFromRequest(req: Request): any {
  return req["platform"];
}

export function formatScore(score: number): number {
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateUsagePercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

export function generateQueryId(): string {
  return "q_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}
