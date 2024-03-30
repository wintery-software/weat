import * as fs from 'fs';
import { fromPairs, isArray, isObject, sortBy, toPairs } from 'lodash';
import path from 'node:path';

// `tsx lib/i18n/utils/check.ts lib/i18n/translations`
const dir = process.argv[2];
const translations = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith('.json'));

const sort = (obj: any): any =>
  fromPairs(
    sortBy(toPairs(obj), 0).map(([key, value]) => [
      key,
      isObject(value) && !isArray(value) ? sort(value) : value,
    ]),
  );

translations.forEach((f) => {
  const data = fs.readFileSync(path.join(dir, f), 'utf8');
  const obj = JSON.parse(data);
  const sorted = sort(obj);
  fs.writeFileSync(path.join(dir, f), JSON.stringify(sorted, null, 2));
});
