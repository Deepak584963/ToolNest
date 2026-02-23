const fs = require('fs');
const file = 'd:/tech-tools/src/app/tools/category/[category]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Breadcrumbs
content = content.replace(
  /<li><Link href=\"\/\" className=\"inline-flex items-center gap-1 font-medium text-slate-500 transition hover:text-indigo-600\">/g,
  '<li><Link href=\"/\" className=\"inline-flex items-center gap-1 font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400\">'
);
content = content.replace(
  /<li aria-hidden className=\"text-slate-300\">›<\/li>/g,
  '<li aria-hidden className=\"text-slate-300 dark:text-slate-600\">›</li>'
);
content = content.replace(
  /<li><Link href=\"\/#tools\" className=\"font-medium text-slate-500 transition hover:text-indigo-600\">/g,
  '<li><Link href=\"/#tools\" className=\"font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400\">'
);
content = content.replace(
  /<li className=\"rounded-full bg-indigo-50\/80 px-2\.5 py-0\.5 font-semibold text-indigo-600 text-xs\">\{meta\.name\} Tools<\/li>/g,
  '<li className=\"rounded-full bg-indigo-50/80 px-2.5 py-0.5 font-semibold text-indigo-600 text-xs dark:bg-indigo-500/20 dark:text-indigo-300\">{meta.name} Tools</li>'
);

// Hero section updates
content = content.replace(
  /header className=\"([\w\s-/]+) bg-white\/82 ([\w\s-/\[\],.]+)\"/g,
  'header className=\"$1 bg-white/82 $2 dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-none\"'
);
content = content.replace(
  /<div className=\"pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100\/30 via-purple-50\/20 to-cyan-100\/30\" \/>/g,
  '<div className=\"pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-cyan-900/20\" />'
);
content = content.replace(
  /<div className=\"pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float rounded-full bg-linear-to-br from-indigo-200\/20 to-violet-200\/20 blur-3xl\" \/>/g,
  '<div className=\"pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float rounded-full bg-linear-to-br from-indigo-200/20 to-violet-200/20 blur-3xl dark:from-indigo-500/10 dark:to-violet-500/10\" />'
);
content = content.replace(
  /<div className=\"pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 animate-float-delayed rounded-full bg-linear-to-tr from-cyan-200\/15 to-sky-200\/15 blur-3xl\" \/>/g,
  '<div className=\"pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 animate-float-delayed rounded-full bg-linear-to-tr from-cyan-200/15 to-sky-200/15 blur-3xl dark:from-cyan-500/10 dark:to-sky-500/10\" />'
);
content = content.replace(
  /<h1 className=\"text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl\">/g,
  '<h1 className=\"text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white\">'
);
content = content.replace(
  /<p className=\"mt-3 inline-flex items-center gap-1\.5 rounded-full border border-indigo-200\/50 bg-indigo-50\/80 px-3\.5 py-1\.5 text-xs font-bold text-indigo-600 shadow-sm\">/g,
  '<p className=\"mt-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300\">'
);

// Sections global updates
content = content.replace(
  /section(?:[^>]+)className=\"([\w\s-/]+) bg-white\/82 ([\w\s-/\[\],.]+)\"/g,
  function(match, p1, p2) {
    if(match.includes('dark:')) return match;
    return match.replace(/\"$/, ' dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-none\"');
  }
);
content = content.replace(
  /section(?:[^>]+)className=\"([\w\s-/]+) bg-white\/75 ([\w\s-/\[\],.]+)\"/g,
  function(match, p1, p2) {
    if(match.includes('dark:')) return match;
    return match.replace(/\"$/, ' dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-none\"');
  }
);

content = content.replace(
  /<h2 className=\"text-2xl font-extrabold text-slate-900\">/g,
  '<h2 className=\"text-2xl font-extrabold text-slate-900 dark:text-white\">'
);
content = content.replace(
  /<p className=\"mt-2 text-sm leading-7 text-slate-500 sm:text-base\">/g,
  '<p className=\"mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400\">'
);
content = content.replace(
  /<p className=\"mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8\">/g,
  '<p className=\"mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-400\">'
);
content = content.replace(
  /<p className=\"mt-5 space-y-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8\">/g,
  '<p className=\"mt-5 space-y-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-400\">'
);

// List tool cards
content = content.replace(
  /className=\"card-hover-glow pressable group rounded-2xl border border-slate-200\/60 bg-white\/88 p-4 transition-all duration-200 hover:border-indigo-200\/50 hover:shadow-\[0_4px_16px_rgba\(99,102,241,0\.1\)\]\"/g,
  'className=\"card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30\"'
);
content = content.replace(
  /<h3 className=\"text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition\">/g,
  '<h3 className=\"text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400\">'
);
content = content.replace(
  /<p className=\"mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm\">/g,
  '<p className=\"mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400\">'
);
content = content.replace(
  /<div className=\"mt-5 space-y-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8\">/g,
  '<div className=\"mt-5 space-y-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-400\">'
);

// FAQ
content = content.replace(
  /className=\"group rounded-2xl border border-slate-200\/60 bg-white\/80 p-4 transition-all duration-200 hover:border-indigo-200\/60 open:border-indigo-200\/50 open:bg-white\/95 open:shadow\"/g,
  'className=\"group rounded-2xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 open:border-indigo-200/50 open:bg-white/95 open:shadow dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/40 dark:open:border-indigo-500/30 dark:open:bg-slate-800/80\"'
);
content = content.replace(
  /text-slate-800 group-open:text-indigo-600/g,
  'text-slate-800 group-open:text-indigo-600 dark:text-slate-200 dark:group-open:text-indigo-400'
);
content = content.replace(
  /text-slate-500\">\{faq\.answer\}<\/p>/g,
  'text-slate-500 dark:text-slate-400\">{faq.answer}</p>'
);

// Explore categories bottom
content = content.replace(
  /className=\"card-hover-glow pressable group flex items-center gap-3 rounded-2xl border border-slate-200\/60 bg-white\/88 p-4 transition-all duration-200 hover:border-indigo-200\/50 hover:shadow-\[0_4px_16px_rgba\(99,102,241,0\.1\)\]\"/g,
  'className=\"card-hover-glow pressable group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30\"'
);
content = content.replace(
  /<span className=\"block text-sm font-bold text-slate-800 transition group-hover:text-indigo-600\">/g,
  '<span className=\"block text-sm font-bold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400\">'
);
content = content.replace(
  /<span className=\"block text-xs text-slate-500\">/g,
  '<span className=\"block text-xs text-slate-500 dark:text-slate-400\">'
);

// Replace icon background to not have harsh shadow in dark mode (optional, but shadow is fine since shadow is dark)
content = content.replace(
  /shadow-\[0_2px_8px_rgba\(99,102,241,0.1\)\]/g,
  'shadow-[0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-none'
);

fs.writeFileSync(file, content);
console.log('done!');
