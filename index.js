/**
 * Creates an object from the results of the callback call. Works like Array.prototype.map.
 * @param {Array.<string>} [args=process.argv] - string array of arguments.
 * @param {boolean} [negativeNumbers=true] - the flag specifies whether to parse a number with
 * prefix as a number or argument (example -10, minus treated as a prefix).
 * Following arguments '-a -10' will be parsed as
 * if true: { a: -10 };
 * if false: { a: true, 1: true, 0: true };
 * @returns {Object.<string, *>} - an argument object argv with the following
 * structure: { <key>: <value> } filled with the array arguments from args.
 * argv._ - contains all arguments that are not related to others.
 * argv['--'] - contains all arguments after --.
 * @example
 * parseArgs(['--foo=25', '-abc', '-10']);
 *
 * returns { foo: '25', a: true, b: true, c: -10 };
 */
function parseArgs(argv = process.argv.slice(2), negativeNumbers = true) {
  const resultDict = {};
  const _ = [];
  let __ = [];

  for (let i = 0; i < argv.length;) {
    if (argv[i] === '--') {
      __ = argv.slice(i + 1);
      break;
    } else if (argv[i].slice(0, 2) === '--') {
      let { key, value } = parseKeyValue(argv[i++].slice(2));

      if (value === null) {
        ({ i, value } = readValue(i, argv, negativeNumbers));
      }

      resultDict[key] = parseValue(value);
    } else if (argv[i].charAt(0) === '-' && !(negativeNumbers && /^[+-]?\d+(?:\.\d+|e[+-]\d+)?/.test(argv[i]))) {

      const keys = argv[i].slice(1).split('');
      let key, value;

      for (let j = 0; j < keys.length; ++j) {
        key = keys[j];
        resultDict[key] = true;
      }

      ({ i, value } = readValue(++i, argv, negativeNumbers));

      resultDict[key] = value;
    } else {
      _.push(parseValue(argv[i++]));
    }
  }

  resultDict._ = _;
  resultDict['--'] = __;

  return resultDict;
}

function parseValue(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

function parseKeyValue(arg) {
  const sign = arg.lastIndexOf('=');
  const isSign = Boolean(~sign);
  let key = (isSign) ? arg.slice(0, sign) : arg;
  let value = (isSign) ? arg.slice(sign + 1) : null;

  if (key === '') {
    if (isSign) key = '=' + value;
    value = null;
  }

  return { key, value };
}

function readValue(i, argv, negativeNumbers) {
  const buffer = [];
  for (; argv[i] && (negativeNumbers && /^[+-]?\d+(?:\.\d+|e[+-]\d+)?/.test(argv[i]) || argv[i].charAt(0)) !== '-' ; ++i) {
    buffer.push(parseValue(argv[i]));
  }

  const value = (buffer.length === 0)
    ? true
    : (buffer.length === 1)
      ? buffer[0]
      : buffer;

  return { i, value };
}

module.exports = parseArgs;
