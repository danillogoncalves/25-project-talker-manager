const fs = require('fs/promises');

const readFileTalker = async (file) => {
  const talker = await fs.readFile(file, 'utf-8');
  return JSON.parse(talker);
};

const writeFileTalker = async (file, object) => {
  const string = JSON.stringify(object);
  await fs.writeFile(file, string);
};

module.exports = {
  readFileTalker,
  writeFileTalker,
};