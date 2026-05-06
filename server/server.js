require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AspirePath API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
