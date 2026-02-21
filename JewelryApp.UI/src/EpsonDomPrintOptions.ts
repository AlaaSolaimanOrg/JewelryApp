import html2canvas from "html2canvas";

export type EpsonDomPrintOptions = {
  ip: string;
  port?: number;          // default 8008
  crypto?: boolean;       // default false
  buffer?: boolean;       // default false
  paperWidthPx?: number;  // 80mm ~ 576px, 58mm ~ 384px (at 203dpi)
  scale?: number;         // canvas scale factor (2 is usually fine)
};

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Print the DOM element exactly as rendered (like react-to-print),
 * by rasterizing it to a canvas and using Epson addImage().
 */
export async function printDomToEpson(
  element: HTMLElement,
  opts: EpsonDomPrintOptions
) {
  const ip = opts.ip;
  const port = opts.port ?? 8008;
  const crypto = opts.crypto ?? false;
  const buffer = opts.buffer ?? false;

  if (!window.epson?.ePOSDevice) {
    throw new Error("Epson SDK not loaded (window.epson.ePOSDevice missing).");
  }

  // 1) Render DOM -> canvas
  // Important for images: your images must be served with CORS headers or same-origin.
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: opts.scale ?? 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
  });

  // 2) Optionally resize to paper width (recommended)
  const targetWidth = opts.paperWidthPx ?? 576; // good default for 80mm @203dpi
  let finalCanvas = canvas;

  if (canvas.width !== targetWidth) {
    const ratio = targetWidth / canvas.width;
    const scaled = document.createElement("canvas");
    scaled.width = targetWidth;
    scaled.height = Math.max(1, Math.round(canvas.height * ratio));
    const ctx = scaled.getContext("2d");
    if (!ctx) throw new Error("Failed to create canvas context for scaling.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, scaled.width, scaled.height);
    ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
    finalCanvas = scaled;
  }

  // 3) Connect to Epson (DeviceIF 8008)
  const dev = new window.epson.ePOSDevice();

  const connectResult: string = await new Promise((resolve) => {
    dev.connect(ip, port, (res: string) => resolve(res), {
      crypto,
      buffer,
      eposprint: false,
    });
  });

  if (connectResult !== "OK" && connectResult !== "SSL_CONNECT_OK") {
    throw new Error(`Connect failed: ${connectResult} (ip=${ip} port=${port})`);
  }

  // 4) Create printer
  const printer = await new Promise<any>((resolve, reject) => {
    dev.createDevice(
      "local_printer",
      dev.DEVICE_TYPE_PRINTER,
      { crypto, buffer },
      (p: any, code: string) => {
        if (code !== "OK") reject(new Error(`createDevice failed: ${code}`));
        else resolve(p);
      }
    );
  });

  printer.timeout = 60000;

  // 5) Print image
  const ctx2d = finalCanvas.getContext("2d");
  if (!ctx2d) throw new Error("Canvas 2D context missing.");

  // Epson addImage(context, x, y, width, height, color, mode)
  // Using mono is typical for thermal printers.
  printer.addImage(
    ctx2d,
    0,
    0,
    finalCanvas.width,
    finalCanvas.height,
    printer.COLOR_1,
    printer.MODE_GRAY16
  );

  printer.addFeedLine(2);
  printer.addCut(printer.CUT_FEED);

  printer.send();

  // Give it a moment to transmit before disconnect
  await wait(800);
  dev.disconnect();
}