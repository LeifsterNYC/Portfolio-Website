document.getElementById("command-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = e.target.value.trim().toUpperCase();
        handleCommand(command);
        e.target.value = "";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cartridges = document.querySelectorAll(".cartridge");
    const slot = document.querySelector(".slot");
    const slotText = document.querySelector(".slot-text");

    cartridges.forEach((cartridge) => {
        cartridge.addEventListener("click", () => {
            if (!cartridge.classList.contains("inserted")) {
                const rectCartridge = cartridge.getBoundingClientRect();
                const rectSlot = slot.getBoundingClientRect();

                const offsetX = rectSlot.left - rectCartridge.left;
                const offsetY = rectSlot.top - rectCartridge.top;

                cartridge.style.transition = "transform 0.5s ease";
                cartridge.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.8)`;

                setTimeout(() => {
                    cartridge.classList.add("inserted");
                    cartridge.style.zIndex = "1";
                    cartridge.style.pointerEvents = "none";
                    slotText.textContent = "Cartridge Inserted!";
                }, 500);
            }
        });
    });
});

function scrollToBottom() {
    const terminal = document.querySelector(".terminal");
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(command) {
    const output = document.getElementById("output");
    const cartridgeContainer = document.querySelector(".cartridge-container");
    const slot = document.querySelector(".slot");
    const dongle = document.querySelector(".dongle");

    switch (command) {
        case "PROJECTS":
            output.innerHTML += `<p>Loading cartridges...</p>`;
            cartridgeContainer.classList.add("active");
            slot.classList.add("active");
            dongle.classList.add("active");
            break;
        case "ML":
            output.innerHTML += `<p>Redirecting to ML project...</p>`;
            window.location.href = "/weatherml/";
            break;
        default:
            output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }
    scrollToBottom();
}
