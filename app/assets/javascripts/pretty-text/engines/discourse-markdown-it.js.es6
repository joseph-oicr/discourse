setup = false;

export function setup(opts) {
  if (opts.setup) {
    return;
  }

  const check = /discourse-markdown\/|markdown-it\//;
  //let helper = 
  Object.keys(require._eak_seen).forEach(entry => {
    if (check.test(entry)) {
      const module = require(entry);
      if (module && module.setup) {
        console.log(entry);
      }
    }
  });

  opts.markdownIt = true;
  opts.setup = true;
}

export function cook(raw, opts) {
  
}
