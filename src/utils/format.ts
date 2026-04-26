import { Money } from '../types';

const localeForCurrency: Record<Money['currency'], string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AED: 'en-AE',
};

const symbolForCurrency: Record<Money['currency'], string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
};

export const formatMoney = (money: Money): string => {
  const symbol = symbolForCurrency[money.currency];
  const amount = money.amount.toLocaleString(localeForCurrency[money.currency], {
    minimumFractionDigits: money.currency === 'INR' ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${amount}`;
};

export const formatCompactNumber = (n: number): string => {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
};

export const formatRelativeTime = (iso: string): string => {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const week = Math.floor(day / 7);
  if (week < 4) return `${week}w ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo ago`;
  const year = Math.floor(day / 365);
  return `${year}y ago`;
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const truncate = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max - 1)}…` : str;

export const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

export const padNumber = (n: number, width = 2) => `${n}`.padStart(width, '0');

export const calculateDiscount = (original: Money, current: Money): number => {
  if (original.amount <= 0) return 0;
  return Math.round(((original.amount - current.amount) / original.amount) * 100);
};

export const formatPincode = (pincode: string): string =>
  pincode.replace(/(\d{3})(\d{3})/, '$1 $2');

export const formatCardNumber = (raw: string): string =>
  raw
    .replace(/\D/g, '')
    .match(/.{1,4}/g)
    ?.join(' ') ?? '';

export const stripPrefix = (s: string, prefix: string) =>
  s.startsWith(prefix) ? s.slice(prefix.length) : s;

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
