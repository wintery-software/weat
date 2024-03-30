import chalk from 'chalk';
import * as fs from 'fs';
import path from 'node:path';

// `tsx lib/i18n/utils/check.ts lib/i18n/translations`
const dir = process.argv[2];
const translations = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith('.json') && file !== 'en.json');

const diff = (
  base: any,
  target: any,
  path = '',
): {
  removed: string[];
  added: string[];
} => {
  const removedKeys: string[] = [];
  const addedKeys: string[] = [];

  Object.keys(base).forEach((key) => {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in target)) {
      removedKeys.push(newPath);
    } else if (
      typeof base[key] === 'object' &&
      typeof target[key] === 'object'
    ) {
      const { removed, added } = diff(base[key], target[key], newPath);
      removedKeys.push(...removed);
      addedKeys.push(...added);
    }
  });

  Object.keys(target).forEach((key) => {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in base)) {
      addedKeys.push(newPath);
    }
  });

  return { removed: removedKeys, added: addedKeys };
};

const enObj = JSON.parse(fs.readFileSync(path.join(dir, 'en.json'), 'utf8'));

translations.forEach((f) => {
  const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

  const { removed, added } = diff(enObj, obj);

  if (removed.length || added.length) {
    console.log(`\n${f}`);
    removed.forEach((key) => console.log(chalk.red(`- ${key}`)));
    console.log('---');
    added.forEach((key) => console.log(chalk.green(`+ ${key}`)));
  }
});
