// QR codes for the questions slide, made locally (no online generator): slides/img/qr-*.svg.
import { writeFileSync } from 'node:fs';
import QRCode from 'qrcode';

const links = {
  wporg: 'https://wordpress.org/plugins/eizport/',
  site: 'https://eizport.github.io/',
  github: 'https://github.com/eizport/eizport',
  apoiase: 'https://apoia.se/eizport',
  talk: 'https://github.com/camaleaun/wpbrmeetup-06-bastidores',
};
for (const [name, url] of Object.entries(links)) {
  writeFileSync(`slides/img/qr-${name}.svg`, await QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#1e1e1e', light: '#ffffff' } }));
  console.log(`slides/img/qr-${name}.svg → ${url}`);
}
