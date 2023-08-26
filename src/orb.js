const container = document.getElementById("wrap");
for (let i = 0; i < 300; i++) {
    console.log(i)
    const div = document.createElement("div");
    div.className = "c";
    container.appendChild(div);
}