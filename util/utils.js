const fs = require('fs/promises');

const readFileTalker = async (file) => {
  const talker = await fs.readFile(file, 'utf-8');
  return JSON.parse(talker);
};

module.exports = {
  readFileTalker,
};