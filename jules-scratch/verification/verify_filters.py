import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get the absolute path to the HTML file
        file_path = os.path.abspath("Perfeito_V2.html")

        # Go to the local HTML file
        await page.goto(f"file://{file_path}")

        # Wait for the page to load and initial filters to apply
        await page.wait_for_selector("#typesChart")

        # Select the "Corretiva" filter
        await page.select_option("#type-filter", "Corretiva")

        # Wait for the charts to update (we can wait for a specific element to change, but a small delay is simpler for this test)
        await page.wait_for_timeout(1000)

        # Take a screenshot of the entire dashboard to verify the filtered state
        await page.screenshot(path="jules-scratch/verification/filtered_dashboard.png")

        await browser.close()

asyncio.run(main())