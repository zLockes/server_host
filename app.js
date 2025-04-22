// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyANkJLaIZwhqwYpgVUzZsIBUtenNMW2QQ0",
  authDomain: "kbbig-s.firebaseapp.com",
  projectId: "kbbig-s",
  storageBucket: "kbbig-s.appspot.com",
  messagingSenderId: "616380393795",
  appId: "1:616380393795:web:f95558aadf8b4c520327f6",
  measurementId: "G-0X9K79WRLW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for DOM + Firebase to load
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  loadingScreen.style.display = "none";

  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      showMainMenu();
      updateProfileUI(user);
    } else {
      showMainMenu();
    }
  });
});

// Helper DOM functions
const showElement = (id) => document.getElementById(id).classList.add("visible");
const hideElement = (id) => document.getElementById(id).classList.remove("visible");
const showModal = (id) => document.getElementById(id).style.display = "flex";
const hideModal = (id) => document.getElementById(id).style.display = "none";

// Event bindings
document.getElementById("profileIcon").onclick = () => {
  const user = auth.currentUser;
  if (!user) {
    showModal("loginModal");
  } else {
    showProfile();
  }
};

document.getElementById("closeLogin").onclick = () => hideModal("loginModal");
document.getElementById("closeRegister").onclick = () => hideModal("registerModal");
document.getElementById("toRegister").onclick = () => {
  hideModal("loginModal");
  showModal("registerModal");
};

// Auth functions
window.login = async () => {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (!result.user.emailVerified) {
      alert("Please verify your email before logging in.");
      await signOut(auth);
    } else {
      hideModal("loginModal");
      showMainMenu();
    }
  } catch (err) {
    alert("Login error: " + err.message);
  }
};

window.register = async () => {
  const email = document.getElementById("registerEmail").value;
  const pass = document.getElementById("registerPassword").value;

  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(result.user);
    alert("Verification email sent. Check your inbox.");
    hideModal("registerModal");
  } catch (err) {
    alert("Register error: " + err.message);
  }
};

window.deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;

  if (confirm("Are you sure you want to delete your account? This is permanent.")) {
    try {
      await deleteUser(user);
      alert("Account deleted.");
      showMainMenu();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }
};

window.copyUserID = () => {
  const id = document.getElementById("userID").innerText;
  navigator.clipboard.writeText(id).then(() => {
    alert("Copied ID: " + id);
  });
};

window.startGame = () => {
  alert("Game starting... (stub)");
};

window.backToMenu = () => {
  hideElement("profilePage");
  showMainMenu();
};

// UI updates
function showMainMenu() {
  hideElement("profilePage");
  showElement("mainMenu");
}

function showProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const nickname = user.displayName || `player_${user.uid.slice(0, 6)}`;
  document.getElementById("nickname").innerText = nickname;
  document.getElementById("userID").innerText = user.uid.slice(0, 6);
  hideElement("mainMenu");
  showElement("profilePage");
}

function updateProfileUI(user) {
  const nickname = user.displayName || `player_${user.uid.slice(0, 6)}`;
  document.getElementById("nickname").innerText = nickname;
  document.getElementById("userID").innerText = user.uid.slice(0, 6);
}