import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000/admin", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Input email and password and click login button
        frame = context.pages[-1]
        # Input admin email
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('polbarazorda@gmail.com')
        

        frame = context.pages[-1]
        # Input admin password
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin1')
        

        frame = context.pages[-1]
        # Click login button
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Pedidos' (Orders) to open orders management page and note current list and statuses
        frame = context.pages[-1]
        # Click on 'Pedidos' (Orders) navigation link to open orders management page
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Change the status of the order from 'Confirmado' to 'Cancelado' (Cancelled) to test real-time update
        frame = context.pages[-1]
        # Open status dropdown for the order to change status from Confirmado to Cancelado
        elem = frame.locator('xpath=html/body/div[2]/main/section/div[2]/div/table/tbody/tr/td[6]/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Manually refresh the page to verify if the updated status persists after refresh
        frame = context.pages[-1]
        # Click refresh button to reload orders list and verify if status update persists
        elem = frame.locator('xpath=html/body/div[2]/main/section/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to 'Reservas' (Reservations) page to perform similar status update and verify real-time UI update
        frame = context.pages[-1]
        # Click on 'Reservas' (Reservations) navigation link to open reservations management page
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Change the status of the first reservation from 'Confirmado' to 'Cancelado' to test real-time update
        frame = context.pages[-1]
        # Open status dropdown for the first reservation to change status from Confirmado to Cancelado
        elem = frame.locator('xpath=html/body/div[2]/main/div[2]/div/table/tbody/tr/td[7]/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Manually refresh the reservations page to verify if the updated status persists after refresh
        frame = context.pages[-1]
        # Click Buscar button to refresh reservations list and verify if status update persists
        elem = frame.locator('xpath=html/body/div[2]/main/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Pedidos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Confirmado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cancelado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reservas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Buscar por código o por email para ver el historial.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Buscar por email').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Filtrar').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Buscar por código').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Resultados').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Código').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nombre').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Email').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Fecha').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hora').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Personas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Acciones').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=RES202601164474').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=hector barazorda').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ph.barazorda@gmail.com').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2026-01-29').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=20:00:00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pendiente').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Confirmado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Completado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cancelado').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    