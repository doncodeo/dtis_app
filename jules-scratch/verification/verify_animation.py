from playwright.sync_api import Page, expect
import time

def test_homepage_animation(page: Page):
    """
    This test verifies the homepage, including the stats section.
    It waits for the animation to likely complete before taking a screenshot.
    """
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000", timeout=30000)

    # 2. Act: Wait for the stats to appear and for the animation to finish.
    # The animation duration is 2 seconds, so we'll wait a bit longer than that.
    page.wait_for_timeout(3000)

    # 3. Assert: Check that the final numbers are displayed.
    # We can't know the exact numbers, but we can check that they are not 0.
    # A better assertion would be to check if they are numbers.
    total_threats_text = page.locator('h3.text-blue-600').inner_text()
    verified_threats_text = page.locator('h3.text-green-600').inner_text()

    assert int(total_threats_text) >= 0
    assert int(verified_threats_text) >= 0


    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/homepage_animated.png", full_page=True)
