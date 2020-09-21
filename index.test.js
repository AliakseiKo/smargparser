/* eslint-env jest */

const parse = require('./index');

describe(parse, () => {
  test.each([
    ['-a'.split(' '),             { _: [], '--': [], a: true }],
    ['-a -b -c'.split(' '), { _: [], '--': [], a: true, b: true, c: true }],
    ['-abc'.split(' '),           { _: [], '--': [], a: true, b: true, c: true }],
  ])('must parse %s correctly', (arg, expected) => {
    expect(parse(arg)).toEqual(expected);
  });

  test.each([
    ['-a 5000'.split(' '),         { _: [], '--': [], a: 5000 }],
    ['-a 1 -b 2 -c 3'.split(' '),  { _: [], '--': [], a: 1, b: 2, c: 3 }],
    ['-a 1 true null'.split(' '),  { _: [], '--': [], a: [1, true, null] }],
    ['-a -b -c hello!'.split(' '), { _: [], '--': [], a: true, b: true, c: 'hello!' }],
    ['-abc hello!'.split(' '),     { _: [], '--': [], a: true, b: true, c: 'hello!' }],
  ])('must parse %s correctly', (arg, expected) => {
    expect(parse(arg)).toEqual(expected);
  });

  test.each([
    ['-a -10'.split(' '),                   { _: [], '--': [], a: -10 }],
    ['-a -10 4e-2 -0.25'.split(' '),          { _: [], '--': [], a: [-10, 4e-2, -0.25] }],
    ['--foo= null'.split(' '),              { _: [null], '--': [], foo: '' }],
    ['--foo null'.split(' '),               { _: [], '--': [], foo: null }],
    ['--foo null 10'.split(' '),            { _: [], '--': [], foo: [null, 10] }],
    ['--foo -ab 5 --bar 5 6 --baz -- --qux 25 -ab'.split(' '),
    { _: [], '--': ['--qux', '25', '-ab'], foo: true, a: true, b: 5, bar: [5, 6], baz: true }],
  ])('must parse %s correctly', (arg, expected) => {
    expect(parse(arg)).toEqual(expected);
  });

  test.each([
    [['--foo=[null, true, false, -5, 0, 2.25, "hello", [1,2,3], { "name": "vasiliy", "age": 25 }]'],
    { _: [], '--': [], foo: [null, true, false, -5, 0, 2.25, "hello", [1, 2, 3], { name: 'vasiliy', age: 25 }] }],

    ['-a 5.5 -bcd false true --foo=null 10 3000 -p false'.split(' '),
    { _: [10, 3000], '--': [], a: 5.5, b: true, c: true, d: [false, true], foo: null, p: false }],
  ])('must parse %s correctly', (arg, expected) => {
    expect(parse(arg)).toEqual(expected);
  });

  test.each([
    ['-a -10'.split(' '), false, { _: [], '--': [], a: true, '1': true, '0': true }],
    ['-a -10 -20 -0.25'.split(' '), false,
    { _: [], '--': [], a: true, '1': true, '0': true, '2': true, '.': true, '5': true }],
  ])('must parse %s with negativeNumber is true correctly', (arg, negativeNumbers, expected) => {
    expect(parse(arg, negativeNumbers)).toEqual(expected);
  });
});
