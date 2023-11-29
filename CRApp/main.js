
function loadAndDrawImages(logPath) {
    var height = 200;
    deltaxImage = 40;
    deltayImageAlly = 85;
    deltayImageEnemy = 205;
    var canvas = document.getElementById('CRAppCanvasTimeLine');
    var ctx = canvas.getContext('2d');

    fetch(logPath)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n');
        const teams = []
        const images = [];
        const frames = [];
        for (let i = 0; i < rows.length; i++) {
            const [team, frame, image] = rows[i].split(',');
            images.push(image);
            frames.push(Number(frame));
            teams.push(team);
        }

        for (let i = 0; i < images.length; i++) {
            var img = new Image();
            img.src = images[i];
            img.onload = (function(img) {
                return function() {
                    deltayImage = 0;
                    if (teams[i] == "ally")
                    {
                        deltayImage = deltayImageAlly;
                    }
                    else
                    {
                        deltayImage = deltayImageEnemy;
                    }

                    ctx.drawImage(img, frames[i], deltayImage);
                    ctx.beginPath();
                    ctx.arc(frames[i]+deltaxImage, height, 10, 0, 2 * Math.PI);
                    
                    //Blue for ally, red for enemy
                    if (teams[i] == "ally")
                    {
                        ctx.fillStyle = "blue";
                    }
                    else
                    {
                        ctx.fillStyle = "red";
                    }
                    ctx.fill();

                    //add text on mouse over the image with the name of the source file (only file name) and frame
                    ctx.font = "10px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText(images[i].split("/").pop() + " " + frames[i], frames[i], deltayImage);
                }
            })(img);
        }
    });

    // Draw the timeline
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(400, height);
    ctx.stroke();
}

function displayDialog(args) {
    // Your existing code here...
    alert(args)
    //logPath = args[1][0].cells[0].innerText;
    logPath = "https://raw.githubusercontent.com/alex-pelaez/PublicFolder/main/TimeLine.csv"
    // Call the new function
    loadAndDrawImages(logPath);
}

$(document).ready(function() {
    // Function to parse CSV data
    function parseCSV(csvData) {
        const rows = csvData.split('\n');
        const data = [];
        for (let i = 0; i < rows.length; i++) {
            const columns = rows[i].split(',');
            data.push(columns);
        }
        return data;
    }

    // Fetch and parse the CSV file
    fetch('https://raw.githubusercontent.com/alex-pelaez/PublicFolder/main/CRApp/results.csv')
        .then(response => response.text())
        .then(csvData => {
            const data = parseCSV(csvData);

            // Create the grid with the parsed CSV data
            const grid = new gridjs.Grid({
                columns: data[0], // Assuming the first row contains column names
                sort: true,
                search: true,
                data: data.slice(1) // Assuming the first row is the header row
            });

            // Call displayDialog function when click on a row
            grid.on('rowClick', (...args) => displayDialog('row: ' + JSON.stringify(args), args));

            // Render the grid to the #wrapper element
            grid.render(document.getElementById('wrapper'));
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV file:', error);
        });
});