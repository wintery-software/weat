import * as fs from 'fs';
import {
  camelCase,
  fromPairs,
  isArray,
  isObject,
  sortBy,
  toPairs,
} from 'lodash';
import path from 'node:path';

// `tsx lib/i18n/utils/sort.ts lib/i18n/translations`
const dir = process.argv[2];
const translations = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith('.json'));

const sortKeys = (obj: any): any =>
  fromPairs(
    sortBy(toPairs(obj), 0).map(([key, value]) => [
      key,
      isObject(value) && !isArray(value) ? sortKeys(value) : value,
    ]),
  );

const camelizeKeys = (obj: any): any =>
  fromPairs(
    toPairs(obj).map(([key, value]) => [
      camelCase(key),
      isObject(value) && !isArray(value) ? camelizeKeys(value) : value,
    ]),
  );

translations.forEach((f) => {
  const data = fs.readFileSync(path.join(dir, f), 'utf8');
  const obj = JSON.parse(data);
  const camelized = camelizeKeys(obj);
  const sorted = sortKeys(camelized);
  fs.writeFileSync(path.join(dir, f), JSON.stringify(sorted, null, 2));
});
