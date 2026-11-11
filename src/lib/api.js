const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(
  /\/$/,
  ''
)

// Small wrapper around fetch: adds the base URL, JSON headers and the login token,
// and turns server error messages into normal JavaScript errors.
export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(
      'Cannot reach the server. It may be waking up, so please try again in a moment.'
    )
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }

  return data
}
