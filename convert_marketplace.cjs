const fs = require('fs');

function convertHtmlToJsx(htmlPath, outputPath, componentName) {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Extract body content
    let bodyStart = html.indexOf('<body');
    let bodyEnd = html.indexOf('</body>');
    let bodyTagEnd = html.indexOf('>', bodyStart) + 1;
    let bodyContent = html.substring(bodyTagEnd, bodyEnd);

    // Replace class with className and other raw conversions
    bodyContent = bodyContent.replace(/class=/g, 'className=');
    bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
    bodyContent = bodyContent.replace(/<!--.*?-->/gs, '');

    // Self-closing tags fix for react (br, hr, img, input)
    bodyContent = bodyContent.replace(/<hr(.*?)>/g, (match, attrs) => attrs.trim().endsWith('/') ? match : `<hr${attrs}/>`);
    bodyContent = bodyContent.replace(/<br(.*?)>/g, (match, attrs) => attrs.trim().endsWith('/') ? match : `<br${attrs}/>`);
    bodyContent = bodyContent.replace(/<img(?!.*?\/>)([^>]+)>/g, '<img$1/>');
    bodyContent = bodyContent.replace(/<input(?!.*?\/>)([^>]+)>/g, '<input$1/>');
    
    // Replace href="#" with meaningful links or Link components later
    // bodyContent = bodyContent.replace(/href="#"/g, 'href="javascript:void(0)"');

    const jsx = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function ${componentName}() {\n  return (\n    <div className="bg-background text-on-background min-h-screen flex flex-col">\n      ${bodyContent}\n    </div>\n  );\n}`;

    fs.writeFileSync(outputPath, jsx);
}

convertHtmlToJsx('marketplace_listing/code.html', 'src/Marketplace.jsx', 'Marketplace');
console.log("Marketplace component created.");
