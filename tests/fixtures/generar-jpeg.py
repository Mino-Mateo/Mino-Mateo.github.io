# Genera las fotos sintéticas con EXIF de la demo y de los tests (Pillow 10 no escribe sub-IFD).
# Uso: python3 tests/fixtures/generar-jpeg.py  (desde la raíz del repo)
import io
import struct
from PIL import Image


def tiff(e, ifd0_ascii, exif_ascii, gps):
    """TIFF con IFD0 (ASCII + punteros Exif y GPS), Exif IFD y GPS IFD. e: '<' o '>'."""
    P = lambda f, *a: struct.pack(e + f, *a)
    data = bytearray()
    n0, ne, ng = len(ifd0_ascii) + 2, len(exif_ascii), 4
    o0 = 8
    oe = o0 + 2 + n0 * 12 + 4
    og = oe + 2 + ne * 12 + 4
    od = og + 2 + ng * 12 + 4

    def ascii_entries(items):
        b = bytearray()
        for tag, txt in items:
            v = txt.encode() + b"\0"
            if len(v) <= 4:
                b += P("HHI", tag, 2, len(v)) + v.ljust(4, b"\0")
            else:
                b += P("HHI", tag, 2, len(v)) + P("I", od + len(data))
                data.extend(v)
        return b

    rats = lambda vals: b"".join(P("II", int(round(v * 100)), 100) for v in vals)
    out = bytearray((b"II" if e == "<" else b"MM") + P("HI", 42, o0))
    out += P("H", n0) + ascii_entries(ifd0_ascii) + P("HHII", 0x8769, 4, 1, oe) + P("HHII", 0x8825, 4, 1, og) + P("I", 0)
    out += P("H", ne) + ascii_entries(exif_ascii) + P("I", 0)
    (latref, lat), (lonref, lon) = gps
    lat_off = od + len(data); data.extend(rats(lat))
    lon_off = od + len(data); data.extend(rats(lon))
    out += P("H", ng) + P("HHI", 1, 2, 2) + latref.encode().ljust(4, b"\0") + P("HHII", 2, 5, 3, lat_off)
    out += P("HHI", 3, 2, 2) + lonref.encode().ljust(4, b"\0") + P("HHII", 4, 5, 3, lon_off) + P("I", 0)
    assert len(out) == od
    return bytes(out + data)


def jpeg_con_exif(img, t):
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=70)
    base = buf.getvalue()
    app1 = b"Exif\0\0" + t
    return base[:2] + b"\xff\xe1" + struct.pack(">H", len(app1) + 2) + app1 + base[2:]


# Demo: degradado sin personas; GPS en la Torre Eiffel (lugar público, sin relación con el autor)
im = Image.new("RGB", (480, 320))
px = im.load()
for x in range(480):
    for y in range(320):
        px[x, y] = (30 + x // 4, 10 + y // 6, 60 + (x + y) // 8)
t = tiff("<", [(0x010F, "Demo"), (0x0110, "Camara de ejemplo"), (0x0131, "Demo EXIF")],
         [(0x9003, "2026:09:29 10:15:00")], (("N", (48, 51, 30.24)), ("E", (2, 17, 40.2))))
open("public/demo/foto-ejemplo.jpg", "wb").write(jpeg_con_exif(im, t))

# Test big endian (formato de iPhone), coordenadas ficticias
t2 = tiff(">", [(0x010F, "Apple")], [], (("N", (40, 26, 46.3)), ("E", (3, 42, 12.5))))
open("tests/fixtures/big-endian.jpg", "wb").write(jpeg_con_exif(Image.new("RGB", (8, 8), (200, 50, 50)), t2))
