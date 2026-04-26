import { AIQuickAction } from '../types';

            export const aiQuickReplies: AIQuickAction[] = [
  {
    "id": 'qa-1',
    "label": 'Track my order',
    "emoji": '📦',
    "prompt": 'Where is my latest order?',
  },
  {
    "id": 'qa-2',
    "label": 'Best deals today',
    "emoji": '🔥',
    "prompt": 'What are today\'s best deals?',
  },
  {
    "id": 'qa-3',
    "label": 'Help me pick a gift',
    "emoji": '🎁',
    "prompt": 'Help me pick a gift for my friend',
  },
  {
    "id": 'qa-4',
    "label": 'Sizing help',
    "emoji": '📏',
    "prompt": 'How does the sizing run on this brand?',
  },
  {
    "id": 'qa-5',
    "label": 'Return policy',
    "emoji": '↩️',
    "prompt": 'What\'s the return policy?',
  },
  {
    "id": 'qa-6',
    "label": 'Compare two products',
    "emoji": '⚖️',
    "prompt": 'Help me compare two products',
  },
  {
    "id": 'qa-7',
    "label": 'Outfit ideas',
    "emoji": '👗',
    "prompt": 'Build me an outfit for this season',
  },
  {
    "id": 'qa-8',
    "label": 'Gift cards',
    "emoji": '💳',
    "prompt": 'How do gift cards work?',
  },
];

            const keywordResponses: [string, string][] = [
  ['track', 'I just pinged Logistics — your latest order is on the move and should land tomorrow before 6PM. Want me to enable SMS updates?'],
  ['delivery', 'Most orders ship in 24h with free express delivery in metros. Tier-2 cities take 2–3 business days.'],
  ['return', 'Most items are returnable within 30 days. We pick up from your doorstep, no fees. Want me to start a return?'],
  ['size', 'Pro tip: this brand runs slightly small. Size up if you\'re between sizes — and the size chart is on the product page.'],
  ['gift', 'Tell me their vibe in 3 words and I\'ll pull together a curated gift bundle in your budget.'],
  ['deal', 'Today\'s biggest drops: 60% off sneakers, 40% off premium tech, and a flash 30% on home decor.'],
  ['sale', 'Spring Sale runs all week — bigger discounts unlock daily, peak savings on Sunday.'],
  ['compare', 'Drop the two product names and I\'ll line up specs, reviews and best-fit use cases for you.'],
  ['payment', 'We accept UPI, all major cards, EMI, gift cards and COD on most pin-codes.'],
  ['offer', 'Here are some active offers: 10% off on your first card payment, ₹100 cashback with HDFC, free shipping over ₹999.'],
];

            const fallbackResponses: string[] = [
  'Got it! Give me a sec while I sift through the catalogue and pull the right picks for you.',
  'Love that question — here\'s what I\'d consider before clicking buy.',
  'Quick mental model: shortlist by use-case → filter by budget → cross-check reviews. I\'ll do all three.',
  'Try the 60-30-10 rule: 60% staples, 30% statement, 10% wildcard. Helps build a wardrobe that feels personal.',
  'Two things to look at: warranty + returns. Both are generous on this catalogue, so you can experiment safely.',
  'Honestly? I\'d start with reviews. Filter to 3-star reviews — they always tell you the real trade-offs.',
];

            export const generateAIResponse = (input: string): string => {
              const text = input.toLowerCase();
              for (const [needle, reply] of keywordResponses) {
                if (text.includes(needle)) {
                  return reply;
                }
              }
              const idx = Math.floor(Math.random() * fallbackResponses.length);
              return fallbackResponses[idx];
            };
