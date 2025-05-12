require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const { EDAMAM_APP_ID, EDAMAM_APP_KEY } = process.env;

if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
  console.error('Please set EDAMAM_APP_ID and EDAMAM_APP_KEY in your .env file');
  process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;
  if (!ingredients) {
    return res.status(400).json({ error: 'Please provide ingredients as a query parameter.' });
  }

  const q = encodeURIComponent(ingredients);
  const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${q}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

  try {
    const apiRes = await fetch(apiUrl);
    const data = await apiRes.json();
    res.json(data.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
