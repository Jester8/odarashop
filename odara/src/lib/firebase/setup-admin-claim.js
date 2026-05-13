// setup-admin-claim.js
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'odara-3eaf6'
});

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim set for ${email}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Replace with your admin email
setAdminClaim('samuelolu407@gmail.com');