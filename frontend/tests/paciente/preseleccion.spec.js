import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, navigateTo, PATIENT } from '../helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
  await loginAs(page, PATIENT)
})

test.describe('Preselección de turnos', () => {
  test('se puede preseleccionar un turno desde los resultados', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('button:has-text("Buscar todos")')
    await expect(page.locator('.result-card').first()).toBeVisible({ timeout: 15_000 })

    const preseleccionarBtn = page.locator('button:has-text("Preseleccionar turno")').first()
    await preseleccionarBtn.click({ timeout: 10_000 })

    await expect(page.locator('button:has-text("Quitar de preselección")').first()).toBeVisible({ timeout: 5_000 })
  })

  test('se puede quitar un turno de la preselección', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('button:has-text("Buscar todos")')
    await expect(page.locator('.result-card').first()).toBeVisible({ timeout: 15_000 })

    const preseleccionarBtn = page.locator('button:has-text("Preseleccionar turno")').first()
    await preseleccionarBtn.click({ timeout: 10_000 })

    const quitarBtn = page.locator('button:has-text("Quitar de preselección")').first()
    await expect(quitarBtn).toBeVisible({ timeout: 5_000 })
    await quitarBtn.click()

    await expect(page.locator('button:has-text("Preseleccionar turno")').first()).toBeVisible({ timeout: 5_000 })
  })

  test('preseleccionados aparecen en el carrito del header', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('button:has-text("Buscar todos")')
    await expect(page.locator('.result-card').first()).toBeVisible({ timeout: 15_000 })

    const preseleccionarBtn = page.locator('button:has-text("Preseleccionar turno")').first()
    await preseleccionarBtn.click({ timeout: 10_000 })

    const cartChip = page.locator('a.cart-chip')
    await expect(cartChip).toBeVisible()
  })

  test('página de preselección muestra los items seleccionados', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('button:has-text("Buscar todos")')
    await expect(page.locator('.result-card').first()).toBeVisible({ timeout: 15_000 })

    const preseleccionarBtn = page.locator('button:has-text("Preseleccionar turno")').first()
    await preseleccionarBtn.click({ timeout: 10_000 })

    await navigateTo(page, '/preseleccion')
    await expect(page.locator('button:has-text("Solicitar turnos")')).toBeVisible()
  })
})
