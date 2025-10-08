import { Yazio } from "./node_modules/yazio/dist/index.mjs";

const client = new Yazio({
  credentials: {
    username: "maskencrewde@gmail.com",
    password: "hmx6305.",
  },
});

const run = async () => {
  try {
    // Produktsuche
    const result = await client.products.search({
      query: "Banane",
      language: "de",
      limit: 5,
    });

    const banana = result.find(p => p.name.includes("groß"));

    if (!banana) {
      console.error("❌ Keine große Banane gefunden.");
      return;
    }

    console.log(`\n✅ Gefundenes Produkt: ${banana.name}`);
    console.log(`ID: ${banana.product_id}`);

    // Detaildaten abrufen
    const detail = await client.products.get(banana.product_id);

    console.log("\n🔎 Detailinformationen:");
    console.log(`Name: ${detail.name}`);
    console.log(`Beschreibung: ${detail.description}`);
    console.log(`Kategorien: ${detail.categories?.join(", ")}`);
    console.log(`Menge: ${detail.amount} ${detail.base_unit}`);

    // Nährstoffe komplett auflisten
    console.log("\n📊 Nährwerte (alle):");
    for (const [key, value] of Object.entries(detail.nutrients)) {
      const displayKey = key.replace("nutrient.", "").replace("energy.", "");
      const val = (value * 100).toFixed(2);
      console.log(`${displayKey}: ${val}`);
    }

    // Portionsgrößen
    console.log("\n🥣 Portionsgrößen:");
    if (Array.isArray(detail.portions) && detail.portions.length > 0) {
      detail.portions.forEach((portion, idx) => {
        const name = portion.name || "Standard";
        const amount = portion.amount ?? "?";
        const unit = portion.unit ?? "?";
        console.log(`#${idx + 1}: ${amount} ${unit} (${name})`);
      });
    } else {
      // Fallback: serving-Daten nutzen
      console.log(`Standardportion (aus serving):`);
      console.log(`${banana.serving_quantity} × ${banana.amount} ${banana.base_unit} (${banana.serving})`);
    }

  } catch (err) {
    console.error("❌ Fehler:", err.message);
  }
};

run();
