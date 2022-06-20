const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const { readFileTalker } = require('./util/utils');
const { validateEmail } = require('./middlewares/validateEmail');
const { validatePassword } = require('./middlewares/validatePassword');

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
  const talker = await readFileTalker('./talker.json');
  const talk = talker.find((e) => +e.id === +id);
  if (!talk) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talk);
});

app.get('/talker', async (req, res) => {
  const talker = await readFileTalker('./talker.json');
  res.status(200).json(talker);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
