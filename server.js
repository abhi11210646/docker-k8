
const http = require('node:http');

const eventRoute = function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    // send 10 values to client [0-9]
    let count = 0;
    let intervalId = setInterval(() => {
        const message = `event: counter\ndata: ${count}\n\n`;
        res.write(message);
        if (++count == 10) {
            res.end();
            clearInterval(intervalId);
            return;
        }
    }, 1000);
}

const server = http.createServer((req, res) => {
    if (req.url === '/events') {
        eventRoute(req, res);
    } else {
        // Render HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>NodeJs SSE</title>
      </head>
      <body>
        <pre id="log"></pre>
        <span id="state"></span>
      </body>
      <script>
        const eventSource = new EventSource('/events');
        const state = document.getElementById('state');
        state.innerHTML = "Connecting...";
        eventSource.onopen = function(event) {
            state.innerHTML = "Connected";
        }
        // default message
        // eventSource.onmessage = function(event) {
        //   document.getElementById('log').innerHTML += event.data + '<br>';
        // };
        // Custom events
        eventSource.addEventListener("counter", (event) => {
            document.getElementById('log').innerHTML += event.data + '<br>';
        })
        eventSource.onerror = (e) => {
            if (e.eventPhase == EventSource.CLOSED) eventSource.close();
            if (e.target.readyState == EventSource.CLOSED) {
              state.innerHTML = "Disconnected";
            } else if (e.target.readyState == EventSource.CONNECTING) {
              state.innerHTML = "Connecting...";
            }
          };
      </script>
    </html>
  `);
    }
});

server.listen(process.env.PORT, () => console.log("Server is running..."))