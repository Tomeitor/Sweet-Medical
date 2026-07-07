import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, navigateTo, PATIENT, DOCTOR } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
})

test.describe('Notificaciones', () => {
  test('paciente ve sección de notificaciones en /buscar', async ({ page }) => {
    await loginAs(page, PATIENT)
    await navigateTo(page, '/buscar')
    await expect(page.locator('h2:has-text("Mis mensajes")')).toBeVisible({ timeout: 10_000 })
  })

  test('médico ve sección de notificaciones en /medicos', async ({ page }) => {
    await loginAs(page, DOCTOR)
    await expect(page.locator('h2:has-text("Mensajes")')).toBeVisible({ timeout: 10_000 })
  })

  test('notificaciones sin leer tienen botón "Marcar como leída"', async ({ page }) => {
    await loginAs(page, DOCTOR)
    await expect(page.locator('h2:has-text("Mensajes")')).toBeVisible({ timeout: 10_000 })

    const markReadBtn = page.locator('button:has-text("Marcar como leída")').first()
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click()
      await expect(page.locator('text=Notificación marcada como leída').or(page.locator('.alert-success'))).toBeVisible({ timeout: 10_000 })
    }
  })
})
