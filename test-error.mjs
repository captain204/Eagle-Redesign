import https from 'http';
const data = JSON.stringify([{"args":{"collectionSlug":"users","docPermissions":{},"docPreferences":{},"operation":"create","schemaPath":""},"name":"form-state"}]);
const req = https.request({
  hostname: 'localhost',
  port: 3000,
  path: '/app/(payload)/actions', // or however we call serverFunction
  method: 'POST',
}, (res) => {
  res.on('data', d => process.stdout.write(d))
});
req.write(data);
req.end();
