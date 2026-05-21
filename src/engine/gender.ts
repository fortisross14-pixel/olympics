import type { EventGender, SportEvent } from './types';

/**
 * Infer an event's gender from its name. Every event name in the
 * catalog starts with "Men's", "Women's", or "Mixed" — or in a few
 * cases a plain name (e.g. "Polo") which we treat as mixed.
 */
export function eventGender(event: SportEvent): EventGender {
  const n = event.name.toLowerCase();
  if (n.startsWith("women's") || n.startsWith('women ')) return 'W';
  if (n.startsWith("men's") || n.startsWith('men ')) return 'M';
  if (n.startsWith('mixed')) return 'mixed';
  // Plain-named events (rare, mostly demo sports) → mixed
  return 'mixed';
}
