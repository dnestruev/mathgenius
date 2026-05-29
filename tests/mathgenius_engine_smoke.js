const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'mathgenius_v4.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];
const fakeEl = {
  textContent: '', value: '', innerHTML: '', scrollTop: 0, scrollHeight: 0,
  style: {}, classList: { add() {}, remove() {} },
  addEventListener() {}, focus() {}, appendChild() {}
};
const ctx = {
  console, Math, Date, setTimeout() {}, isFinite, isNaN, parseFloat, String, Number,
  localStorage: { getItem() { return ''; }, setItem() {}, removeItem() {} },
  document: { getElementById() { return fakeEl; }, createElement() { return fakeEl; } }
};
vm.createContext(ctx);
vm.runInContext(script, ctx);

function textOf(query) {
  return ctx.solve(query).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

const cases = [
  ['sin(90°)', 'Ответ: 1'],
  ['sin(pi/2)', 'Режим углов: радианы'],
  ['sqrt(144)', 'Ответ: 12'],
  ['√144', 'Ответ: 12'],
  ['sqrt(x)=3', 'Ответ: x = 9'],
  ['2x=4', 'Ответ: x = 2'],
  ['2(x+3)=14', 'Ответ: x = 4'],
  ['(x+1)^2=9', 'Ответ: x₁ = 2, x₂ = -4'],
  ['log2(32)', 'Ответ: 5'],
  ['log(32;2)', 'Ответ: 5'],
  ['log(32,2)', 'Ответ: 5'],
  ['логарифм 32 по основанию 2', 'Ответ: 5'],
  ['350+10%', 'Ответ: 385'],
  ['увеличить на 10% 350', 'Ответ: 385'],
  ['уменьшить на 5% 200', 'Ответ: 190'],
  ['0.1+0.2', 'Ответ: 0.3'],
  ['2pi', 'Неявное умножение'],
  ['2+', 'выражение оборвалось'],
  ['площадь треугольника 3 4 5', 'Ответ: площадь = 6'],
  ['круг r=5', 'Ответ: S = 78.539816339745'],
  ['прямоугольник 3 4', 'Ответ: S = 12'],
  ['пифагор 3 4', 'Ответ: c = 5']
];

for (const [query, expected] of cases) {
  const actual = textOf(query);
  if (!actual.includes(expected)) {
    console.error(`FAIL: ${query}\nExpected fragment: ${expected}\nActual: ${actual}`);
    process.exit(1);
  }
}

console.log(`All MathGenius smoke tests passed: ${cases.length}`);
