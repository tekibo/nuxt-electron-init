export function getSplashHtmlTemplate(options: { appName: string; appDescription: string; templateType: string; color: string }) {
  const { appName, appDescription, templateType, color } = options;

  let bodyStyles = '';
  let containerStyles = '';
  let headerStyles = '';
  let textStyles = '';
  let loaderStyles = '';

  if (templateType === 'gradient') {
    bodyStyles = `background-color: #0f172a; color: white;`;
    containerStyles = ``;
    headerStyles = `background: linear-gradient(to right, ${color}, #ffffff); -webkit-background-clip: text; background-clip: text; color: transparent;`;
    textStyles = `color: #94a3b8;`;
    loaderStyles = `border-color: rgba(255, 255, 255, 0.1); border-top-color: ${color};`;
  } else if (templateType === 'solid') {
    bodyStyles = `background-color: #ffffff; color: #1f2937;`;
    containerStyles = ``;
    headerStyles = `color: ${color};`;
    textStyles = `color: #6b7280;`;
    loaderStyles = `border-color: rgba(0, 0, 0, 0.1); border-top-color: ${color};`;
  } else if (templateType === 'glass') {
    bodyStyles = `background: linear-gradient(135deg, ${color}33 0%, #0f172a 100%); color: white;`;
    containerStyles = `
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3rem 4rem;
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        `;
    headerStyles = `color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
    textStyles = `color: #e2e8f0;`;
    loaderStyles = `border-color: rgba(255, 255, 255, 0.1); border-top-color: ${color};`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading ${appName}...</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      ${bodyStyles}
    }

    .splash-container {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      ${containerStyles}
    }

    h1 {
      margin: 0;
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      ${headerStyles}
    }

    p {
      margin: 0;
      font-size: 0.875rem;
      ${textStyles}
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 3px solid;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
      ${loaderStyles}
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>
<body>
  <div class="splash-container">
    <div class="loader"></div>
    <div>
      <h1>${appName}</h1>
      <p>${appDescription}</p>
    </div>
  </div>
</body>
</html>
`;
}
