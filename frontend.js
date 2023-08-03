// Previous JS code (unchanged)
const encryptionPage = document.getElementById("encryptionPage");
const decryptionPage = document.getElementById("decryptionPage");
const encryptionTab = document.getElementById("encryptionTab");
const decryptionTab = document.getElementById("decryptionTab");

encryptionTab.addEventListener("click", () => {
  encryptionPage.classList.remove("hidden");
  decryptionPage.classList.add("hidden");
  encryptionTab.classList.add("bg-blue-500", "text-white");
  encryptionTab.classList.remove("bg-blue-200");
  decryptionTab.classList.remove("bg-blue-500", "text-white");
  decryptionTab.classList.add("bg-blue-200");
});

decryptionTab.addEventListener("click", () => {
  encryptionPage.classList.add("hidden");
  decryptionPage.classList.remove("hidden");
  encryptionTab.classList.remove("bg-blue-500", "text-white");
  encryptionTab.classList.add("bg-blue-200");
  decryptionTab.classList.add("bg-blue-500", "text-white");
  decryptionTab.classList.remove("bg-blue-200");
});

const encryptionForm = document.getElementById("encryptionForm");
const decryptionForm = document.getElementById("decryptionForm");

encryptionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const key1 = document.getElementById("key1").value;
  const key2 = document.getElementById("key2").value;

  const response = await fetch("/generatePassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key1, key2 }),
  });

  const data = await response.json();
  document.getElementById("generatedPassword").innerHTML = 'x'.repeat(data.generatedPassword.length) + '<span class="display-icon">👁️</span>';
  document.getElementById("encryptedPassword1").innerHTML = 'x'.repeat(data.encryptedPassword1.length) + '<span class="display-icon">👁️</span>';
  document.getElementById("encryptedPassword2").innerHTML = 'x'.repeat(data.encryptedPassword2.length) + '<span class="display-icon">👁️</span>';
  document.getElementById("iv1").innerHTML = 'x'.repeat(data.iv1.length) + '<span class="display-icon">👁️</span>';
  document.getElementById("iv2").innerHTML = 'x'.repeat(data.iv2.length) + '<span class="display-icon">👁️</span>';

  document.getElementById("generatedPasswordDiv").classList.remove("hidden");
  document.getElementById("encryptedPasswords").classList.remove("hidden");
  decryptionPage.classList.add("hidden");
});

decryptionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const iv1 = document.getElementById("iv1").value;
  const encryptedPassword1 = document.getElementById("encryptedPassword1").value;
  const key1 = document.getElementById("decryptionKey1").value;
  const iv2 = document.getElementById("iv2").value;
  const encryptedPassword2 = document.getElementById("encryptedPassword2").value;
  const key2 = document.getElementById("decryptionKey2").value;

  const response = await fetch("/decrypt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ iv1, encryptedPassword1, key1, iv2, encryptedPassword2, key2 }),
  });

  const data = await response.json();
  document.getElementById("decryptedPasswordValue").innerText = data.decryptedPassword;

  document.getElementById("decryptedPassword").classList.remove("hidden");
});

// Copy Button Functionality
document.getElementById("copyGeneratedPassword").addEventListener("click", () => {
  const generatedPassword = document.getElementById("generatedPassword").innerText;
  copyToClipboard(generatedPassword);
});

document.getElementById("copyEncryptedPassword1").addEventListener("click", () => {
  const encryptedPassword1 = document.getElementById("encryptedPassword1").innerText;
  copyToClipboard(encryptedPassword1);
});

document.getElementById("copyEncryptedPassword2").addEventListener("click", () => {
  const encryptedPassword2 = document.getElementById("encryptedPassword2").innerText;
  copyToClipboard(encryptedPassword2);
});

document.getElementById("copyIV1").addEventListener("click", () => {
  const iv1 = document.getElementById("iv1").innerText;
  copyToClipboard(iv1);
});

document.getElementById("copyIV2").addEventListener("click", () => {
  const iv2 = document.getElementById("iv2").innerText;
  copyToClipboard(iv2);
});

// Download Button Functionality
document.getElementById("downloadEncryptions").addEventListener("click", () => {
  const encryptionResult = getEncryptionResult();
  downloadResult("encryption_result.txt", encryptionResult);
});

function getEncryptionResult() {
  const generatedPassword = document.getElementById("generatedPassword").innerText;
  const passwordElement1 = document.getElementById("encryptedPassword1");
  const ivElement1 = document.getElementById("iv1");
  const passwordElement2 = document.getElementById("encryptedPassword2");
  const ivElement2 = document.getElementById("iv2");
  return `Generated Password: ${generatedPassword}\nEncrypted Password 1: ${passwordElement1.innerText}\nIV 1: ${ivElement1.innerText}\nEncrypted Password 2: ${passwordElement2.innerText}\nIV 2: ${ivElement2.innerText}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Copied to clipboard successfully!");
    },
    (err) => {
      console.error("Failed to copy: ", err);
    }
  );
}

function downloadResult(filename, text) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
