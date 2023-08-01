import exclude from './index';

describe('utils/exclude', () => {

  test('empty exclude', () => {
    expect(exclude({a: 1, b: 2}, {})).toEqual({a: 1, b: 2});
  });

  test('equal one property', () => {
    expect(exclude({a: 1, b: 2}, {b: 2})).toEqual({a: 1});
  });

  test('all equals', () => {
    expect(exclude({a: 1, b: 2}, {b: 2, a: 1})).toEqual({});
  });

  test('empty objects', () => {
    expect(exclude({}, {})).toEqual({});
  });

  test('delete nothing', () => {
    expect(exclude({}, {a: 1, b: 2, c: {n1: 10, n2: {y: 1, x: 9}}})).toEqual({});
  });

  test('is immutable if has changes', () => {
    const a = {value: 100, sub: {value: 200, x: {y: 100}}};
    const result = exclude(a, {value: 100});
    expect(result).not.toEqual(a);
  });

  test('is equal if no changes', () => {
    const a = {value: 100, sub: {value: 200}};
    const result = exclude(a, {value: 600});
    expect(result).toEqual(a);
  });

  test('deep', () => {
    const s = {a: 1, b: 2, c: {n1: 10, n2: {y: 1, x: 9}}};
    expect(exclude(s, {})).toEqual(s);
    expect(exclude(s, {b: 2, c: {n2: {x: 9}}})).toEqual({a: 1, c: {n1: 10, n2: {y: 1}}});
    expect(exclude(s, {b: 2, c: {n2: {y: 1, x: 9}}})).toEqual({a: 1, c: {n1: 10}});
  });

  test('delete deep property', () => {
    expect(exclude({
      simple: 100,
      deep: {
        deep: {
          deep: 200,
          value: 5
        }
      }
    }, {
      deep: {
        deep: {
          deep: 200,
          value: 5
        }
      }
    })).toEqual({
      simple: 100,
    });
  });
});

