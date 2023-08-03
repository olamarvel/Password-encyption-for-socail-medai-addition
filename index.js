const express = require("express");
const crypto = require("crypto");
const app = express();
const path = require("path");

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the frontend JavaScript file and Tailwind CSS
app.use(express.static(path.join(__dirname, ".")));

// Endpoint for encrypting the password with shared keys
app.post("/generatePassword", (req, res) => {
  const { key1, key2 } = req.body;

  // Validate inputs
  if (!key1 || !key2) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Generate a random password as random bytes
  const passwordBytes = crypto.randomBytes(16);
  const generatedPassword = passwordBytes.toString("hex");

  // Split the password into two parts
  const halfLength = Math.ceil(generatedPassword.length / 2);
  const firstHalf = generatedPassword.slice(0, halfLength);
  const secondHalf = generatedPassword.slice(halfLength);

  // Derive 32-byte keys using SHA-256
  const key1_32bytes = crypto.createHash('sha256').update(key1).digest();
  const key2_32bytes = crypto.createHash('sha256').update(key2).digest();

  // Encrypt the password halves
  const encryptedPassword1 = encryptPassword(firstHalf, key1_32bytes);
  const encryptedPassword2 = encryptPassword(secondHalf, key2_32bytes);

  res.json({
    generatedPassword,
    iv1: encryptedPassword1.iv,
    encryptedPassword1: encryptedPassword1.encryptedPassword,
    key1,
    iv2: encryptedPassword2.iv,
    encryptedPassword2: encryptedPassword2.encryptedPassword,
    key2,
  });
})// Endpoint for decrypting the password using the user-provided IVs and the shared keys
app.post("/decrypt", (req, res) => {
  const { iv1, encryptedPassword1, key1, iv2, encryptedPassword2, key2 } = req.body;

  // Validate inputs
  if (!iv1 || !encryptedPassword1 || !key1 || !iv2 || !encryptedPassword2 || !key2) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Convert keys to 32-byte using SHA-256
  const key1_32bytes = crypto.createHash('sha256').update(key1).digest();
  const key2_32bytes = crypto.createHash('sha256').update(key2).digest();

  // Decrypt the password
  const decryptedPassword1 = decryptPassword(encryptedPassword1, iv1, key1_32bytes);
  const decryptedPassword2 = decryptPassword(encryptedPassword2, iv2, key2_32bytes);

  res.json({ decryptedPassword: decryptedPassword1 + decryptedPassword2 });
});

// Helper function to encrypt the password with a key and IV
function encryptPassword(password, key) {
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedPassword: encrypted, iv: iv.toString("hex") };
}

// Helper function to decrypt the password with a key and IV
function decryptPassword(encryptedPassword, iv, key) {
  const algorithm = "aes-256-cbc";
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
