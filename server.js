const express = require('express');
const mongoose = require('mongoose');
const Medida = require('./models/Medida');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CONECTA O SERVIDOR NODE.JS AO BANCO DE DADOS MONGODB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://nandohanauer01_db_user:HH13TKCw03DJoLCz@cluster0.fbgabq9.mongodb.net/imcDB?retryWrites=true&w=majority';

// FUNÇÃO QUE GERA UM ID CRESCENTE PARA CADA NOVO REGISTRO
async function gerarCustomId() {
  const ultima = await Medida.findOne().sort({ customId: -1 });
  return ultima ? ultima.customId + 1 : 1;
}

// ROTA PARA EXIBIR A PÁGINA DE MANUTENÇÃO
app.get('/manutencao', (req, res) => {
  res.sendFile(__dirname + '/public/manutencao.html');
});

// ROTA PARA SALVAR OS DADOS
app.post('/salvar', async (req, res) => {
  try {
    const { nome, altura, peso } = req.body;

    const imc = peso / (altura * altura);
    let resultado = '';

    if (imc < 18.5) {
      resultado = 'Abaixo do peso';
    } else if (imc < 25) {
      resultado = 'Peso normal';
    } else if (imc < 30) {
      resultado = 'Sobrepeso';
    } else {
      resultado = 'Obesidade';
    }

    const customId = await gerarCustomId();

    const medida = new Medida({ customId, nome, altura, peso, resultado });
    await medida.save();

    console.log('Dados salvos:', medida);
    res.status(201).json({ message: 'Dados salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ message: 'Erro ao salvar dados' });
  }
});

// ROTA PARA LISTAR OS REGISTROS
app.get('/registros', async (req, res) => {
  try {
    const registros = await Medida.find();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registros' });
  }
});

// ROTA PARA EXCLUIR REGISTRO
app.delete('/excluir/:customId', async (req, res) => {
  await Medida.findOneAndDelete({ customId: req.params.customId });
  res.json({ message: 'Registro excluído!' });
});

// ROTA PARA ATUALIZAR REGISTRO
app.put('/atualizar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, altura, peso, resultado } = req.body;

  try {
    await Medida.updateOne(
      { customId: id },
      { $set: { nome, altura, peso, resultado } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    res.status(500).send('Erro ao atualizar registro');
  }
});

//NO FIM DO ARQUIVO



// INICIA O SERVIDOR APÓS GARANTIR A CONEXÃO COM O MONGODB
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Atlas conectado com sucesso!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
