const { OpenSeaStreamClient } = require('@opensea/stream-js');
const WebSocket = require('ws');

// Initialize the OpenSea Stream Client
const client = new OpenSeaStreamClient({
  token: 'a0ebd2016e774dcb8214cae098636155',  // Your new OpenSea API key
  connectOptions: {
    transport: WebSocket
  }
});

// Listen for "item_sold" events for the Pudgy Penguins collection
client.onItemSold({
  collection_slug: 'pudgy-penguins',  // The OpenSea slug for Pudgy Penguins
  event: (event) => {
    const { payload } = event;

    // Log the full payload for inspection
    console.log('Event Payload:', JSON.stringify(payload, null, 2));

    // Log all sales, not just token ID 3604
    console.log(`🎉 Pudgy Penguin sold!`);
    console.log(`Token ID: ${payload.asset.token_id}`);
    console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
    console.log(`Buyer: ${payload.winner_account.address}`);
    console.log(`Seller: ${payload.seller.address}`);
  }
});
