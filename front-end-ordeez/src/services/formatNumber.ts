export function formatNumber(num: number): string {
  if (num < 10000) {
    return num.toString();
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(2)}K+`;
  } else if (num < 1000000000) {
    return `${(num / 1000000).toFixed(2)}M+`;
  } else if (num < 1000000000000) {
    return `${(num / 1000000000).toFixed(2)}B+`;
  } else {
    return `${(num / 1000000000000).toFixed(2)}T+`;
  }
}
