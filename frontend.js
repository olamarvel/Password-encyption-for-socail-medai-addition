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

  const password = document.getElementById("password").value;
  const key1 = document.getElementById("key1").value;
  const key2 = document.getElementById("key2").value;

  const response = await fetch("/encrypt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, key1, key2 }),
  });

  const data = await response.json();
  document.getElementById("encryptedPassword1").innerText = data.encryptedPassword1.encryptedPassword;
  document.getElementById("encryptedPassword2").innerText = data.encryptedPassword2.encryptedPassword;
  document.getElementById("iv1").innerText = data.encryptedPassword1.iv;
  document.getElementById("iv2").innerText = data.encryptedPassword2.iv;

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
document.getElementById("copyEncryptedPassword1").addEventListener("click", () => {
  const encryptedPassword1 = document.getElementById("encryptedPassword1").innerText;
  copyToClipboard(encryptedPassword1);
});

document.getElementById("copyEncryptedPassword2").addEventListener("click", () => {
  const encryptedPassword2 = document.getElementById("encryptedPassword2").innerText;
  copyToClipboard(encryptedPassword2);
});

// Download Button Functionality
document.getElementById("downloadEncryption1").addEventListener("click", () => {
  downloadResult("encryption1_result.txt", getEncryptionResult(1));
});

document.getElementById("downloadEncryption2").addEventListener("click", () => {
  downloadResult("encryption2_result.txt", getEncryptionResult(2));
});

function getEncryptionResult(encryptionNumber) {
  const passwordElement = document.getElementById(`encryptedPassword${encryptionNumber}`);
  const ivElement = document.getElementById(`iv${encryptionNumber}`);
  return `Encrypted Password ${encryptionNumber}: ${passwordElement.innerText}\nIV ${encryptionNumber}: ${ivElement.innerText}`;
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

