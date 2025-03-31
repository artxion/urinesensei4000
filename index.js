const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio"); // If using Twilio
const axios = require("axios"); // If using Fast2SMS

admin.initializeApp();

// 🔹 Configure Nodemailer (Email)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sayax227q@gmail.com",
        pass: "p@SSWORD" // Use App Password if 2FA is enabled
    }
});

// 🔹 Configure Twilio (SMS) - Replace with your credentials
const twilioClient = twilio("ACa02a9c89d7931a258a6e11e0b85336a4", "a7b3938c7b8111cb541671920401e6b7");

// Cloud Function Triggered on New User Registration
exports.sendWelcomeNotification = functions.auth.user().onCreate(async (user) => {
    const email = user.email;
    const phoneNumber = user.phoneNumber; // Ensure phone authentication is enabled
    const fullName = user.displayName || "User";

    // Send Email
    const mailOptions = {

        from: "sayax227q@gmail.com",
        to: email,
        subject: "Registration Successful",
        text: `Hello ${fullName},\n\nYour registration was successful! Welcome to our platform.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", email);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }

    // Send SMS
    if (phoneNumber) {
        try {
            await twilioClient.messages.create({
                body: `Hello ${fullName}, your registration was successful! 🎉`,
                from: "+YourTwilioNumber",
                to: phoneNumber
            });
            console.log("✅ SMS sent to:", phoneNumber);
        } catch (error) {
            console.error("❌ Error sending SMS:", error);
        }
    }

    return null;
});



