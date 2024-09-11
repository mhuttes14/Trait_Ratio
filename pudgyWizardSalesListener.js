const { OpenSeaStreamClient, EventType } = require('@opensea/stream-js');
const WebSocket = require('ws');

// Initialize the OpenSea Stream Client
async function initializeOpenSeaClient() {
  try {
    console.log("🔌 Attempting to connect to OpenSea WebSocket...");

    const client = new OpenSeaStreamClient({
      token: 'YOUR_OPENSEA_API_KEY',  // Replace with your actual OpenSea API key
      connectOptions: {
        transport: WebSocket
      }
    });

    // Listen for "item_sold" events for Lil Pudgys collection
    client.onItemSold({
      collection_slug: 'lilpudgys',  // Correct collection slug for Lil Pudgys
      event: (event) => {
        const { payload } = event;

        if (payload && payload.asset) {
          const salePrice = payload.payment_token ? payload.payment_token.eth_price : null;
          
          // Log details if the event contains a sale price
          if (salePrice) {
            console.log(`🎉 Lil Pudgy sold!`);
            console.log(`Token ID: ${payload.asset.token_id}`);
            console.log(`Sale Price: ${salePrice} ETH`);
            console.log(`Buyer: ${payload.winner_account.address}`);
            console.log(`Seller: ${payload.seller.address}`);
            console.log(`Transaction Hash: ${payload.transaction.hash}`);
          } else {
            console.log("⚠️ Sale price not available for this event.");
          }
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
