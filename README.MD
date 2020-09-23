# SMARGPARSER
Pars arguments. Parse all JSON types. Yes, arrays and objects too.

## Install
```bash
$ npm install smargparser
```

## Examples
```js
const argv = require('smargparser')();
console.log(argv);
```
```bash
$ node example.js -a beep -b 'Hello World'
{ a: 'beep', b: 'Hello World', _: [], '--': [] }


$ node example.js -a 3 -b 0.5 2 -3 'Hello World' --foo -350
{
  a: 3,
  b: [ 0.5, 2, -3, 'Hello World' ],
  foo: -350,
  _: [],
  '--': []
}


$ node example.js -abc -0.25
{ a: true, b: true, c: -0.25, _: [], '--': [] }


$ node example.js --foo 1 25 false --baz=qux
{ foo: [ 1, 25, false ], baz: 'qux', _: [], '--': [] }


$ node example.js --port 3000 --userData '{ "name": "Vlad",
"age": 23, "married": false, "pets": ["cement", "concrete"] }'
{
  port: 3000,
  userData: {
    name: 'Vlad',
    age: 23,
    married: false,
    pets: [ 'cement', 'concrete' ]
  },
  _: [],
  '--': []
}


$ node example.js --foo 1 2 3 --bar '[4, 5, 6]' --qux='[7, 8, 9]'
{
  foo: [ 1, 2, 3 ],
  bar: [ 4, 5, 6 ],
  qux: [ 7, 8, 9 ],
  _: [],
  '--': []
}


$ node example.js --from './folder1/' './folder2' --to './folder3'
{
  from: [ './folder1/', './folder2' ],
  to: './folder3',
  _: [],
  '--': []
}
```
```js
const {
  port = 3000,
  host = '127.0.0.1',
  dbport = 3306,
  user = 'root',
  password = '12345',
  database = 'test'
} = require('smargparser')();

module.exports = {
  server: {
    port
  },
  database: {
    host,
    port: dbport,
    user,
    password,
    database
  }
}
```

## Methods
### **parseArgs`(args, negativeNumbers)`**
* <small>`(Array<string>)`</small> `args = process.argv` - string array of arguments.

* <small>`(boolean)`</small> `negativeNumbers = true` - the flag specifies whether to parse
a number with prefix as a number or argument (example -10, minus treated as a prefix).
Following arguments `'-a -10'` will be parsed as
  * when `true`: `{ a: -10 }`;
  * when `false`: `{ a: true, 1: true, 0: true }`;

Returns an argument object `argv` with the following
structure: `{ <key>: <value> }` filled with the array arguments from args.
  * `argv._` - contains all arguments that are not related to others.
  * `argv['--']` - contains all arguments after `--`.

## license
MIT
