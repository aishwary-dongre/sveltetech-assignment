import CryptoJS from 'crypto-js';

// In a real application, this should be an environment variable
const SECRET_KEY = 'your-secret-key-change-in-production';

export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};