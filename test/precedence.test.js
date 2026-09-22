const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzePrecedence } = require('../src/precedence');

// Проверяем линейный порядок без противоречий.
test('определяет полный порядок', () => {
  const result = analyzePrecedence([
    ['a', 'b'],
    ['b', 'c'],
  ]);

  assert.equal(result.complete, true);
  assert.equal(result.contradictory, false);
});

// Проверяем цикл, образованный прямыми связями.
test('находит прямое противоречие', () => {
  const result = analyzePrecedence([
    ['a', 'b'],
    ['b', 'a'],
  ]);

  assert.equal(result.complete, false);
  assert.equal(result.contradictory, true);
});

// Проверяем цикл, образованный через несколько промежуточных вершин.
test('находит косвенное противоречие', () => {
  const result = analyzePrecedence([
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
  ]);

  assert.equal(result.complete, false);
  assert.equal(result.contradictory, true);
});

// Несвязные вершины нельзя выстроить в одну цепочку.
test('определяет неполный порядок', () => {
  const result = analyzePrecedence([
    ['a', 'b'],
    ['c', 'd'],
  ]);

  assert.equal(result.complete, false);
  assert.equal(result.contradictory, false);
});

// Проверяем пустой набор пар.
test('обрабатывает пустой набор пар', () => {
  const result = analyzePrecedence([]);

  assert.equal(result.complete, true);
  assert.equal(result.contradictory, false);
  assert.deepEqual(result.vertices, []);
});
