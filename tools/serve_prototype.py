"""Serve the EnergyWatch prototype on localhost without browser caching, so edits show up on a normal reload.
Usage: python tools/serve_prototype.py [port]   (default 8780)"""
import functools, http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "prototype")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8780


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"EnergyWatch prototype: http://localhost:{PORT}")
        httpd.serve_forever()
