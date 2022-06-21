const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const { readFileTalker, writeFileTalker } = require('./util/utils');
const { validateEmail } = require('./middlewares/validateEmail');
const { validatePassword } = require('./middlewares/validatePassword');
const { validateToken } = require('./middlewares/validateToken');
const { validadeName } = require('./middlewares/validadeName');
const { validateAge } = require('./middlewares/validateAge');
const { validateTalk } = require('./middlewares/validateTalk');
const { validateTalkWatchedAt } = require('./middlewares/validateTalkWatchedAt');
const { validateTalkRate } = require('./middlewares/validateTalkRate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readFileTalker(PATH);
  const talk = talker.find((eTalk) => +eTalk.id === +id);
  if (!talk) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talk);
});

app.get('/talker', async (_req, res) => {
  const talker = await readFileTalker(PATH);
  res.status(200).json(talker);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.post(
  '/talker',
  validateToken,
  validadeName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
    const talker = await readFileTalker(PATH);
    const newTalk = { ...req.body, id: talker.length + 1 };
    const newList = [...talker, newTalk];
    await writeFileTalker(PATH, newList);
  res.status(201).json(newTalk);
},
);

app.put(
  '/talker/:id',
  validateToken,
  validadeName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
    const { id } = req.params;
    const editedTalk = { id: Number(id), ...req.body };
    const talker = await readFileTalker(PATH);
    const talkIndex = talker.findIndex((eTalk) => +eTalk.id === +id);
    talker[talkIndex] = editedTalk;
    await writeFileTalker(PATH, talker);
  res.status(200).json(editedTalk);
},
);

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talker = await readFileTalker(PATH);
  const talkIndex = talker.findIndex((eTalk) => +eTalk.id === +id);
  talker.splice(talkIndex, 1);
  await writeFileTalker(PATH, talker);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
