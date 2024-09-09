const { OpenSeaStreamClient } = require("@opensea/stream-js");
const WebSocket = require("ws");
const puppeteer = require("puppeteer");

// Initialize the OpenSea Stream Client
const client = new OpenSeaStreamClient({
  token: "a0ebd2016e774dcb8214cae098636155",  // Replace with your actual OpenSea API key
  connectOptions: {
    transport: WebSocket,
  },
});

// Function to scrape the floor price from OpenSea Pro
async function scrapeOpenSeaProFloorPrice() {
  const url = "https://pro.opensea.io/collection/pudgypenguins";  // URL for Pudgy Penguins on OpenSea Pro

  try {
    const browser = await puppeteer.launch({
      headless: true,  // Run in headless mode
      args: ["--no-sandbox", "--disable-setuid-sandbox"],  // Required for running in many cloud environments
    });

    const page = await browser.newPage();

    // Load the page and wait for it to fully load
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extract the floor price from the <title> tag
    const floorPrice = await page.evaluate(() => {
      const title = document.title;  // Get the page title
      const match = title.match(/\d+(\.\d+)?/);  // Regex to match the floor price number
      return match ? parseFloat(match[0]) : null;  // Return the number as a float
    });

    await browser.close();

    // Return or log only the floor price number
    if (floorPrice) {
      console.log(`🛒 Current Floor Price: ${floorPrice} ETH`);
    } else {
      console.log("⚠️ Floor price not found in the page title!");
    }
  } catch (error) {
    console.error("Error scraping OpenSea Pro:", error);
  }
}

// Listen for "item_sold" events in the Pudgy Penguins collection
client.onItemSold({
  collection_slug: "pudgy-penguins",  // OpenSea slug for Pudgy Penguins
  event: async (event) => {
    const { payload } = event;

    // Log the full payload for inspection
    console.log("Event Payload:", JSON.stringify(payload, null, 2));

    // Check for the "Head" trait and filter based on values
    const headTrait = payload.asset.traits.find(
      (trait) => trait.trait_type === "Head"
    );

    if (headTrait) {
      // Log sales for "Wizard Hat", "None", and "Bowl Cut"
      if (
        headTrait.value === "Wizard Hat" ||
        headTrait.value === "None" ||
        headTrait.value === "Bowl Cut"
      ) {
        console.log(
          `🎉 Pudgy Penguin with "Head: ${headTrait.value}" trait sold!`
        );
        console.log(`Token ID: ${payload.asset.token_id}`);
        console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
        console.log(`Buyer: ${payload.winner_account.address}`);
        console.log(`Seller: ${payload.seller.address}`);

        // Call the function to scrape the floor price
        console.log("🔍 Scraping OpenSea Pro for current floor price...");
        await scrapeOpenSeaProFloorPrice();
      }
    }
  },
});
