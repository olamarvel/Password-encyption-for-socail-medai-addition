// Define constants for elements
const elements = {
  encryptionPage: document.getElementById("encryptionPage"),
  decryptionPage: document.getElementById("decryptionPage"),
  encryptionTab: document.getElementById("encryptionTab"),
  decryptionTab: document.getElementById("decryptionTab"),
  encryptionForm: document.getElementById("encryptionForm"),
  decryptionForm: document.getElementById("decryptionForm"),
  generatedPassword: document.getElementById("generatedPassword"),
  encryptedPassword1: document.getElementById("encryptedPassword1"),
  encryptedPassword2: document.getElementById("encryptedPassword2"),
  iv1: document.getElementById("iv1"),
  iv2: document.getElementById("iv2"),
  decryptedPasswordValue: document.getElementById("decryptedPasswordValue"),
  copyButtons: {
    generatedPassword: document.getElementById("copyGeneratedPassword"),
    encryptedPassword1: document.getElementById("copyEncryptedPassword1"),
    encryptedPassword2: document.getElementById("copyEncryptedPassword2"),
    iv1: document.getElementById("copyIV1"),
    iv2: document.getElementById("copyIV2"),
  },
  downloadButton: document.getElementById("downloadEncryptions"),
};

// Define constants for classes
const classes = {
  hidden: "hidden",
  activeTab: ["bg-blue-500", "text-white"],
  inactiveTab: "bg-blue-200",
};

// Define a global variable to store the server response
let serverResponse = null;

// Define event listeners
elements.encryptionTab.addEventListener("click", () => toggleTab(true));
elements.decryptionTab.addEventListener("click", () => toggleTab(false));
elements.encryptionForm.addEventListener("submit", (event) => handleFormSubmit(event, "/generatePassword", true));
elements.decryptionForm.addEventListener("submit", (event) => handleFormSubmit(event, "/decrypt", false));
Object.keys(elements.copyButtons).forEach((key) => {
  elements.copyButtons[key].addEventListener("click", () => copyToClipboard(serverResponse[key]));
});
elements.downloadButton.addEventListener("click", () => {
  const [encryptionResult1, encryptionResult2] = getEncryptionResult();
  downloadResult("encryption_result_part1.txt", encryptionResult1, "encryption_result_part2.txt", encryptionResult2);
});

// Toggle tab function
function toggleTab(isEncryptionTab) {
  elements.encryptionPage.classList.toggle(classes.hidden, !isEncryptionTab);
  elements.decryptionPage.classList.toggle(classes.hidden, isEncryptionTab);
  elements.encryptionTab.classList.toggle(classes.activeTab, isEncryptionTab);
  elements.encryptionTab.classList.toggle(classes.inactiveTab, !isEncryptionTab);
  elements.decryptionTab.classList.toggle(classes.activeTab, !isEncryptionTab);
  elements.decryptionTab.classList.toggle(classes.inactiveTab, isEncryptionTab);
}

// Handle form submit function
async function handleFormSubmit(event, url, isEncryption) {
  event.preventDefault();

  const formData = getFormData(isEncryption);
  serverResponse = await fetchData(url, formData);
  updateDOM(serverResponse, isEncryption);
}

// Fetch data function
async function fetchData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Get form data function
function getFormData(isEncryption) {
  if (isEncryption) {
    return {
      key1: document.getElementById("key1").value,
      key2: document.getElementById("key2").value,
    };
  } else {
    return {
      iv1: document.getElementById("iv1").value,
      encryptedPassword1: document.getElementById("encryptedPassword1").value,
      decryptionKey1: document.getElementById("decryptionKey1").value,
      iv2: document.getElementById("iv2").value,
      encryptedPassword2: document.getElementById("encryptedPassword2").value,
      decryptionKey2: document.getElementById("decryptionKey2").value,
    };
  }
}

// Update DOM function
function updateDOM(data, isEncryption) {
  if (isEncryption) {
    elements.generatedPassword.innerHTML = 'x'.repeat(data.generatedPassword.length) + '<span class="display-icon">👁️</span>';
    elements.encryptedPassword1.innerHTML = 'x'.repeat(data.encryptedPassword1.length) + '<span class="display-icon">👁️</span>';
    elements.encryptedPassword2.innerHTML = 'x'.repeat(data.encryptedPassword2.length) + '<span class="display-icon">👁️</span>';
    elements.iv1.innerHTML = 'x'.repeat(data.iv1.length) + '<span class="display-icon">👁️</span>';
    elements.iv2.innerHTML = 'x'.repeat(data.iv2.length) + '<span class="display-icon">👁️</span>';

    document.getElementById("generatedPasswordDiv").classList.remove(classes.hidden);
    document.getElementById("encryptedPasswords").classList.remove(classes.hidden);
    elements.decryptionPage.classList.add(classes.hidden);
  } else {
    elements.decryptedPasswordValue.innerText = data.decryptedPassword;
    document.getElementById("decryptedPassword").classList.remove(classes.hidden);
  }
}

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => console.log("Copied to clipboard successfully!"),
    (err) => console.error("Failed to copy: ", err)
  );
}

// Download result function
// Download result function
function downloadResult(filename1, text1, filename2, text2) {
  const element1 = document.createElement("a");
  element1.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text1));
  element1.setAttribute("download", filename1);
  element1.style.display = "none";
  document.body.appendChild(element1);
  element1.click();
  document.body.removeChild(element1);

  setTimeout(() => {
    const element2 = document.createElement("a");
    element2.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text2));
    element2.setAttribute("download", filename2);
    element2.style.display = "none";
    document.body.appendChild(element2);
    element2.click();
    document.body.removeChild(element2);
  }, 3000); // delay of 3second
}


// Get encryption result function
// Get encryption result function 
function getEncryptionResult() {
  const result1 = `Generated Password: ${serverResponse.generatedPassword}\nEncrypted Password 1: ${serverResponse.encryptedPassword1}\nIV 1: ${serverResponse.iv1}`;
  const result2 = `Generated Password: ${serverResponse.generatedPassword}\nEncrypted Password 2: ${serverResponse.encryptedPassword2}\nIV 2: ${serverResponse.iv2}`;
  return [result1, result2];
}
