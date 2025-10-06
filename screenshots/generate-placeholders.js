// Simple script to create placeholder images for screenshots
// This creates basic HTML files that can be converted to images

const fs = require('fs');
const path = require('path');

const screenshots = [
  {
    name: 'home-screen.png',
    title: 'Home Screen',
    description: 'Featured Properties & Recommendations',
    features: ['Featured Properties', 'Our Recommendations', 'Search Bar', 'User Profile']
  },
  {
    name: 'property-details.png', 
    title: 'Property Details',
    description: 'Image Gallery & Reviews',
    features: ['Property Gallery', 'User Reviews', 'Agent Info', 'Book Now Button']
  },
  {
    name: 'explore-screen.png',
    title: 'Explore Screen', 
    description: 'Search & Filter System',
    features: ['Search Filters', 'Property Grid', 'Filter Options', 'Results Count']
  }
];

screenshots.forEach(screenshot => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${screenshot.title} - Homyz App</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .phone-mockup {
      width: 375px;
      height: 812px;
      background: #000;
      border-radius: 40px;
      padding: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      position: relative;
    }
    .screen {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 30px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .app-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: white;
    }
    h1 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .subtitle {
      color: #666;
      margin: 0 0 30px 0;
      font-size: 16px;
    }
    .features {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .features li {
      background: #f8f9fa;
      margin: 10px 0;
      padding: 15px;
      border-radius: 10px;
      color: #333;
      font-weight: 500;
    }
    .status {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff6b6b;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="phone-mockup">
    <div class="status">PLACEHOLDER</div>
    <div class="screen">
      <div class="app-icon">🏡</div>
      <h1>${screenshot.title}</h1>
      <p class="subtitle">${screenshot.description}</p>
      <ul class="features">
        ${screenshot.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, `${screenshot.name.replace('.png', '.html')}`), html);
  console.log(`Created placeholder for ${screenshot.name}`);
});

console.log('Placeholder HTML files created. Convert to PNG using browser or screenshot tool.');
