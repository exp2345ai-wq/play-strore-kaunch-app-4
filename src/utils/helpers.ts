import { Money, Product } from '../types';

export const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

export const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const sumMoney = (parts: Money[]): Money => {
  if (parts.length === 0) return { amount: 0, currency: 'INR' };
  return {
    amount: parts.reduce((a, b) => a + b.amount, 0),
    currency: parts[0].currency,
  };
};

export const multiplyMoney = (m: Money, factor: number): Money => ({
  amount: Math.round(m.amount * factor),
  currency: m.currency,
});

export const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
};

export const safeAvg = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
};

export const productMatchesQuery = (p: Product, q: string): boolean => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    p.title.toLowerCase().includes(needle) ||
    p.brand.toLowerCase().includes(needle) ||
    p.tags.some((t) => t.toLowerCase().includes(needle))
  );
};

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
