/* eslint-env jest */

const { parseKeyValue } = require('./index');

test('must parse', () => {
  expect(parseKeyValue('--key=value')).toEqual({ key: 'key', value: 'value' });
  expect(parseKeyValue('--key=')).toEqual({ key: 'key', value: '' });
  expect(parseKeyValue('--key')).toEqual({ key: 'key', value: true });
  expect(parseKeyValue('--=value')).toEqual({ key: '=value', value: true });
  expect(parseKeyValue('--=')).toEqual({ key: '=', value: true });
  expect(parseKeyValue('--')).toEqual({ key: '', value: true });
});
