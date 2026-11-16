import { readFile, writeFile } from 'node:fs/promises';

const appUrl = new URL('public/assets/app.js', import.meta.url);
const templates = [
  ['GRAD_BASICA', 'basica'],
  ['GRAD_INTER', 'intermediaria'],
  ['GRAD_AVAN', 'avancada'],
];
let app = await readFile(appUrl, 'utf8');

for (const [option, filename] of templates) {
  const bbcode = (await readFile(new URL(`mps/${filename}.bbcode`, import.meta.url), 'utf8')).trimEnd();
  const templatePattern = new RegExp('(case "' + option + '":\\s+title = "[^"]*";\\s+message = )`[\\s\\S]*?`;');
  if (!templatePattern.test(app)) {
    throw new Error(`Modelo não encontrado: ${option}`);
  }
  const escapedBbcode = bbcode.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');
  app = app.replace(templatePattern, (_, prefix) => `${prefix}\u0060${escapedBbcode}\u0060;`);
}

await writeFile(appUrl, app);
