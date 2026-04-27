// Utility formatters for the frontend

export const truncate = (str: string, max = 100): string =>
  str.length <= max ? str : str.slice(0, max) + '...';

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const bytesToMB = (bytes: number): string =>
  (bytes / (1024 * 1024)).toFixed(2) + ' MB';
