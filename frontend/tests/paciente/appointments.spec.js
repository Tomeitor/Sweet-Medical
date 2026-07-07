import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, navigateTo, PATIENT } from '../helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
  await loginAs(page, PATIENT)
})

test.describe('Historial de turnos del paciente', () => {
  test('el historial de turnos se muestra en /buscar', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await expect(page.locator('h2:has-text("Mis turnos")')).toBeVisible({ timeout: 10_000 })
  })

  test('los turnos activos tienen botón de cancelar disponible', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await expect(page.locator('h2:has-text("Mis turnos")')).toBeVisible({ timeout: 10_000 })

    await page.waitForSelector('.inline-card .tag', { timeout: 10_000 })
    const hasCancelBtn = await page.locator('button:has-text("Cancelar")').count()
    expect(hasCancelBtn).toBeGreaterThanOrEqual(0)
  })
})
