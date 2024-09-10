const { OpenSeaStreamClient } = require('@opensea/stream-js');
const WebSocket = require('ws');

// Initialize the OpenSea Stream Client
async function initializeOpenSeaClient() {
  try {
    console.log("🔌 Attempting to connect to OpenSea WebSocket...");

    const client = new OpenSeaStreamClient({
      token: 'a0ebd2016e774dcb8214cae098636155',  // Your OpenSea API key
      connectOptions: {
        transport: WebSocket
      }
    });

    // Listen for "item_sold" events for the Lil Pudgys collection
    client.onItemSold({
      collection_slug: 'lilpudgys',  // Updated collection slug for Lil Pudgys
      event: (event) => {
        const { payload } = event;

        // Log the full payload for inspection
        console.log('🔍 Full Event Payload:', JSON.stringify(event, null, 2));

        // Log the sale details if payload exists
        if (payload && payload.asset) {
          console.log(`🎉 Lil Pudgy sold!`);
          console.log(`Token ID: ${payload.asset.token_id}`);
          console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
          console.log(`Buyer: ${payload.winner_account.address}`);
          console.log(`Seller: ${payload.seller.address}`);
        } else {
          console.log('⚠️ No asset data found in the event payload.');
        }
      }
    });

    console.log("✅ Connected to OpenSea WebSocket successfully!");

  } catch (error) {
    console.error("[ERROR]:", error.message || error);
  }
}

// Initialize the WebSocket connection
initializeOpenSeaClient();
