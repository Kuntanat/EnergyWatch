"""Static server for the workspace that also saves POST bodies into tools/extract/ (used to pull page layouts out of the browser)."""
import functools, http.server, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT, OUT, PORT = os.path.dirname(HERE), os.path.join(HERE, "extract"), int(sys.argv[1] if len(sys.argv) > 1 else 8766)
os.makedirs(OUT, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        data = self.rfile.read(int(self.headers["Content-Length"]))
        with open(os.path.join(OUT, os.path.basename(self.path)), "wb") as f:
            f.write(data)
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"ok")

http.server.ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Handler, directory=ROOT)).serve_forever()
