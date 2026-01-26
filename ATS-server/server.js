const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

// Routes
require('./routes/api')(app);

// For MongoDB connection, will be added later

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ATS server is running on port ${PORT}`);
});
