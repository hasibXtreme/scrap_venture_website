import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/*
 * The original site is two real pages: /index.html and /awards.html.
 * This keeps both URLs working (dev, build and preview) and gives awards.html
 * its own <head> (title, description, favicon) and <body class> from the very
 * first byte, exactly like the original awards.html.
 */
const AWARDS_HEAD = `<title>Awards &amp; Recognition — ScrapVenture</title>
<meta name="description" content="Recognized for our contribution to responsible recycling and a cleaner future. Explore ScrapVenture's milestones, awards, and industry partnerships.">
<link rel="icon" type="image/png" href="assets/images/logo.png">`;

const TEAM_HEAD = `<title>Our Team — ScrapVenture</title>
<meta name="description" content="Meet the leadership, advisors, and innovative minds driving ScrapVenture's sustainable waste management revolution.">
<link rel="icon" type="image/png" href="assets/images/logo.png">`;

function toAwardsHtml(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, AWARDS_HEAD)
    .replace('<body>', '<body class="page-awards-body">');
}

function toTeamHtml(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, TEAM_HEAD)
    .replace('<body>', '<body class="page-team-body">');
}

function scrapventurePages() {
  let outDir = 'dist';
  let root = process.cwd();
  const rewrite = (req, _res, next) => {
    const [pathname, query] = req.url.split('?');
    if (pathname === '/awards.html' || pathname === '/team.html') req.url = '/index.html' + (query ? '?' + query : '');
    next();
  };
  return {
    name: 'scrapventure-pages',
    configResolved(c) { outDir = c.build.outDir; root = c.root; },
    configureServer(server) { server.middlewares.use(rewrite); },
    transformIndexHtml(html, ctx) {
      const url = ctx.originalUrl ? ctx.originalUrl.split('?')[0] : '';
      if (url === '/awards.html') return toAwardsHtml(html);
      if (url === '/team.html') return toTeamHtml(html);
    },
    closeBundle() {
      const dir = path.resolve(root, outDir);
      const built = path.join(dir, 'index.html');
      if (fs.existsSync(built)) {
        fs.writeFileSync(path.join(dir, 'awards.html'), toAwardsHtml(fs.readFileSync(built, 'utf8')));
        fs.writeFileSync(path.join(dir, 'team.html'), toTeamHtml(fs.readFileSync(built, 'utf8')));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), scrapventurePages()],
});
