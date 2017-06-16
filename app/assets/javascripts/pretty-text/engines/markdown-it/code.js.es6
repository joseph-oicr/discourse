// we need a custom renderer for code blocks cause we have a slightly non compliant
// format with special handling for text and so on
//
import { registerOption } from 'pretty-text/pretty-text';

const TEXT_CODE_CLASSES = ["text", "pre", "plain"];

registerOption((siteSettings, opts) => {
  opts.features.code = true;
  opts.defaultCodeLang = siteSettings.default_code_lang;
  opts.acceptableCodeClasses = (siteSettings.highlighted_languages || "").split("|").concat(['auto', 'nohighlight']);
});

function render(tokens, idx, options, env, slf, md) {
  let token = tokens[idx],
      info = token.info ? md.utils.unescapeAll(token.info) : '',
      langName = md.options.discourse.defaultCodeLang,
      className,
      escapedContent = md.utils.escapeHtml(token.content);

  if (info) {
    // strip off any additional languages
    info = info.split(/\s+/g)[0];
  }

  const acceptableCodeClasses = md.options.discourse.acceptableCodeClasses;
  if (acceptableCodeClasses && info && acceptableCodeClasses.indexOf(info) !== -1) {
    langName = info;
  }

  className = TEXT_CODE_CLASSES.indexOf(langName) !== -1 ? 'lang-nohighlight' : 'lang-' + langName;

  return `<pre><code class='${className}'>${escapedContent}</code></pre>\n`;
}

export default function(md) {
  md.renderer.rules.fence = (tokens,idx,options,env,slf)=>render(tokens,idx,options,env,slf,md);
}
