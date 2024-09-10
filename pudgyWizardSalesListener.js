const { OpenSeaStreamClient, EventType } = require('@opensea/stream-js');
const WebSocket = require('ws');

// Initialize the OpenSea Stream Client
async function initializeOpenSeaClient() {
  try {
    console.log("🔌 Attempting to connect to OpenSea WebSocket...");

    // OpenSea Stream Client setup
    const client = new OpenSeaStreamClient({
      token: 'a0ebd2016e774dcb8214cae098636155',  // Replace with your actual OpenSea API key
      connectOptions: {
        transport: WebSocket
      }
    });

    // Listen for "item_sold" events for Lil Pudgys collection
    client.onItemSold({
      collection_slug: 'lilpudgys',  // Slug for Lil Pudgys
      event: (event) => {
        console.log('🔍 Sale Event Payload:', JSON.stringify(event, null, 2));

        const { payload } = event;
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

    // You can listen to multiple events, e.g., item transferred
    client.onEvents('lilpudgys', [EventType.ITEM_SOLD, EventType.ITEM_TRANSFERRED], (event) => {
      console.log('🔍 Another Event:', event);
    });

    console.log("✅ Connected to OpenSea WebSocket successfully!");

  } catch (error) {
    console.error("[ERROR]:", error.message || error);
  }
}

// Initialize the WebSocket connection
initializeOpenSeaClient();
