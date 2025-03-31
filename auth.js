// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// 🔥 Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyA67zQZjfC62EOBAcDRx5x8QjjDOZ6ZgM8",
    authDomain: "urisense-8054d.firebaseapp.com",
    projectId: "urisense-8054d",
    storageBucket: "urisense-8054d.firebasestorage.app",
    messagingSenderId: "223811720665",
    appId: "1:223811720665:web:071a126d7cd8b9220375c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🚀 Register User & Send Verification Email
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.querySelector(".btn-register");
    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            const name = document.getElementById("register-name").value;
            const age = document.getElementById("register-age").value;
            const occupation = document.getElementById("register-occupation").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            if (name && age && occupation && email && password) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // ✅ Send Email Verification
                    await sendEmailVerification(user);
                    alert("Registration successful! A verification email has been sent. Please verify before logging in.");

                    // ✅ Start Checking for Verification in the Background
                    checkEmailVerification(user);
                } catch (error) {
                    document.getElementById("register-error").textContent = error.message;
                }
            } else {
                alert("Please fill all fields!");
            }
        });
    }

    // 🔑 Login User (Only if Verified)
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            if (email && password) {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // ✅ Check if Email is Verified
                    if (user.emailVerified) {
                        alert("Login successful!");
                        window.location.href = "index.html"; // Redirect to home
                    } else {
                        alert("Please verify your email before logging in.");
                        await signOut(auth); // ❌ Force logout if not verified
                    }
                } catch (error) {
                    document.getElementById("login-error").textContent = error.message;
                }
            } else {
                alert("Please enter email and password!");
            }
        });
    }

    // 🔓 Logout User
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await signOut(auth);
            alert("Logged out!");
            window.location.href = "login.html";
        });
    }

    // 👤 Check Authentication State
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await user.reload(); // Ensure latest user data

            if (user.emailVerified) {
                // ✅ User Verified: Show Profile, Hide Login/Register
                document.getElementById("login-btn").style.display = "none";
                document.getElementById("register-btn").style.display = "none";
                document.getElementById("profile-btn").style.display = "block";
                console.log("User logged in: ", user.email);
            } else {
                // ❌ User NOT Verified: Show alert, force logout
                alert("Please verify your email first!");
                signOut(auth);
            }
        } else {
            console.log("No user logged in");
            document.getElementById("login-btn").style.display = "block";
            document.getElementById("register-btn").style.display = "block";
            document.getElementById("profile-btn").style.display = "none";
        }
    });
});

// ✅ Function to Check Email Verification Periodically
function checkEmailVerification(user) {
    const interval = setInterval(async () => {
        await user.reload(); // Refresh user data

        if (user.emailVerified) {
            clearInterval(interval); // Stop checking
            alert("Email verified! Redirecting...");
            window.location.href = "index.html"; // ✅ Redirect to index.html
        }
    }, 3000); // Check every 3 seconds
}
