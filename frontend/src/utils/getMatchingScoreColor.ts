export default function getRiskScoreColor (score: number): string  {
  if (score <= 20) return "text-green-600";
  if (score <= 40) return "text-blue-600";
  if (score <= 60) return "text-yellow-600";
  return "text-red-600";
};