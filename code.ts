figma.showUI(__html__, { width: 620, height: 420 });
// Show a simple UI to upload an SVG file
// figma.showUI(`
//   <html>
//     <input type="file" id="upload" accept=".svg" />
//     <script>
//       document.getElementById('upload').onchange = function(event) {
//         const file = event.target.files[0];
//         const reader = new FileReader();
//         reader.onload = function(e) {
//           const svgData = e.target.result;
//           parent.postMessage({ pluginMessage: { type: 'import-svg', svgData } }, '*');
//         };
//         reader.readAsText(file);
//       };
//     </script>
//   </html>
// `, { width: 300, height: 200 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'import-svg') {
    const svgNode = figma.createNodeFromSvg(msg.svgData);
    figma.currentPage.appendChild(svgNode);

    // Optionally adjust position or other properties of the imported SVG
    svgNode.x = 100;
    svgNode.y = 100;

    figma.viewport.scrollAndZoomIntoView([svgNode]);
    figma.closePlugin();
  }
};

figma.on('drop', (event: DropEvent) => {
  console.log('[plugin] drop received!!', event);
  const { items } = event;

  if (items.length > 0 && items[0].type === 'image/svg+xml') {
    const data = items[0].data

    const newNode = figma.createNodeFromSvg(data);
    newNode.x = event.absoluteX;
    newNode.y = event.absoluteY;

    figma.currentPage.selection = [newNode];
  }

  return false;
});