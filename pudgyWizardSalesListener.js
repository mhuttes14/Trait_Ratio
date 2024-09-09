const { OpenSeaStreamClient } = require("@opensea/stream-js");
const WebSocket = require("ws");

// Initialize the OpenSea Stream Client
const client = new OpenSeaStreamClient({
  token: "6615653c4b604ce4a223e262fa0d1987", // Your new Opensea API key
  connectOptions: {
    transport: WebSocket,
  },
});

// Listen for "item_sold" events
client.onItemSold({
  collection_slug: "pudgy-penguins", // The OpenSea slug for Pudgy Penguins
  event: (event) => {
    const { payload } = event;

    // Log the full payload for inspection
    console.log("Event Payload:", JSON.stringify(payload, null, 2));

    // Check if the token ID is 3604 and has the "Head" trait with "Wizard Hat" value
    if (payload.asset.token_id === "3604") {
      const headWizardTrait = payload.asset.traits.find(
        (trait) => trait.trait_type === "Head" && trait.value === "Wizard Hat"
      );

      if (headWizardTrait) {
        console.log(`🎉 Pudgy Penguin #3604 with "Wizard Hat" trait sold!`);
        console.log(`Token ID: ${payload.asset.token_id}`);
        console.log(`Sale Price: ${payload.payment_token.eth_price} ETH`);
        console.log(`Buyer: ${payload.winner_account.address}`);
        console.log(`Seller: ${payload.seller.address}`);
      }
    }
  },
});
