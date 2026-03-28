import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

/**
 * Encrypts the token using AES encryption
 * @param {string} token the token to encrypt
 * @returns {string} the encrypted token
 */
const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

/**
 * Decrypts the token using AES decryption
 * @param {string} encryptedToken the encrypted token to decrypt
 * @returns {string} the decrypted token
 */
const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Sets the encrypted token in the cookie
 * @param {string} token the token to be encrypted and set
 * @param {number} expiresInSeconds token lifetime in seconds
 */
export const setToken = (token: string, expiresInSeconds: number) => {
  const encryptedToken = encryptToken(token);
  const expires = new Date(Date.now() + expiresInSeconds * 1000);
  Cookies.set("lyncsToken", encryptedToken, {
    expires,
    sameSite: "Strict",
    secure: true,
  });
};

/**
 * @returns {string | undefined} the decrypted token if it exists, undefined otherwise
 */
export const getToken = (): string | undefined => {
  const encryptedToken = Cookies.get("lyncsToken");
  if (encryptedToken) {
    return decryptToken(encryptedToken);
  }
  return undefined;
};

/**
 * Removes the token from the cookie
 */
export const removeToken = () => {
  Cookies.remove("lyncsToken");
};
