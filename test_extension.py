import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# Path to the ChromeDriver
CHROMEDRIVER_PATH = '/opt/homebrew/bin/chromedriver'

# Path to the extension directory
EXTENSION_PATH = '/Users/mad/Downloads/Highlight Prices Extension v9'

# Path to the test HTML file
TEST_HTML_PATH = '/Users/mad/Downloads/Highlight Prices Extension v9/test_page.html'

# Configure Chrome options to load the extension
chrome_options = Options()
chrome_options.add_argument(f'--load-extension={EXTENSION_PATH}')

# Initialize the WebDriver
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    # Open the test HTML file
    driver.get(f'file://{TEST_HTML_PATH}')
    time.sleep(3)  # Wait for the extension to run

    # Check for highlighted prices
    highlighted_elements = driver.find_elements(By.XPATH, "//span[@style='background-color: yellow; color: red;']")

    # Collect the highlighted text
    highlighted_texts = [element.text for element in highlighted_elements]

    # Expected prices
    expected_prices = ['$123.45', '€99.99', '£12.34', '¥1,234', '₹56.78', '10$', '10eur']

    # Check if all expected prices are highlighted
    for price in expected_prices:
        if price in highlighted_texts:
            print(f"Price '{price}' is highlighted correctly.")
        else:
            print(f"Price '{price}' is NOT highlighted correctly.")

finally:
    # Close the browser
    driver.quit()
