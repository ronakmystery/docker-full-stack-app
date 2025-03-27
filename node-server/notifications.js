const express = require("express");
const webPush = require("web-push");
const globalState = require("./data")


const router = express.Router();

// keys for webpush 
const publicVapidKey = "BHMoOD-_Jr8g-p0-BYTAF1W2lO96LQNpsYnfapLGg3f13QLmvx-Q9jAF-_Vy2SU73GZVr1OgP14ODbeuigltCGE";
const privateVapidKey = "mmrqXoxDsNi-YsqhlFH4vRvS5_4ZEX-Qe_V9pHSgXvk";

webPush.setVapidDetails("mailto:your-email@example.com", publicVapidKey, privateVapidKey);


// Subscribe endpoint
router.post("/subscribe", (req, res) => {
    const data = req.body;
    let subscription = data.subscription
    globalState.subscriptions.set(data.user.email, subscription);
    //save subs when node restart

    console.log(globalState.subscriptions)

    res.status(201).json({ message: "Subscribed successfully!" });
});


async function sendPushNotification(data) {
    // console.log(data)
    const payload = JSON.stringify({
        title: data.user.username,
        body: data.message,
    });

    for (const [email, sub] of globalState.subscriptions) {
        const isConnected = globalState.connectedUsers.has(email);
        if (isConnected && email!=data.user.email) {
            try {
                await webPush.sendNotification(sub, payload);
            } catch (err) {
                console.log(err)
            }
        }
    }


}

router.post("/send-notification", async (req, res) => {
    try {
        await sendPushNotification(req.body);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Failed to send push:', err);
        res.status(500).json({ error: 'Failed to send push notification' });
    }
});



// let n=0;
// setInterval(async () => {
//     console.log("Auto-triggering push notifications...");
//     n++
//     await sendPushNotification({ "message": n });
// }, 1000);

module.exports = router;  // Correctly exporting the Express router
