import * as admin from 'firebase-admin';

export const FireBaseConfig = [
  {
    provide: 'FireBaseConfig',
    useFactory: async () => {
      const firebaseAdminConfig = {
        type: process.env.FIRE_BASE_TYPE,
        project_id: process.env.FIRE_BASE_PROJECT_ID,
        private_key_id: process.env.FIRE_BASE_PRIVATE_KEY_ID,
        private_key: process.env.FIRE_BASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIRE_BASE_CLIENT_EMAIL,
        client_id: process.env.FIRE_BASE_CLIENT_ID,
        auth_uri: process.env.FIRE_BASE_AUTH_URI,
        token_uri: process.env.FIRE_BASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIRE_BASE_AUTH_PROVIDER,
        client_x509_cert_url: process.env.FIRE_BASE_CLIENT_CERT,
        universe_domain: process.env.FIRE_BASE_UNIVERSE_DOMAIN,
      };

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(firebaseAdminConfig as admin.ServiceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
      }
      return admin.app();
    },
  },
];
