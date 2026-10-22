export const toLf = (text) => text.replace(/\r\n/g, '\n');

// Write `after` with the line endings `before` already uses (a CRLF checkout stays CRLF).
export function matchEol(before, after) {
  return before !== null && before.includes('\r\n') ? toLf(after).replace(/\n/g, '\r\n') : after;
}

export const START = '<!-- rockstar-router:start -->';
export const END = '<!-- rockstar-router:end -->';

export function hasBlock(text) {
  const i = text.indexOf(START);
  return i !== -1 && text.indexOf(END, i + 1) !== -1;
}

// Replace the managed block if present, otherwise append it. Text outside the markers is never touched.
export function upsertBlock(text, body) {
  const block = `${START}\n${body}\n${END}`;
  const i = text.indexOf(START);
  const j = i === -1 ? -1 : text.indexOf(END, i + 1);
  if (i !== -1 && j !== -1) return text.slice(0, i) + block + text.slice(j + END.length);
  if (!text) return `${block}\n`;
  return `${text}${text.endsWith('\n') ? '' : '\n'}\n${block}\n`;
}

export function blockVersion(text) {
  return text.match(/<!-- rockstar-router (\d+\.\d+\.\d+) -->/)?.[1] ?? null;
}
