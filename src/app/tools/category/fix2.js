const fs = require('fs');
const file = 'd:/tech-tools/src/app/tools/category/[category]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Simplest approach: just search and replace the known classes
content = content.replace(/bg-white\/82 p-6 shadow-\[0_1px_3px_rgba\(15,23,42,0\.04\),0_12px_32px_rgba\(99,102,241,0\.07\)\] sm:p-8/g, 'bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none');

content = content.replace(/bg-white\/75 p-5 shadow-\[0_1px_3px_rgba\(15,23,42,0\.04\),0_12px_32px_rgba\(99,102,241,0\.07\)\] sm:p-7/g, 'bg-white/75 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-7 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none');

// Header part
content = content.replace(/bg-white\/82 p-6 shadow-\[0_1px_3px_rgba\(15,23,42,0\.04\),0_16px_40px_rgba\(99,102,241,0\.1\)\] sm:p-8 lg:p-10/g, 'bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_16px_40px_rgba(99,102,241,0.1)] sm:p-8 lg:p-10 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none');

fs.writeFileSync(file, content);
console.log('done patching section backgrounds!');
