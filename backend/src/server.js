require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'drape-ai-api', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Drape.ai API running at http://localhost:${PORT}`);
});
