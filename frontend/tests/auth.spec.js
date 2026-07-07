import { test, expect } from '@playwright/test'
import { loginAs, isLoggedIn, clearAuthState, navigateTo, PATIENT, DOCTOR, INVALID_CREDENTIALS } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
})

test.describe('Autenticación', () => {
  test('login como paciente redirige a home', async ({ page }) => {
    await loginAs(page, PATIENT)
    await expect(page).toHaveURL('/')
    await isLoggedIn(page, PATIENT.username)
  })

  test('login como médico redirige a /medicos', async ({ page }) => {
    await loginAs(page, DOCTOR)
    await expect(page).toHaveURL('/medicos')
    await isLoggedIn(page, DOCTOR.username)
  })

  test('login con credenciales inválidas muestra error', async ({ page }) => {
    await loginAs(page, INVALID_CREDENTIALS)
    await expect(page.locator('.alert-error')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('logout limpia sesión y redirige a home', async ({ page }) => {
    await loginAs(page, PATIENT)
    await expect(page).toHaveURL('/')

    await page.click('button:has-text("Cerrar sesión")')
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Ingresar')).toBeVisible()
  })

  test('ruta protegida sin auth redirige a /login', async ({ page }) => {
    await page.goto('/buscar')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('h2:has-text("Iniciar sesión")')).toBeVisible()
  })

  test('ruta de rol incorrecto redirige a home', async ({ page }) => {
    await loginAs(page, PATIENT)
    await navigateTo(page, '/medicos')
    await expect(page).toHaveURL('/')
  })
})
