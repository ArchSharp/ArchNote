import crypto from "crypto";

export const encryptData = (
  data: string,
  key: string | Buffer,
  iv: string | Buffer
): string => {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptData = (
  encryptedCode: string,
  encryptionKey: string | Buffer,
  initializationVector: string | Buffer
): string => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    initializationVector
  );
  let decryptedCode = decipher.update(encryptedCode, "hex", "utf8");
  decryptedCode += decipher.final("utf8");
  return decryptedCode;
};

export const generateEncryptionKey = (num: number = 32) => {
  //return crypto.randomBytes(32); //.toString("hex"); // 32 bytes = 256 bits
  return crypto.scryptSync("ArchNote", "ArchIntel", num);
};

export const generateInitializationVector = (num: number = 16) => {
  return crypto.randomBytes(num); //.toString("hex"); // 16 bytes = 128 bits
};
