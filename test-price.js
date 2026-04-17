const fetch = require('node-fetch');
async function run() {
  const res = await fetch('http://127.0.0.1:3000/api/products');
  const data = await res.json();
  console.log(JSON.stringify(data.docs.slice(0, 2), null, 2));
}
run();
