const fs = require('fs');
const html = fs.readFileSync('code.html', 'utf8');

// Extract body content
let bodyStart = html.indexOf('<body');
let bodyEnd = html.indexOf('</body>');
let bodyTagEnd = html.indexOf('>', bodyStart) + 1;
let bodyContent = html.substring(bodyTagEnd, bodyEnd);

// Replace class with className and other raw conversions
bodyContent = bodyContent.replace(/class=/g, 'className=');
bodyContent = bodyContent.replace(/<!--.*?-->/gs, '');

// Self-closing tags fix for react (br, hr, img, input)
bodyContent = bodyContent.replace(/<hr(.*?)>/g, (match, attrs) => attrs.endsWith('/') ? match : `<hr${attrs}/>`);
bodyContent = bodyContent.replace(/<br(.*?)>/g, (match, attrs) => attrs.endsWith('/') ? match : `<br${attrs}/>`);
// img and input seem to have /> already from the HTML provided

// Extract Style
let styleContent = '';
if(html.includes('<style>')) {
  styleContent = html.split('<style>')[1].split('</style>')[0];
}

const appJsx = `import React from 'react';\nimport './App.css';\n\nexport default function App() {\n  return (\n    <div className="bg-surface font-body text-on-surface">\n      ${bodyContent}\n    </div>\n  );\n}`;

fs.writeFileSync('src/App.css', styleContent);
fs.writeFileSync('src/App.jsx', appJsx);

// Fix index.html to include tailwind CDN and config
let oldIndex = fs.readFileSync('index.html', 'utf8');
let tailwindStuff = `
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
        "colors": {
            "on-primary-fixed": "#002201",
            "surface": "#fff9ee",
            "surface-container": "#f3ede2",
            "on-error": "#ffffff",
            "surface-container-highest": "#e8e2d7",
            "on-secondary": "#ffffff",
            "surface-tint": "#3b6934",
            "primary-fixed-dim": "#a1d494",
            "surface-dim": "#dfd9ce",
            "inverse-primary": "#a1d494",
            "inverse-surface": "#333029",
            "error-container": "#ffdad6",
            "surface-container-lowest": "#ffffff",
            "secondary": "#795900",
            "on-primary-container": "#9dd090",
            "primary-container": "#2d5a27",
            "tertiary-container": "#7c3a55",
            "on-surface": "#1d1b15",
            "on-tertiary": "#ffffff",
            "surface-container-high": "#eee7dc",
            "secondary-fixed": "#ffdf9f",
            "on-surface-variant": "#42493e",
            "on-primary-fixed-variant": "#23501e",
            "tertiary-fixed-dim": "#ffb0cc",
            "secondary-container": "#ffc329",
            "primary": "#154212",
            "outline-variant": "#c2c9bb",
            "on-tertiary-container": "#ffaac8",
            "on-secondary-container": "#6f5100",
            "on-tertiary-fixed-variant": "#71314c",
            "on-error-container": "#93000a",
            "secondary-fixed-dim": "#f9bd22",
            "surface-bright": "#fff9ee",
            "on-secondary-fixed": "#261a00",
            "background": "#fff9ee",
            "inverse-on-surface": "#f6f0e5",
            "surface-variant": "#e8e2d7",
            "primary-fixed": "#bcf0ae",
            "surface-container-low": "#f9f3e8",
            "on-secondary-fixed-variant": "#5c4300",
            "tertiary": "#60233e",
            "error": "#ba1a1a",
            "tertiary-fixed": "#ffd9e4",
            "on-primary": "#ffffff",
            "on-background": "#1d1b15",
            "outline": "#72796e",
            "on-tertiary-fixed": "#3b0520"
        },
        "borderRadius": {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
        },
        "fontFamily": {
            "headline": ["Plus Jakarta Sans"],
            "body": ["Inter"],
            "label": ["Inter"]
        }
        },
    },
    }
</script>
`;

oldIndex = oldIndex.replace('</head>', tailwindStuff + '</head>');
fs.writeFileSync('index.html', oldIndex);

console.log("Conversion complete.");
