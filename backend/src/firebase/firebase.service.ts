import * as admin from 'firebase-admin';
import * as path from 'path';

export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    const serviceAccount = require(
      path.resolve(
        __dirname,
        '../../config/awp-hql-firebase-adminsdk-nyqoj-b5093b4329.json',
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
  async decodeToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Unable to decode token');
    }
  }
}
