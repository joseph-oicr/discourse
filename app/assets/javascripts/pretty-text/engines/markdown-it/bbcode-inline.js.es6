import { parseBBCodeTag } from 'pretty-text/engines/markdown-it/bbcode-block';

const rules = {
  'b': {tag: 'span', 'class': 'bbcode-b'}
};

function applyBBCode(state, silent) {

  let pos = state.pos;

  // 91 = [
  if (silent || state.src.charCodeAt(pos) !== 91) {
    return false;
  }

  const tagInfo = parseBBCodeTag(state.src, pos, state.posMax);

  if (!tagInfo) {
    return false;
  }

  const rule = rules[tagInfo.tag];
  if (!rule) {
    return false;
  }

  const endTag = "[/" + tagInfo.tag +"]";
  let i;
  for(i=pos+tagInfo.length;i<state.posMax;i++) {
    if (state.src.charCodeAt(i) === 91 && state.src.slice(i, i+endTag.length) === endTag) {
      break;
    }
  }

  // end tag not found
  if (i === state.posMax) {
    return false;
  }

  console.log(JSON.stringify(rule));
  console.log(JSON.stringify(tagInfo));
  console.log(i);

  return false;
}

export default function(md) {
  md.inline.ruler.push('bbcode-inline', applyBBCode);
}
