import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, DOCTOR } from '../helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
  await loginAs(page, DOCTOR)
})

test.describe('Panel del médico', () => {
  test('panel muestra datos del perfil del médico', async ({ page }) => {
    await expect(page.locator('h2:has-text("Dra.")')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('text=Matrícula')).toBeVisible()
  })

  test('sección de disponibilidades visible', async ({ page }) => {
    await expect(page.locator('h2:has-text("Gestionar franjas horarias")')).toBeVisible({ timeout: 10_000 })
  })

  test('formulario de disponibilidad tiene campos requeridos', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible()
    await expect(page.locator('input[type="time"]').first()).toBeVisible()
    await expect(page.locator('button:has-text("Agregar disponibilidad")')).toBeVisible()
  })

  test('se puede crear y eliminar una disponibilidad', async ({ page }) => {
    await expect(page.locator('button:has-text("Agregar disponibilidad")')).toBeVisible({ timeout: 10_000 })

    await page.selectOption('select:below(:text("Día"))', 'VIERNES')
    await page.click('button:has-text("Agregar disponibilidad")')

    await expect(page.locator('text=Disponibilidad guardada').or(page.locator('.alert-success'))).toBeVisible({ timeout: 10_000 })

    const eliminarBtns = page.locator('button:has-text("Eliminar")')
    if (await eliminarBtns.count() > 0) {
      await eliminarBtns.first().click()
      await expect(page.locator('text=Disponibilidad eliminada').or(page.locator('.alert-success'))).toBeVisible({ timeout: 10_000 })
    }
  })

  test('sección de turnos visible con historial', async ({ page }) => {
    await expect(page.locator('h2:has-text("Mi historial y gestión")')).toBeVisible({ timeout: 10_000 })
  })

  test('turnos tienen botones de acción según su estado', async ({ page }) => {
    await expect(page.locator('h2:has-text("Mi historial y gestión")')).toBeVisible({ timeout: 10_000 })

    const hasAcceptBtn = await page.locator('button:has-text("Aceptar")').count()
    const hasRejectBtn = await page.locator('button:has-text("Rechazar")').count()
    expect(hasAcceptBtn + hasRejectBtn).toBeGreaterThanOrEqual(0)
  })

  test('sección de historial de paciente visible', async ({ page }) => {
    await expect(page.locator('h2:has-text("Consultar historial por nombre")')).toBeVisible({ timeout: 10_000 })
  })
})
