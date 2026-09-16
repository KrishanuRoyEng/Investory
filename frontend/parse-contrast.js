const r = require('./lh-report.json');
let found = false;
Object.values(r.audits).forEach(a => {
  if (a.id === 'color-contrast') {
    found = true;
    console.log("Color Contrast Score:", a.score);
    if (a.details && a.details.items) {
      a.details.items.forEach(item => {
        console.log(`Node: ${item.node.snippet}`);
        // Log all data for debugging
        console.log(JSON.stringify(item));
      });
    }
  }
});
if (!found) console.log("Color contrast audit not found!");
