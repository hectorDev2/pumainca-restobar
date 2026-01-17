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
        # -> Input admin email and password, then click login button to access admin dashboard
        frame = context.pages[-1]
        # Input admin email
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('polbarazorda@gmail.com')
        

        frame = context.pages[-1]
        # Input admin password
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin1')
        

        frame = context.pages[-1]
        # Click login button to submit credentials
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify sidebar links are clickable and navigate to correct pages, starting with 'Pedidos'
        frame = context.pages[-1]
        # Click 'Pedidos' sidebar link to verify navigation
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Ajustes' sidebar link to verify navigation
        frame = context.pages[-1]
        # Click 'Ajustes' sidebar link to verify navigation
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Reservas' sidebar link to verify navigation and content load
        frame = context.pages[-1]
        # Click 'Reservas' sidebar link to verify navigation
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Contenido' sidebar link to verify navigation and content load
        frame = context.pages[-1]
        # Click 'Contenido' sidebar link to verify navigation
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify top navigation links are clickable and navigate to correct pages, starting with 'Dashboard'
        frame = context.pages[-1]
        # Click 'Dashboard' top navigation link to verify navigation
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize browser window to mobile size and verify responsive layout and usability of navigation elements
        await page.goto('http://localhost:3000/admin', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        frame = context.pages[-1]
        # Click 'Salir' button to test logout functionality after responsive tests
        elem = frame.locator('xpath=html/body/div[2]/header/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input admin email and password, then click login button to access admin dashboard for responsive testing
        frame = context.pages[-1]
        # Input admin email
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('polbarazorda@gmail.com')
        

        frame = context.pages[-1]
        # Input admin password
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin1')
        

        frame = context.pages[-1]
        # Click login button to submit credentials
        elem = frame.locator('xpath=html/body/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize browser window to tablet size and verify responsive layout and usability of navigation elements
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Resize browser window to tablet size and verify responsive layout and usability of navigation elements
        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        frame = context.pages[-1]
        # Click 'Pedidos' sidebar link to verify navigation and responsive layout on tablet size
        elem = frame.locator('xpath=html/body/div[2]/header/div/div/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize browser window to mobile size and verify responsive layout and usability of navigation elements
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Resize browser window to mobile size and verify responsive layout and usability of navigation elements
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Verify interactive elements on 'Pedidos' page such as 'Ver detalles' and 'Cancelar pedido' buttons for usability on mobile
        frame = context.pages[-1]
        # Click 'Ver detalles' button on first order to verify details view on mobile
        elem = frame.locator('xpath=html/body/div[2]/main/section/div[2]/div/table/tbody/tr/td[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Close the order details modal and verify the 'Cancelar pedido' button functionality on mobile view
        frame = context.pages[-1]
        # Close the order details modal by clicking the close button
        elem = frame.locator('xpath=html/body/div[2]/main/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pedidos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ajustes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reservas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contenido').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=polbarazorda@gmail.com').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Salir').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Lista de pedidos recibidos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Todos estados').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=pending').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=confirmed').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=completed').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=cancelled').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Todos pagos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total pedidos: -').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PED202601178316').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=invalid-email-format12345').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1/17/2026, 12:37:06 AM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pendiente').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=S/. 0.00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Confirmado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Completado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cancelado').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PED202601162370').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=hector barazorda+51943834699').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1/16/2026, 5:43:52 PM').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    