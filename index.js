function parseKeyValue(arg) {
  const sign = arg.lastIndexOf('=');
  const isSign = Boolean(~sign);
  let key = (isSign) ? arg.slice(2, sign) : arg.slice(2);
  let value = (isSign) ? arg.slice(sign + 1) : true;
  if (key === '') {
    key = '=' + value;
    value = true;
  }
  return { key, value };
}

module.exports = { parseKeyValue };
