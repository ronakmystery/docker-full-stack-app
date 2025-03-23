console.log("register service worker")
self.addEventListener("push", (event) => {

    if (!event.data) {
        console.warn("Push event has no data.");
        return;
    }

    const data = event.data.json();

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/192.png",
            tag: data.tag || "update-notification",
            renotify: true
        })
    );
});
