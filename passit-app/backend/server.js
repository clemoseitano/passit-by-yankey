const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/english',    require('./routes/english'));
app.use('/api/maths',      require('./routes/maths'));
app.use('/api/computing',  require('./routes/computing'));
app.use('/api/bdt',        require('./routes/bdt'));
app.use('/api/results',    require('./routes/results'));
app.use('/api/students',   require('./routes/students'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'PassIt backend is running' });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
