import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
let currentUser = null;

function showElement(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

function getUserID(uid) {
  return uid ? uid.slice(-4) : "0000";
}

function copyUserID() {
  const id = document.getElementById("userID").querySelector("span").innerText;
  navigator.clipboard.writeText(id);
}

function deleteAccount() {
  if (currentUser) {
    deleteUser(currentUser).then(() => {
      alert("Account deleted.");
      location.reload();
    }).catch(err => {
      alert("Failed to delete account.");
    });
  }
}

function backToMenu() {
  hideElement("profilePage");
  showElement("mainMenu");
}

function showProfile() {
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const nickname = currentUser.displayName || `player_#${getUserID(currentUser.uid)}`;
  const userID = `#${getUserID(currentUser.uid)}`;
  const userEmail = currentUser.email || "unknown@gmail.com";

  document.getElementById("nickname").innerText = nickname;
  document.getElementById("userID").querySelector("span").innerText = userID;
  document.getElementById("userEmail").innerText = `Gmail: ${userEmail}`;
  document.getElementById("profilePic").src = currentUser.photoURL || "defaulticon.png";

  hideElement("mainMenu");
  showElement("profilePage");
}

function startGame() {
  alert("Game starting...");
}

document.addEventListener("DOMContentLoaded", () => {
  const profileIcon = document.getElementById("profileIcon");

  if (profileIcon) {
    profileIcon.addEventListener("click", () => {
      showProfile();
    });
  }

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });
});