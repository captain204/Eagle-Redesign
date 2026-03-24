// @ts-nocheck
import configPromise from './src/payload.config';

async function check() {
  try {
    const config = await configPromise;
    let hasError = false;
    function checkFields(fields, path) {
      if (!fields) return;
      fields.forEach((f, i) => {
        const type = f.type;
        const currentPath = `${path}[${i}](${type})`;
        if (!['row', 'group', 'tabs', 'collapsible', 'ui', 'array', 'blocks'].includes(type) && !f.name) {
          console.error(`Missing name at ${currentPath}`);
          hasError = true;
        }
        if (type === 'group' && !f.name) {
          console.error(`Group missing name at ${currentPath}`);
          hasError = true;
        }
        if (type === 'array' && !f.name) {
          console.error(`Array missing name at ${currentPath}`);
          hasError = true;
        }
        if (type === 'tabs' && f.tabs) {
          f.tabs.forEach((tab, j) => {
            if (tab.name) { } // Tabs can have names or not
            checkFields(tab.fields, `${currentPath}.tabs[${j}]`);
          });
        }
        if (f.fields) checkFields(f.fields, currentPath);
      });
    }

    config.collections.forEach(c => {
      checkFields(c.fields, `Collection(${c.slug})`);
    });
    config.globals.forEach(g => {
      checkFields(g.fields, `Global(${g.slug})`);
    });
    if (!hasError) console.log("Schema is fully named.");
  } catch (e) {
    console.error("Failed to load config", e);
  }
}
check();
