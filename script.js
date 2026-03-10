document.addEventListener("DOMContentLoaded", () => {
    const commandInput = document.getElementById("command-input");
    const output = document.getElementById("output");
    const projectsLink = document.getElementById("projects-link");
    const shelf = document.querySelector(".shelf");
    const cartSlot = document.querySelector(".cart-slot");
    const cartridges = document.querySelectorAll(".cartridge");
    const crt = document.querySelector(".crt");

    let isAnimating = false;

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

    // Generic click handler for all cartridges
    cartridges.forEach((cartridge) => {
        cartridge.addEventListener("click", () => {
            if (isAnimating) return;
            const name = cartridge.dataset.name;
            const url = cartridge.dataset.url;
            flyCartridgeToSlot(cartridge, name, url);
        });

        cartridge.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (isAnimating) return;
                const name = cartridge.dataset.name;
                const url = cartridge.dataset.url;
                flyCartridgeToSlot(cartridge, name, url);
            }
        });
    });

    function handleCommand(command) {
        switch (command) {
            case "PROJECTS":
                appendOutput("Loading cartridges...");
                shelf.classList.add("active");
                break;

            default:
                appendOutput(`Unknown command: ${command}`);
        }
        scrollToBottom();
    }

    function appendOutput(message) {
        output.innerHTML += `<p>${message}</p>`;
    }

    function scrollToBottom() {
        const terminal = document.querySelector(".terminal");
        terminal.scrollTop = terminal.scrollHeight;
    }

    function flyCartridgeToSlot(cartridge, name, url) {
        isAnimating = true;

        // Dim other cartridges
        cartridges.forEach((c) => {
            if (c !== cartridge) c.classList.add("dimmed");
        });

        const cartBody = cartridge.querySelector(".cart-body");
        const cartRect = cartBody.getBoundingClientRect();
        const opening = document.querySelector(".cart-slot-opening");
        const openRect = opening.getBoundingClientRect();

        // Clone the cart-body for flying
        const clone = cartBody.cloneNode(true);
        clone.classList.add("cart-flying");
        clone.style.width = cartRect.width + "px";
        clone.style.height = cartRect.height + "px";
        clone.style.left = cartRect.left + "px";
        clone.style.top = cartRect.top + "px";
        document.body.appendChild(clone);

        // Hide original
        cartridge.style.visibility = "hidden";

        // Scale cartridge to match slot opening width
        const scale = openRect.width / cartRect.width;
        const scaledH = cartRect.height * scale;

        // Horizontal: center on the slot opening
        const dx = (openRect.left + openRect.width / 2) - (cartRect.left + cartRect.width / 2);

        // Hover position: bottom of scaled cartridge at slot top
        // Visual bottom = cartRect.top + cartRect.height/2 + dy + scaledH/2
        // Set that equal to openRect.top
        const hoverDy = openRect.top - cartRect.top - cartRect.height / 2 - scaledH / 2;

        // Insert position: push down so only grip (~18%) visible above slot
        // Visual top = cartRect.top + cartRect.height/2 + dy - scaledH/2
        // Set that equal to openRect.top - scaledH * 0.18
        const insertDy = openRect.top - scaledH * 0.18 - cartRect.top - cartRect.height / 2 + scaledH / 2;

        // Arc peak
        const arcDy = Math.min(hoverDy, 0) - 100;

        // Phase 1: Fly to slot
        const fly = clone.animate([
            { transform: "translate(0, 0) scale(1) rotate(0deg)", offset: 0 },
            { transform: "translate(0, -30px) scale(1.05) rotate(-3deg)", offset: 0.15 },
            { transform: `translate(${dx * 0.5}px, ${arcDy}px) scale(${scale * 1.15}) rotate(2deg)`, offset: 0.45 },
            { transform: `translate(${dx}px, ${hoverDy}px) scale(${scale}) rotate(0deg)`, offset: 1 }
        ], {
            duration: 800,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        });

        setTimeout(() => {
            cartSlot.classList.add("receiving");
        }, 500);

        fly.onfinish = () => {
            // Drop clone behind the chin so the body doesn't paint
            // in front of the beige surface as it slides into the slot.
            clone.style.zIndex = "19";
            const chin = document.querySelector(".monitor-chin");
            chin.style.position = "relative";
            chin.style.zIndex = "20";

            // Phase 2: Slide into slot with clip.
            // Don't commitStyles/cancel fly — its fill:forwards is overridden
            // by phase 2's "replace" composite, keeping transforms in component
            // form (no matrix decomposition = no sub-pixel jump).
            const insert = clone.animate([
                {
                    transform: `translate(${dx}px, ${hoverDy}px) scale(${scale})`,
                    clipPath: "inset(0 0 0% 0)",
                    offset: 0
                },
                {
                    transform: `translate(${dx}px, ${insertDy}px) scale(${scale})`,
                    clipPath: "inset(0 0 82% 0)",
                    offset: 1
                }
            ], {
                duration: 350,
                easing: "cubic-bezier(0.4, 0, 1, 1)",
                fill: "forwards"
            });

            insert.onfinish = () => {
                // Remove chin stacking context so the grip is visible
                // above the chin surface in the final resting state.
                chin.style.position = "";
                chin.style.zIndex = "";
                startBootSequence(name, url);
            };
        };
    }


    function startBootSequence(name, url) {
        // CRT flicker
        crt.classList.add("flickering");
        setTimeout(() => {
            crt.classList.remove("flickering");
        }, 500);

        // Terminal messages
        setTimeout(() => {
            appendOutput("CARTRIDGE DETECTED");
            scrollToBottom();
        }, 300);

        setTimeout(() => {
            appendOutput(`LOADING ${name.toUpperCase()}...`);

            // Progress bar
            const bar = document.createElement("div");
            bar.className = "boot-progress-bar";
            const fill = document.createElement("div");
            fill.className = "boot-progress-fill";
            bar.appendChild(fill);
            output.appendChild(bar);
            scrollToBottom();

            // Trigger fill animation on next frame
            requestAnimationFrame(() => {
                fill.style.width = "100%";
            });
        }, 600);

        // Redirect after boot completes
        setTimeout(() => {
            window.location.href = url;
        }, 2200);
    }
});
