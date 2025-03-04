export function generateRandomTrafficData() {
  return Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    success: Math.floor(Math.random() * 1000),
    failed: Math.floor(Math.random() * 100),
  }))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return num.toString()
}

