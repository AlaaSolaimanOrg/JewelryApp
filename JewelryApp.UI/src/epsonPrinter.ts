export type EpsonPrintOptions = {
  ip: string;
  port?: number; // default 8008
  crypto?: boolean; // default false
  buffer?: boolean; // default false
};

function money(n: any) {
  return Number(n ?? 0).toFixed(2);
}

function line(char = "-", width = 32) {
  return char.repeat(width) + "\n";
}

function trunc(s: any, max: number) {
  const str = String(s ?? "");
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

/**
 * Prints a sale receipt as TEXT using Epson DeviceIF (port 8008).
 * Requires: <script src="/epos-2.27.0.js"></script> in public/index.html
 */
export async function printSaleReceiptEpson(
  sale: any,
  opts: EpsonPrintOptions,
) {
  const ip = opts.ip;
  const port = opts.port ?? 8008;
  const crypto = opts.crypto ?? false;
  const buffer = opts.buffer ?? false;

  if (!window.epson?.ePOSDevice) {
    throw new Error(
      "Epson SDK not loaded. Add public/epos-2.27.0.js to index.html.",
    );
  }

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

  const printer = await new Promise<any>((resolve, reject) => {
    dev.createDevice(
      "local_printer",
      dev.DEVICE_TYPE_PRINTER,
      { crypto, buffer },
      (p: any, code: string) => {
        if (code !== "OK") reject(new Error(`createDevice failed: ${code}`));
        else resolve(p);
      },
    );
  });

  printer.timeout = 15000;

  // ---- Build receipt (adjust width if needed) ----
  const WIDTH = 42; // 42 chars fits many 80mm fonts; for 58mm try 32
  const created = sale?.createdDate ? new Date(sale.createdDate) : new Date();

  printer.addTextAlign(printer.ALIGN_CENTER);
  printer.addText("ADI Jewelry\n");
  printer.addText("6885 Ad Astra Blvd NW\n");
  printer.addText("Edmonton, Alberta\n");
  printer.addText("Phone: (780) 934-1455\n");
  printer.addText("\n");

  printer.addTextAlign(printer.ALIGN_LEFT);
  printer.addText(`Transaction: ${sale?.serialNumber || sale?.id || ""}\n`);
  printer.addText(`Date: ${created.toLocaleString()}\n`);
  printer.addText(`Staff: ${sale?.staffName || "N/A"}\n`);
  printer.addText(`Customer: ${sale?.customerName || "Walk-in"}\n`);

  const cash = Number(sale?.cashAmount || 0);
  const card = Number(sale?.cardAmount || 0);
  const payment =
    cash > 0 && card > 0
      ? "Cash & Card"
      : cash > 0
        ? "Cash"
        : card > 0
          ? "Card"
          : "N/A";
  printer.addText(`Payment: ${payment}\n`);

  printer.addText(line("-", WIDTH));

  const items: any[] = Array.isArray(sale?.saleItems) ? sale.saleItems : [];
  for (const it of items) {
    const name = trunc(it?.productName, WIDTH);
    const qty = Number(it?.quantity || 0);
    const sub = money(it?.subtotal);

    printer.addText(`${name}\n`);
    printer.addText(
      `  SKU:${trunc(it?.sku, 18)}  K:${String(it?.karat ?? "")}  Q:${qty}\n`,
    );
    printer.addText(
      `  W:${Number(it?.weight || 0)}g  $/g:${money(it?.pricePerGram)}  Sub:${sub}\n`,
    );

    const qtyRet = Number(it?.quantityReturned || 0);
    const amtRet = Number(it?.amountReturned || 0);
    if (qtyRet > 0 || amtRet > 0) {
      printer.addText(`  Returned: ${qtyRet}  -$${money(amtRet)}\n`);
    }

    printer.addText("\n");
  }

  printer.addText(line("-", WIDTH));

  if (Number(sale?.discount || 0) > 0)
    printer.addText(`Discount: $${money(sale.discount)}\n`);
  if (cash > 0) printer.addText(`Cash:     $${money(cash)}\n`);
  if (card > 0) printer.addText(`Card:     $${money(card)}\n`);

  const totalReturn = Number(sale?.totalReturnAmount || 0);
  if (totalReturn > 0) printer.addText(`Returned: -$${money(totalReturn)}\n`);

  printer.addText(`Tax:      $${money(sale?.tax)}\n`);
  printer.addText(`TOTAL:    $${money(sale?.total)}\n`);

  printer.addText("\n");
  printer.addTextAlign(printer.ALIGN_CENTER);
  printer.addText("Thank you!\n");
  printer.addText("\n");

  printer.addCut(printer.CUT_FEED);

  // Send + disconnect
  printer.send();
  await new Promise((r) => setTimeout(r, 400));
  dev.disconnect();
}
