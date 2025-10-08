import express from "express";
import { Yazio } from "yazio";

const app = express();
const port = 3001;

const client = new Yazio({
  credentials: {
    username: "maskencrewde@gmail.com",
    password: "hmx6305.",
  },
});

// Produktsuche (z. B. mit Suchfeld)
app.get("/search", async (req, res) => {
  const query = req.query.q?.toString() || "";
  if (!query) return res.status(400).json({ error: "Fehlender Suchbegriff" });

  try {
    const result = await client.products.search({
      query,
      language: "de",
      limit: 5,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Fehler bei Produktsuche", details: err.message });
  }
});

// Detailabruf (z. B. nach Klick in App)
app.get("/product/:id", async (req, res) => {
  try {
    const detail = await client.products.get(req.params.id, { language: "de" });
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Abrufen der Produktdetails", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ API läuft auf http://localhost:${port}`);
});
