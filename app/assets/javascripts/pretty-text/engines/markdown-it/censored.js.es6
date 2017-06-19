import { censor } from 'pretty-text/censored-words';
import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features.censored = true;
  opts.censoredWords = siteSettings.censored_words;
  opts.censoredPattern = siteSettings.censored_pattern;
});

function recurse(tokens, apply) {
  let i;
  for(i=0;i<tokens.length;i++) {
    apply(tokens[i]);
    if (tokens[i].children) {
      recurse(tokens[i].children, apply);
    }
  }
}

function censorTree(state, md) {
  const words = md.options.discourse.censoredWords;
  const patterns = md.options.discourse.censoredPattern;

  if (!state.tokens) {
    return;
  }

  recurse(state.tokens, token => {
    if (token.content) {
      token.content = censor(token.content, words, patterns);
    }
  });
}

export default function(md) {
  let words = md.options.discourse.censoredWords;
  let patterns = md.options.discourse.censoredPattern;
  if ((words && words.length > 0) || (patterns && patterns.length > 0)) {
    md.core.ruler.push('censored', state => censorTree(state, md));
  }
}
