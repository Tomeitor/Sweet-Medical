import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../src/auth/constants.js'

export const DEMO_PASSWORD = 'Demo123!'

export const PATIENT = {
  username: 'juan.perez',
  password: DEMO_PASSWORD,
  name: 'Juan Perez',
  role: 'PACIENTE',
}

export const DOCTOR = {
  username: 'ana.gomez',
  password: DEMO_PASSWORD,
  name: 'Dra. Ana Gomez',
  role: 'MEDICO',
}

export const INVALID_CREDENTIALS = {
  username: 'wrong.user',
  password: 'wrongpass',
}

export async function loginAs(page, { username, password }) {
  await page.goto('/login')
  await page.fill('input[type="text"]', username)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
}

export async function isLoggedIn(page, username) {
  await page.waitForSelector(`text=${username}`, { timeout: 10_000 })
}

export async function navigateTo(page, url) {
  await page.evaluate((href) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, url)
}

export async function clearAuthState(page) {
  await page.goto('/')
  await page.evaluate(([key, userKey]) => {
    localStorage.removeItem(key)
    localStorage.removeItem(userKey)
  }, [AUTH_TOKEN_KEY, AUTH_USER_KEY])
}
