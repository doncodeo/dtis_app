from playwright.sync_api import Page, expect
import time

def test_homepage_news(page: Page):
    """
    This test verifies the homepage, including the Latest News section with mock data.
    """
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000", timeout=30000)

    # 2. Act: Wait for the news articles to be visible.
    # We'll wait for the first "Read more" link to appear.
    expect(page.get_by_role("link", name="Read more →").first).to_be_visible(timeout=15000)

    # 3. Assert: Check that there are 5 articles displayed.
    article_links = page.get_by_role("link", name="Read more →")
    expect(article_links).to_have_count(5)

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/homepage_news.png", full_page=True)
