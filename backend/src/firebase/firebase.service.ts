import * as admin from 'firebase-admin';
import * as path from 'path';

export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    const serviceAccount = require(
      path.resolve(
        __dirname,
        'backend/config/awp-hql-firebase-adminsdk-nyqoj-b5093b4329.json',
      ),
    );

    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add other configurations if needed
    });
  }

  getAdmin(): admin.app.App {
    return this.firebaseAdmin;
  }
}
