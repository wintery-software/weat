import chalk from 'chalk';
import * as fs from 'fs';
import path from 'node:path';

// `tsx lib/i18n/utils/diff.ts lib/i18n/translations`
const dir = process.argv[2];
const translations = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith('.json') && file !== 'en.json');

const diff = (
  objA: object,
  objB: object,
): {
  removed: string[];
  added: string[];
} => {
  const extractKeys = (obj: object, prefix: string = ''): string[] => {
    let keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      keys.push(newKey);
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        keys = keys.concat(extractKeys(value, newKey));
      }
    }
    return keys;
  };

  const keysA = new Set(extractKeys(objA));
  const keysB = new Set(extractKeys(objB));

  const removed = Array.from(keysA).filter((key) => !keysB.has(key));
  const added = Array.from(keysB).filter((key) => !keysA.has(key));

  return { removed, added };
};

const baseFile = 'en.json';
const baseObj = JSON.parse(fs.readFileSync(path.join(dir, baseFile), 'utf8'));

let exitCode = 0;

translations.forEach((f) => {
  const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const { removed, added } = diff(baseObj, obj);

  if (removed.length !== 0 || added.length !== 0) {
    exitCode = 1;
  }

  console.log(f);
  removed.forEach((key) => console.log(chalk.red(`- ${key}`)));
  console.log('---');
  added.forEach((key) => console.log(chalk.green(`+ ${key}`)));
});

process.exit(exitCode);
