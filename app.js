window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        window.location.href = `https://google.com/search?q=${document.getElementById("query").value}`
    }
})

var activeWidgets = []
if (!localStorage.getItem("widg")) {
    activeWidgets = [0, 1, 2]
} else {
    activeWidgets = localStorage.getItem("widg").split(",").map(x => parseInt(x))
}
if (activeWidgets.includes(0)) {
    document.getElementById("widgets").innerHTML += `<button class="widget" onclick="deleteWidget('dw')" id="dw">
        <span id="date"></span>
        <h2 id="day"></h2>
    </button>`
}
if (activeWidgets.includes(1)) {
    document.getElementById("widgets").innerHTML += `<button class="widget" onclick="deleteWidget('ww')" id="ww">
        <span id="loc">Getting</span>
        <h2 id="temp">weather info...</h2>
    </button>`
}
if (activeWidgets.includes(2)) {
    document.getElementById("widgets").innerHTML += `<button class="widget" onclick="deleteWidget('qw')" id="qw">
			<span id="quoteAuthor">--</span>
			<h2 id="quoteText">--</h2>
		</button>`
}

function initializeWidgets() {
    if (activeWidgets.includes(0)) {
        let date = new Date()
        document.getElementById("date").innerText = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
        document.getElementById("day").innerText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]
    }
    if (activeWidgets.includes(1)) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                lat = Math.round(lat*100)/100
                let long = position.coords.longitude;
                long = Math.round(long*100)/100
        
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code`).then(
                    x => x.text()
                ).then(
                    y => {
                        let celsius = JSON.parse(y).current.temperature_2m
                        let code = JSON.parse(y).current.weather_code
                        let emoji = ""
                        if (code == 0) {
                            emoji = "🔅"
                        } else if (code < 10) {
                            emoji = "⛅"
                        } else if (code < 50) {
                            emoji = "😶‍🌫️"
                        } else if (code < 70) {
                            emoji = "🌧️"
                        } else if (code < 80) {
                            emoji = "❄️"
                        } else if (code < 85) {
                            emoji = "🌧️"
                        } else if (code < 90) {
                            emoji = "❄️"
                        } else {
                            emoji = "🌩️"
                        }
        
                        document.getElementById("loc").innerText = `${lat}° ${long}°`
                        document.getElementById("temp").innerText = `${emoji} ${Math.round((celsius * 9/5 + 32)*10)/10}°F/${celsius}°`
                    }
                )
            });
        } else {
            alert("Please grant location access for weather.")
        }
    }
    if (activeWidgets.includes(2)) {
        fetch("https://gist.githubusercontent.com/robatron/a66acc0eed3835119817/raw/77493d3ddf69fbd9d69997e22e1a7c6c70c8bdf2/quotes.txt").then(
            x => x.text()
        ).then(
            y => {
                quote = y.split("\n")[Math.floor(Math.random()*y.split("\n").length)].split(" ~")
                document.getElementById("quoteText").innerText = quote[0]
                document.getElementById("quoteAuthor").innerText = quote[1]
            }
        )
    }
}
initializeWidgets()

function deleteWidget(type) {
    document.getElementById(type).remove()
    activeWidgets = activeWidgets.filter((x) => x != ({"dw":0, "ww":1, "qw":2}[type]))
    localStorage.setItem("widg", activeWidgets.join(","))
}
function restoreWidgets() {
    document.getElementById("widgets").innerHTML = `<button class="widget" onclick="deleteWidget('dw')" id="dw">
			<span id="date"></span>
			<h2 id="day"></h2>
		</button>
		<button class="widget" onclick="deleteWidget('ww')" id="ww">
			<span id="loc">Getting</span>
			<h2 id="temp">weather info...</h2>
		</button>
		<button class="widget" onclick="deleteWidget('qw')" id="qw">
			<span id="quoteAuthor">--</span>
			<h2 id="quoteText">--</h2>
		</button>`
    activeWidgets = [0, 1, 2]
    localStorage.setItem("widg", activeWidgets.join(","))
    initializeWidgets()
}

function upt() {
    let time = new Date()
    document.getElementById("time").innerText = `${time.getHours()}`.padStart(2, "0")+":"+`${time.getMinutes()}`.padStart(2, "0")
}
setInterval(() => {
    upt()
}, 1000)
upt()