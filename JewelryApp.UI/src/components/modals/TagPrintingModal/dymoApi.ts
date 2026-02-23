/* ---------------------------------------------
   🔥 Minimal DYMO REST API Helper (No SDK Needed)
---------------------------------------------- */

export const DYMO = {
  async checkEnvironment() {
    try {
      const res = await fetch(
        "https://127.0.0.1:41951/dcd/api/check-api-status",
      );
      return { isFrameworkInstalled: res.ok, isBrowserSupported: true };
    } catch {
      return { isFrameworkInstalled: false, isBrowserSupported: true };
    }
  },

  async getPrinters() {
    try {
      const res = await fetch("https://127.0.0.1:41951/dcd/api/get-printers");
      const data = await res.json();

      if (!data?.status || !Array.isArray(data?.responseValue)) {
        return [];
      }

      // Extract printerResponse from new API format
      const printers = data.responseValue
        .map((item: any) => item.printerResponse)
        .filter((p: any) => p?.isConnected); // optional: only connected printers

      return printers || [];
    } catch (error) {
      console.error("Error fetching printers", error);
      return [];
    }
  },

  async printLabel(printerName: string, labelXml: string) {
    const body = new URLSearchParams();
    body.append("printerName", printerName);
    body.append("labelXml", labelXml);
    body.append("printParamsXml", "");
    body.append("labelSetXml", "");

    const res = await fetch(
      "https://127.0.0.1:41951/DYMO/DLS/Printing/PrintLabel",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );

    return res.text();
  },

  async printMultipleCopies(
    printerName: string,
    labelXml: string,
    count: number,
  ) {
    for (let i = 0; i < count; i++) {
      await this.printLabel(printerName, labelXml);
      await new Promise((res) => setTimeout(res, 200)); // Prevent overload
    }
  },
};

/* ---------------------------------------------
   Label XML Updater — Replace fields dynamically
---------------------------------------------- */
export function updateLabelXml(xml: string, product: Product) {
  let updated = xml;

  // --- SKU ---
  updated = updated.replace(
    /<DataString>.*?<\/DataString>/g,
    `<DataString>${product.sku}</DataString>`,
  );

  // --- Price ---
  updated = updated.replace(
    /<Price>.*?<\/Price>/g,
    `<Price>${product.price.toFixed(2)}</Price>`,
  );

  // --- Weight ---
  updated = updated.replace(
    /<Weight>.*?<\/Weight>/g,
    `<Weight>${product.weight}</Weight>`,
  );

  // --- Karat ---
  updated = updated.replace(
    /<Karat>.*?<\/Karat>/g,
    `<Karat>${product.karatType}</Karat>`,
  );

  // --- Optional: validate XML before returning ---
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(updated, "application/xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
      console.warn("Malformed XML after update!");
    }
  } catch (err) {
    console.error("Error parsing XML after update:", err);
  }

  return updated;
}
