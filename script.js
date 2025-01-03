document.addEventListener("DOMContentLoaded", () => {
    const commandInput = document.getElementById("command-input");
    const output = document.getElementById("output");
    const cartridgeContainer = document.querySelector(".cartridge-container");
    const slot = document.querySelector(".slot");
    const dongle = document.querySelector(".dongle");
    const weatherml = document.getElementById("c1");
    const aphasia = document.getElementById("c2");
    const projectsLink = document.querySelector(".terminal p span");

    function revealBrushCircle() {
        const brushCircle = document.getElementById("brush-circle");
        brushCircle.classList.remove("hidden");
    }

    setTimeout(revealBrushCircle, 3000);

    commandInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const command = e.target.value.trim().toUpperCase();
            handleCommand(command);
            e.target.value = "";
        }
    });

    projectsLink.addEventListener("click", () => {
        handleCommand("PROJECTS");
    });

    weatherml.addEventListener("click", () => {
        weatherml.classList.add("active");
        cartridgeInserted("WeatherML");
        setTimeout(() => {
            window.location.href = "/weatherml/";
        }, 1500);
    });

    aphasia.addEventListener("click", () => {
        aphasia.classList.add("active");
        cartridgeInserted("Aphasia Prediction");
        setTimeout(() => {
            window.location.href = "/aphasiaprediction/";
        }, 1500);
    });

    function handleCommand(command) {
        switch (command) {
            case "PROJECTS":
                appendOutput("Loading cartridges...");
                cartridgeContainer.classList.add("active");
                dongle.classList.add("active");
                slot.classList.add("active");
                break;

            case "ML":
                appendOutput("Insert the cartridge for Machine Learning...");
                break;

            default:
                appendOutput(`Unknown command: ${command}`);
        }
        scrollToBottom();
    }

    function appendOutput(message) {
        output.innerHTML += `<p>${message}</p>`;
    }

    function cartridgeInserted(cartridge) {
        slot.classList.add("glow");
        document.querySelector(".slot-text").innerHTML = "Cartridge inserted!";
        appendOutput(`Cartridge inserted: ${cartridge}`);
        appendOutput(`Redirecting to ${cartridge} project...`);
    }

    function scrollToBottom() {
        const terminal = document.querySelector(".terminal");
        terminal.scrollTop = terminal.scrollHeight;
    }
});
