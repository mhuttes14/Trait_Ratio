const { OpenSeaStreamClient } = require('@opensea/stream-js');
const WebSocket = require('ws');

let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 5000;  // Wait 5 seconds before attempting to reconnect

// Function to initialize the OpenSea WebSocket connection
async function initializeOpenSeaClient() {
  try {
    console.log("🔌 Attempting to connect to OpenSea WebSocket...");

    const client = new OpenSeaStreamClient({
      token: 'a0ebd2016e774dcb8214cae098636155',  // Your OpenSea API key
      connectOptions: {
        transport: WebSocket
      }
    });

    // Listen for "item_sold" events for the Pudgy Penguins collection
    client.onItemSold({
      collection_slug: 'pudgy-penguins',
      event: (event) => {
        const { payload } = event;

        // Log the full payload for inspection
        console.log('Event Payload:', JSON.stringify(payload, null, 2));

        // Log the sale details
        console.log(`🎉 Pudgy Penguin sold!`);
        console.log(`Token ID: ${payload.asset.token_id}`);
        console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
        console.log(`Buyer: ${payload.winner_account.address}`);
        console.log(`Seller: ${payload.seller.address}`);
      }
    });

    console.log("✅ Connected to OpenSea WebSocket successfully!");

  } catch (error) {
    console.error("[ERROR]:", error.message || error);

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(`⚠️ Connection lost. Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`);
      setTimeout(initializeOpenSeaClient, reconnectDelay);  // Attempt to reconnect after a delay
    } else {
      console.log("❌ Max reconnection attempts reached. Exiting...");
    }
  }
}

// Initialize the WebSocket connection
initializeOpenSeaClient();
