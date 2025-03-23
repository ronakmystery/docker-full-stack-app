const express = require("express");
const webPush = require("web-push");

const router = express.Router();

// keys for webpush
const publicVapidKey = "BHMoOD-_Jr8g-p0-BYTAF1W2lO96LQNpsYnfapLGg3f13QLmvx-Q9jAF-_Vy2SU73GZVr1OgP14ODbeuigltCGE";
const privateVapidKey = "mmrqXoxDsNi-YsqhlFH4vRvS5_4ZEX-Qe_V9pHSgXvk";

webPush.setVapidDetails("mailto:your-email@example.com", publicVapidKey, privateVapidKey);


const subscriptions = new Map()


router.get("/subscriptions", (req, res) => {
    res.json(subscriptions);
});


// Subscribe endpoint
router.post("/subscribe", (req, res) => {
    const data = req.body;
    let subscription=data.subscription
    subscriptions.set(data.user.email, subscription);


    console.log(subscriptions)

    res.status(201).json({ message: "Subscribed successfully!" });
});


async function sendPushNotification(data) {
    const payload = JSON.stringify({
        title: "New Task!",
        body: data.message,
    });

    const targets = [...subscriptions.entries()].filter(([email]) => email !== data.user.email);

    if (targets.length === 0) {
        console.log("No valid recipients (excluding sender).");
        return { error: "No other subscribers found." };
    }

    console.log("Sending notifications to", targets.length, "recipients...");

    try {
        await Promise.all(targets.map(async ([email, subscription], index) => {
            try {
                await webPush.sendNotification(subscription, payload);
                console.log(`Notification sent to ${email}`);
            } catch (err) {
                console.error(`Error sending to ${email}:`, err);

            }
        }));

        return { message: "Notifications sent successfully!" };

    } catch (error) {
        console.error("Unexpected error while sending notifications:", error);
        return { error: "Internal server error" };
    }
}


router.post("/send-notification", async (req, res) => {
    const result = await sendPushNotification(req.body);
    
    if (result.error) {
        return res.status(400).json(result);
    }
    
    res.json(result);
});


// setInterval(async () => {
//     console.log("Auto-triggering push notifications...");
//     await sendPushNotification();
// }, 5000);

module.exports = router;  // Correctly exporting the Express router
