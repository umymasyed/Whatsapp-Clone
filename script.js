let recorder, audioChunks;
const chat = document.getElementById("chat");
let isRecording = false;
const recordButton = document.getElementById("recordButton");

function toggleRecording() {
  if (isRecording) {
    recorder.stop();
    isRecording = false;
    recordButton.textContent = "🎙";
  } else {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        recorder = new MediaRecorder(stream);
        recorder.start();
        audioChunks = [];
        recorder.ondataavailable = event => audioChunks.push(event.data);
        recorder.onstop = sendAudio;
        isRecording = true;
        recordButton.textContent = "⏹️";
      })
      .catch(() => alert("Microphone access denied!"));
  }
}

function sendAudio() {
  const audioBlob = new Blob(audioChunks);
  const audioURL = URL.createObjectURL(audioBlob);
  chat.innerHTML += `
    <div class="message sent">
      <audio controls src="${audioURL}"></audio>
      <div class="timestamp">${getCurrentTime()}</div>
    </div>`;
  chat.scrollTop = chat.scrollHeight;
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function setWallpaper(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.documentElement.style.setProperty("--wallpaper", `url(${e.target.result})`);
    };
    reader.readAsDataURL(file);
  }
}

function updateWallpaper(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('chat').style.backgroundImage = `url(${e.target.result})`;
      document.body.style.backgroundImage = `url(${e.target.result})`;
    }
    reader.readAsDataURL(file);
  }
}

function toggleMenu() {}
function startRecording() {}
function sendMessage() {}
function showTyping() {}
function toggleTheme() {}
function updateProfile() {}

const status = document.getElementById("status");
const profilePopup = document.getElementById("profilePopup");
const randomReplies = [
  "Hello! How can I help? 😊",
  "Sounds good!",
  "Can you clarify that?",
  "Haha, that's funny! 😄",
  "I'm here if you need me.",
  "Interesting... tell me more!",
  "What’s your plan for today?",
  "I understand! 👍",
  "Wow, that’s amazing!",
  "Let's keep this conversation going!",
  "Great to hear from you!",
  "How can I assist you today?",
  "That's awesome! 😃",
  "Can you share more details?",
  "Oh, that's so cool! 😎",
  "You're doing great! Keep it up!",
  "I see! That's quite interesting.",
  "What else is on your mind?",
  "I love that idea! 💡",
  "How's your day going?"
];

function toggleMenu() {
  profilePopup.style.display =
    profilePopup.style.display === "block" ? "none" : "block";
}

function updateProfile() {
  const name = document.getElementById("nameInput").value;
  const picInput = document.getElementById("picInput").files[0];
  if (name) document.getElementById("profile-name").textContent = name;
  if (picInput) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("profile-pic").src = e.target.result;
    };
    reader.readAsDataURL(picInput);
  }
  toggleMenu();
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (message) {
    chat.innerHTML += `
      <div class="message sent">
        ${message}
        <div class="timestamp">${getCurrentTime()}</div>
      </div>`;
    input.value = "";
    status.textContent = "Online";
    chat.scrollTop = chat.scrollHeight;
    setTimeout(autoReply, 1000);
  }
}

function autoReply() {
  const randomIndex = Math.floor(Math.random() * randomReplies.length);
  const replyMessage = randomReplies[randomIndex];
  chat.innerHTML += `
    <div class="message received">
      ${replyMessage}
      <div class="timestamp">${getCurrentTime()}</div>
    </div>`;
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById("fileInput").addEventListener("change", (event) => {    
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type.startsWith("image")) {
        chat.innerHTML += `
          <div class="message sent">
            <img src="${e.target.result}" alt="Media">
            <div class="timestamp">${getCurrentTime()}</div>
          </div>`;
      } else if (file.type.startsWith("video")) {
        chat.innerHTML += `
          <div class="message sent">
            <video controls src="${e.target.result}"></video>
            <div class="timestamp">${getCurrentTime()}</div>
          </div>`;
      } else {
        chat.innerHTML += `
          <div class="message sent">
            <a href="${e.target.result}" download>${file.name}</a>
            <div class="timestamp">${getCurrentTime()}</div>
          </div>`;
      }
      chat.scrollTop = chat.scrollHeight;
    };
    reader.readAsDataURL(file);
  }
});

let typingTimer;
function showTyping() {
  status.textContent = "Typing...";
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    status.textContent = "Online";
  }, 2000);
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
});
function showNotification(message) {
  if (!notificationsEnabled) return;
  
  const notificationPopup = document.getElementById("notification-popup");
  notificationPopup.textContent = `New Message: ${message}`;
  notificationPopup.style.display = "block";

  setTimeout(() => {
    notificationPopup.style.display = "none";
  }, 3000);
}

function autoReply() {
  const randomIndex = Math.floor(Math.random() * randomReplies.length);
  const replyMessage = randomReplies[randomIndex];

  chat.innerHTML += `
    <div class="message received">
      ${replyMessage}
      <div class="timestamp">${getCurrentTime()}</div>
    </div>`;
  chat.scrollTop = chat.scrollHeight;

  showNotification(replyMessage);
}

let notificationsEnabled = true;

function toggleNotifications() {
  notificationsEnabled = !notificationsEnabled;
  const notificationToggle = document.getElementById("notificationToggle");
  notificationToggle.textContent = notificationsEnabled ? "Notifications: ON" : "Notifications: OFF";
}
