export default function StarDisplay({ value, className = 'text-lg' }) {
  const percent = (Math.max(0, Math.min(5, value)) / 5) * 100

  return (
    <span
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
      className={`relative inline-block leading-none ${className}`}
    >
      <span className="text-latte" aria-hidden="true">
        ★★★★★
      </span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-caramel"
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      >
        ★★★★★
      </span>
    </span>
  )
}