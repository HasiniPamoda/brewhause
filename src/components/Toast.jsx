import { useCart } from '../context/useCart'

export default function Toast() {
  const { toast } = useCart()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
    >
      {toast && (
        <div
          key={toast.id}
          className="rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream shadow-lg"
        >
          ✓ {toast.text}
        </div>
      )}
    </div>
  )
}
