import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, PATIENT, DOCTOR } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
})

test.describe('Navegación', () => {
  test('página de inicio muestra el branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2:has-text("Bienvenido")').or(page.locator('#titulo-unico'))).toBeVisible()
  })

  test('ruta inexistente muestra 404', async ({ page }) => {
    await page.goto('/ruta-inexistente')
    await expect(page.locator('text=404').or(page.locator('h2:has-text("No encontrada")'))).toBeVisible()
  })

  test('header muestra link de ingresar para usuarios anónimos', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav a:has-text("Ingresar")')).toBeVisible()
  })

  test('paciente ve link a preselección en el header', async ({ page }) => {
    await loginAs(page, PATIENT)
    await expect(page.locator('nav:has-text("Preselección")')).toBeVisible()
  })

  test('médico ve link a médicos en el header', async ({ page }) => {
    await loginAs(page, DOCTOR)
    await expect(page.locator('nav a:has-text("Médicos")')).toBeVisible()
  })
})
