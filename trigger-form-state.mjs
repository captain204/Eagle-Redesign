import http from 'http';

const data = JSON.stringify([
  {
    "args": {
      "collectionSlug": "users",
      "docPermissions": {},
      "docPreferences": {},
      "operation": "create",
      "schemaPath": "users"
    },
    "name": "form-state"
  }
]);

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/graphql', 
  // Wait, form state is not graphql. The endpoint in Payload 3 for form state is usually sent to /admin/... or server action.
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Next-Action': 'some-action-id'
  } // Next-Action might be required for server functions.
}, (res) => {
  res.on('data', d => process.stdout.write(d))
});
req.write(data);
req.end();
