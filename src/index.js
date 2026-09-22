const fs = require('node:fs');
const { analyzePrecedence } = require('./precedence');

function parseInput(input) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('Входные данные отсутствуют.');
  }

  const pairCount = Number(lines[0]);

  if (!Number.isInteger(pairCount) || pairCount < 0) {
    throw new Error('Первая строка должна содержать неотрицательное целое число N.');
  }

  if (lines.length - 1 < pairCount) {
    throw new Error('Количество пар во входных данных меньше N.');
  }

  const pairs = [];

  for (let index = 0; index < pairCount; index += 1) {
    const values = lines[index + 1]
      .replace(/[(),;]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    if (values.length !== 2) {
      throw new Error(`Некорректная пара в строке ${index + 2}.`);
    }

    pairs.push(values);
  }

  return pairs;
}

function run() {
  try {
    const input = fs.readFileSync(0, 'utf8');
    const pairs = parseInput(input);
    const result = analyzePrecedence(pairs);

    console.log(`Количество пар: ${pairs.length}`);
    console.log(`Использованные символы: ${result.vertices.join(', ') || 'нет'}`);
    console.log(`Порядок является полным: ${result.complete ? 'да' : 'нет'}`);
    console.log(`Порядок является противоречивым: ${result.contradictory ? 'да' : 'нет'}`);
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  parseInput,
};
