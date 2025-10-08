import asyncio
from playwright.async_api import async_playwright, expect
import os
from datetime import datetime, timedelta

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get the absolute path to the HTML file
        file_path = os.path.abspath("Perfeito_V2.html")

        # Go to the local HTML file
        await page.goto(f"file://{file_path}")

        # Go to the "Dados e Configurações" tab
        await page.get_by_text("Dados e Configurações").click()

        # Add a new part that needs replacement
        await page.get_by_role("button", name="Adicionar Peça").click()

        # Get the last row and fill it with data
        last_row = page.locator("#partsTable tbody tr:last-child")
        await last_row.locator('input[type="text"]').first.fill("Bomba de Alta Pressão")

        # Set the next change date to yesterday to trigger a "Replace" alert
        yesterday = datetime.now() - timedelta(days=1)
        await last_row.locator('input[type="date"]').fill(yesterday.strftime('%Y-%m-%d'))

        # Save the changes
        await page.get_by_role("button", name="Salvar Alterações").nth(0).click()

        # Go back to the Dashboard tab
        await page.get_by_text("Dashboard", exact=True).click()

        # Verify that the predictive alert is visible
        await expect(page.locator("#predictiveAlertsList li.status-replace")).to_be_visible()

        # Take a screenshot of the alerts section
        await page.locator(".predictive-alerts-section").screenshot(path="jules-scratch/verification/predictive_alert.png")

        # Go back to the "Dados e Configurações" tab to verify the health status in the table
        await page.get_by_text("Dados e Configurações").click()

        # Verify that the health status is "Substituir"
        await expect(last_row.locator(".health-status.status-replace")).to_have_text("Substituir")

        # Take a screenshot of the parts table
        await page.locator("#partsTable").screenshot(path="jules-scratch/verification/health_status.png")

        await browser.close()

asyncio.run(main())