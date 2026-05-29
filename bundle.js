import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

try {
  // Read files in assets
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find(f => f.endsWith('.js'));
  const cssFile = files.find(f => f.endsWith('.css'));

  if (!jsFile || !cssFile) {
    console.error("Could not find js or css files in assets!");
    process.exit(1);
  }

  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

  let htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // Log all script and link tags in the source HTML for debugging
  console.log("--- Tags found in dist/index.html ---");
  const scriptTags = htmlContent.match(/<script[^>]*>/gi) || [];
  const linkTags = htmlContent.match(/<link[^>]*>/gi) || [];
  console.log("Script tags:", scriptTags);
  console.log("Link tags:", linkTags);

  // Convert apple touch icon to base64
  const iconPath = path.join(process.cwd(), 'public', 'apple-touch-icon.png');
  let base64Icon = '';
  if (fs.existsSync(iconPath)) {
    const iconBuffer = fs.readFileSync(iconPath);
    base64Icon = `data:image/png;base64,${iconBuffer.toString('base64')}`;
  }

  // Remove all modulepreload links as they cause CORS/net::ERR_FILE_NOT_FOUND errors on file://
  htmlContent = htmlContent.replace(/<link[^>]*rel="modulepreload"[^>]*>/gi, '');
  htmlContent = htmlContent.replace(/<link[^>]*href="[^"]*"[^>]*rel="modulepreload"[^>]*>/gi, '');

  // Replace apple-touch-icon and icon with Base64 inlined versions
  if (base64Icon) {
    htmlContent = htmlContent.replace(/<link[^>]*rel="apple-touch-icon"[^>]*href="[^"]*"[^>]*>/gi, () => `<link rel="apple-touch-icon" href="${base64Icon}" />`);
    htmlContent = htmlContent.replace(/<link[^>]*type="image\/png"[^>]*href="[^"]*"[^>]*>/gi, () => `<link rel="icon" type="image/png" href="${base64Icon}" />`);
  }

  // Replace CSS link tag with inline style tag
  htmlContent = htmlContent.replace(/<link[^>]*href="\/assets\/[^"]*"[^>]*>/gi, () => `<style>${cssContent}</style>`);
  
  // Replace references to /apple-touch-icon.png inside the JS code with the Base64 inlined version
  let finalJsContent = jsContent;
  if (base64Icon) {
    finalJsContent = jsContent.replace(/"\/apple-touch-icon\.png"/g, () => `"${base64Icon}"`);
  }

  // Replace JS script tag with inline script tag
  htmlContent = htmlContent.replace(/<script[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/gi, () => `<script>${finalJsContent}</script>`);

  // Log final script and link tags
  console.log("--- Tags in final index_single.html ---");
  const finalScriptTags = htmlContent.match(/<script[^>]*>/gi) || [];
  const finalLinkTags = htmlContent.match(/<link[^>]*>/gi) || [];
  console.log("Final Script tags:", finalScriptTags);
  console.log("Final Link tags:", finalLinkTags);

  // Write single standalone HTML file to root and dist
  fs.writeFileSync(path.join(process.cwd(), 'index_single.html'), htmlContent);
  fs.writeFileSync(path.join(process.cwd(), 'index.html'), htmlContent);
  fs.writeFileSync(path.join(distDir, 'index_single.html'), htmlContent);
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);

  console.log("Successfully bundled single, self-contained index.html and index_single.html files with embedded assets and icon!");
} catch (error) {
  console.error("Bundling failed:", error);
  process.exit(1);
}
