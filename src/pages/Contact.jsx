import { useState } from 'react'

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = 'Please enter a valid email.'
    if (form.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      setForm(initialForm)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-latte bg-white px-4 py-3 outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/30'

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <h1 className="font-display text-4xl font-bold">Get in touch</h1>
      <p className="mt-3 text-roast">
        Questions, feedback, or catering enquiries? We'd love to hear from you.
      </p>

      {submitted && (
        <div className="mt-6 rounded-lg bg-green-100 px-4 py-3 text-green-800">
          Thanks! Your message has been sent. We'll reply soon.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="font-medium">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-caramel px-8 py-3 font-medium text-white transition hover:bg-roast"
        >
          Send Message
        </button>
      </form>
    </section>
  )
}