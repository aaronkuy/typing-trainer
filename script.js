document.addEventListener("DOMContentLoaded", () => {

    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);


    window.addEventListener("keydown", (event) => {

        const pressed = event.key.toLowerCase();


        
        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
        let keyEl = document.querySelector(selector);


        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }


        if (!keyEl) {

            return;
        }


        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });
});
