import type { PodiumPlace, SportEvent } from './types';

/**
 * Format a podium value for display in the UI.
 * Returns an empty string for rank-only events — UI can choose to
 * show "—" or just leave it blank.
 */
export function formatValue(event: SportEvent, value: PodiumPlace['value']): string {
  if (value === null || value === undefined) return '';
  switch (event.unit) {
    case 's':
      return `${(value as number).toFixed(2)}s`;
    case 'm':
      return `${(value as number).toFixed(2)}m`;
    case 'pts':
      return `${(value as number).toFixed(2)} pts`;
    case 'time':
      return value as string;
    case 'rank':
      return '';
  }
}
