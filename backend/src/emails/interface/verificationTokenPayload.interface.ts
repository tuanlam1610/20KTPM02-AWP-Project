interface VerificationTokenPayload {
  email: string;
}

export default VerificationTokenPayload;

export interface VerificationTokenInvitePayload {
  email: string;
  classId: string;
}
