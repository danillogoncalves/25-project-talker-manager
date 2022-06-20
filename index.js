const express = require('express');
const bodyParser = require('body-parser');

const { readFileTalker } = require('./util/utils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const talker = await readFileTalker('./talker.json');
  const talk = talker.find((e) => +e.id === +id);
  console.log(talk);
  if (!talk) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talk);
});

app.get('/talker', async (req, res) => {
  const talker = await readFileTalker('./talker.json');
  console.log(talker);
  res.status(200).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
