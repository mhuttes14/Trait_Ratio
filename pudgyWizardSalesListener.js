const puppeteer = require('puppeteer');
const { OpenSeaStreamClient } = require('@opensea/stream-js');
const WebSocket = require('ws');

// Initialize the OpenSea Stream Client
const client = new OpenSeaStreamClient({
  token: 'YOUR_OPENSEA_API_KEY',  // Replace with your OpenSea API key
  connectOptions: {
    transport: WebSocket
  }
});

// Function to scrape the floor price from OpenSea Pro
async function scrapeOpenSeaProFloorPrice() {
  const url = 'https://pro.opensea.io/collection/pudgypenguins';  // URL for Pudgy Penguins on OpenSea Pro
  
  try {
    const browser = await puppeteer.launch({
      headless: true,  // Run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']  // Required for running in many cloud environments
    });
    
    const page = await browser.newPage();
    
    // Load the page and wait for it to fully load
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Extract the floor price from the <title> tag
    const floorPrice = await page.evaluate(() => {
      const title = document.title;  // Get the page title
      const match = title.match(/\d+(\.\d+)?/);  // Regex to match the floor price number
      return match ? parseFloat(match[0]) : null;  // Return the number as a float
    });

    await browser.close();

    return floorPrice;  // Return the floor price value

  } catch (error) {
    console.error('Error scraping OpenSea Pro:', error);
    return null;  // In case of an error, return null
  }
}

// Listen for "item_sold" events in the Pudgy Penguins collection
client.onItemSold({
  collection_slug: 'pudgy-penguins',  // OpenSea slug for Pudgy Penguins
  event: async (event) => {
    const { payload } = event;

    // Check for the "Head" trait and filter based on values
    const headTrait = payload.asset.traits.find(trait => trait.trait_type === 'Head');

    if (headTrait && (headTrait.value === 'Wizard Hat' || headTrait.value === 'None' || headTrait.value === 'Bowl Cut')) {
      console.log(`🎉 Sale of Pudgy Penguin with "Head: ${headTrait.value}"`);
      console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
      console.log(`Sale Time: ${new Date(payload.event_timestamp).toLocaleString()}`);

      // Fetch and log the current floor price
      const floorPrice = await scrapeOpenSeaProFloorPrice();
      if (floorPrice !== null) {
        console.log(`🛒 Current OpenSea Pro Floor Price for Pudgy Penguins: ${floorPrice} ETH`);
      } else {
        console.log('⚠️ Failed to retrieve floor price.');
      }

      console.log('---');
    }
  }
});
