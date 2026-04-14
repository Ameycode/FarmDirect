const fs = require('fs');

function convertHtmlToJsx(htmlPath, outputPath, componentName) {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Extract body content or main content
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
    // img and input tags might need self closing if they aren't, the regex needs to be careful not to break already closed
    bodyContent = bodyContent.replace(/<img(?!.*?\/>)([^>]+)>/g, '<img$1/>');
    bodyContent = bodyContent.replace(/<input(?!.*?\/>)([^>]+)>/g, '<input$1/>');
    bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, p1) => {
        // Very basic style object string builder - assuming a single simple rule like font-variation-settings
        if (p1.includes('font-variation-settings')) {
           return `style={{ fontVariationSettings: "'FILL' 1" }}`;
        }
        return match;
    });


    const jsx = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function ${componentName}() {\n  return (\n    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">\n      ${bodyContent}\n    </div>\n  );\n}`;

    fs.writeFileSync(outputPath, jsx);
}

convertHtmlToJsx('login_registration/code.html', 'src/Login.jsx', 'Login');
console.log("Login component created.");
