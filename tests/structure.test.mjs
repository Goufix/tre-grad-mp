import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const publicHtml = await readFile('public/index.html', 'utf8');
const forumHtml = await readFile('forum/index.html', 'utf8');
const app = await readFile('public/assets/app.js', 'utf8');
const styles = await readFile('public/assets/styles.css', 'utf8');
const mapBbcode = (await readFile('mapa-subforum.txt', 'utf8')).trimEnd();

test('keeps both entrypoint documents minimal', () => {
  assert.match(publicHtml, /<script src="\/assets\/app\.js"><\/script>/);
  assert.match(forumHtml, /<script src="https:\/\/grad-mp\.alifer\.workers\.dev\/assets\/app\.js"><\/script>/);
  assert.match(publicHtml, /<title>\[TRE\] Envio de MP's<\/title>/);
  assert.match(forumHtml, /<title>\[TRE\] Envio de MP's<\/title>/);
  assert.doesNotMatch(publicHtml, /<style>|class="container"/);
  assert.doesNotMatch(forumHtml, /<style>|class="container"/);
  assert.doesNotMatch(app, /document\.title\s*=/);
  assert.match(app, /document\.head\.append\(titleElement\)/);
});

test('renders the interface and preserves every message template in JavaScript', () => {
  assert.match(app, /function renderDocument\(\)/);
  assert.match(app, /document\.body\.innerHTML/);
  assert.match(app, /case "GRAD_BASICA"/);
  assert.match(app, /case "MAPA_SUBFORUM"/);
  assert.match(app, /case "GRAD_INTER"/);
  assert.match(app, /case "GRAD_AVAN"/);
});

test('uses the current subforum map BBCode without modifications', () => {
  const embeddedMap = app.match(
    /case "MAPA_SUBFORUM":\s+title = "\[TRE\] Mapa do Subfórum";\s+message = `([\s\S]*?)`;\s+break;/,
  );

  assert.ok(embeddedMap, 'subforum map template was not found');
  assert.equal(embeddedMap[1], mapBbcode);
});

for (const [option, filename] of [
  ['GRAD_BASICA', 'basica'],
  ['GRAD_INTER', 'intermediaria'],
  ['GRAD_AVAN', 'avancada'],
]) {
  test(`sends the ${filename} graduation BBCode from mps`, async () => {
    const expectedMessage = (await readFile(`mps/${filename}.bbcode`, 'utf8')).trimEnd();
    const fillFunction = app.slice(app.indexOf('function fill_mp('), app.indexOf('function send_MP('));
    let sentMessage;
    let prevented = false;
    runInNewContext(`${fillFunction}\nfill_mp(event);`, {
      event: { preventDefault() { prevented = true; } },
      document: {
        getElementById(id) {
          return { value: id === 'select_value' ? option : 'Aluno1 / Aluno2' };
        },
      },
      send_MP(title, recipients, message) {
        sentMessage = { title, recipients: Array.from(recipients), message };
      },
    });
    assert.ok(prevented);
    assert.deepEqual(sentMessage.recipients, ['Aluno1', 'Aluno2']);
    assert.equal(sentMessage.message, expectedMessage);
    assert.match(sentMessage.message, /\{USERNAME\}/);
    assert.match(sentMessage.title, /^\[TRE\] Graduação /);
  });
}

test('loads the external stylesheet relative to the hosted script', () => {
  assert.match(app, /new URL\('\.', document\.currentScript\.src\)/);
  assert.match(app, /appendStylesheet\(`\$\{ASSET_BASE_URL\}\/styles\.css`\)/);
  assert.match(styles, /\.dropdown-menu/);
  assert.match(styles, /\.toast-post/);
});

test('uses the trainers wine palette and credits Goufix', () => {
  assert.match(styles, /--background: #170909/);
  assert.match(styles, /--surface: #241111/);
  assert.doesNotMatch(styles, /#771919f2|#a50000/i);
  assert.match(app, /href="https:\/\/system\.policercc\.com\.br\/perfil\/%2Cyouiz"[^>]*>,youiz<\/a>/);
  assert.match(app, /href="https:\/\/system\.policercc\.com\.br\/perfil\/Botpoised0n"[^>]*>Botpoised0n<\/a>/);
  assert.match(app, /href="https:\/\/system\.policercc\.com\.br\/perfil\/Goufix"[^>]*>Goufix<\/a>/);
});
