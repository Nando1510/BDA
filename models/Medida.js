const mongoose = require('mongoose');

const medidaSchema = new mongoose.Schema({
  customId: {
    type: Number,
    unique: true,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  altura: {
    type: Number,
    required: true
  },
  peso: {
    type: Number,
    required: true
  },
  resultado: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Isso adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Medida', medidaSchema);
//O NOME 'Medida' SERÁ CONVERTIDO PARA medidas (MINÚSCULO E NO PLURAL) COMO NOME DA COLEÇÃO.
