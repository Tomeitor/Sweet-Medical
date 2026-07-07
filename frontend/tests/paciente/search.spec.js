import { test, expect } from '@playwright/test'
import { loginAs, clearAuthState, navigateTo, PATIENT } from '../helpers.js'

test.beforeEach(async ({ page }) => {
  await clearAuthState(page)
  await loginAs(page, PATIENT)
})

test.describe('Búsqueda de turnos', () => {
  test('muestra el formulario de búsqueda', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await expect(page.locator('.search-input')).toBeVisible()
    await expect(page.locator('button:has-text("Buscar todos")')).toBeVisible()
  })

  test('búsqueda por texto libre muestra resultados', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.fill('.search-input', 'Cardiologia')
    await page.click('button:has-text("Buscar")')
    await expect(page.locator('.results-section')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.result-card').first()).toBeVisible({ timeout: 10_000 })
  })

  test('búsqueda vacía muestra mensaje de sin resultados', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.fill('.search-input', 'zzzzzzzzzzzzzz')
    await page.click('button:has-text("Buscar")')
    await expect(page.locator('.empty-box')).toBeVisible({ timeout: 10_000 })
  })

  test('filtros avanzados se pueden abrir y cerrar', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('.filter-btn')
    await expect(page.locator('.filters-panel')).toBeVisible()
    await page.click('.filter-btn')
    await expect(page.locator('.filters-panel')).not.toBeVisible()
  })

  test('buscar todos los turnos sin filtros', async ({ page }) => {
    await navigateTo(page, '/buscar')
    await page.click('button:has-text("Buscar todos")')
    await expect(page.locator('.results-section')).toBeVisible({ timeout: 15_000 })
  })
})
