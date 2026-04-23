// Playwright fleet tests verifying the portfolio renders and behaves correctly
// across Chromium, Firefox, and Pixel 5 mobile viewport.
import { test, expect } from '@playwright/test'

test.describe('Portfolio — fleet tests', () => {
  test('page loads and displays hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Dhruv Rokkam.')).toBeVisible()
    await expect(page).toHaveTitle(/Portfolio/)
  })

  test('navbar contains all section links', async ({ page }) => {
    await page.goto('/')
    for (const label of ['about', 'education', 'skills', 'projects', 'experience', 'contact']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible()
    }
  })

  test('navbar gains scrolled class after scrolling', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 200))
    await expect(page.locator('nav')).toHaveClass(/nav--scrolled/)
  })

  test('smooth scroll navigates to projects section', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'projects' }).click()
    await expect(page.getByText('Med2Care')).toBeVisible()
    await expect(page.getByText('LeStat')).toBeVisible()
  })

  test('experience tabs switch content', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Nara Logics' }).click()
    await expect(page.getByText(/fuzzy matching/i)).toBeVisible()

    await page.getByRole('button', { name: 'HCLTech' }).click()
    await expect(page.getByText(/time series forecasting/i)).toBeVisible()
  })

  test('contact email link is correct', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /say hello/i }))
      .toHaveAttribute('href', 'mailto:rokkam.d@northeastern.edu')
  })

  test('GitHub social link is correct', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="https://github.com/d-rokkam2"]')).toBeVisible()
  })

  test('mobile viewport — hero is visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByText('Dhruv Rokkam.')).toBeVisible()
  })

  test('mobile viewport — nav links are visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'projects' })).toBeVisible()
  })

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })
})
