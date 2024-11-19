const webpush = require("web-push");

const vapidKeys = webpush.generateVAPIDKeys();

console.log("PUBLIC_VAPID_KEY:", vapidKeys.publicKey);
console.log("PRIVATE_VAPID_KEY:", vapidKeys.privateKey);
