document.getElementById("command-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = e.target.value.trim().toUpperCase();
        handleCommand(command);
        e.target.value = "";
    }
});

function scrollToBottom() {
    const terminal = document.querySelector(".terminal");
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(command) {
    switch (command) {
        case 'PROJECTS':
            document.getElementById("output").innerHTML += `Loading cartridges...</p>`;
            document.querySelector(".cartridge-container").classList.add('active');
            document.querySelector('.slot').classList.add('active');
            document.querySelector('.dongle').classList.add('active');
            break;
        default:
            document.getElementById("output").innerHTML += `<p>Unknown command: ${command}</p>`;
    }
    scrollToBottom();
}
