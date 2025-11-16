// test-mongo.js
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI não encontrada no .env');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err.message || err);
    process.exit(1);
  });
