
export function getErrorMessage(error: any) {
  let message = null;
  if (error.code === 11000) {
    message = error.errmsg.includes('contact')
      ? 'This phone number has already been used.' : message;

    message = error.errmsg.includes('email')
      ? 'This Email has already been taken' : message;
  }
  return message || error;
}
