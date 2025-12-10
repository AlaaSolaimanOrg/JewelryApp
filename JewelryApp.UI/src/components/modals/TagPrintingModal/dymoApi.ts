/* ---------------------------------------------
   🔥 Minimal DYMO REST API Helper (No SDK Needed)
---------------------------------------------- */

export const DYMO = {
  async checkEnvironment() {
    try {
      const res = await fetch("https://127.0.0.1:41951/dcd/api/check-api-status");
      return { isFrameworkInstalled: res.ok, isBrowserSupported: true };
    } catch {
      return { isFrameworkInstalled: false, isBrowserSupported: true };
    }
  },

  async getPrinters() {
    try {
      const res = await fetch("https://127.0.0.1:41951/dcd/api/printers");
      const data = await res.json();
      return data.printers || [];
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
      }
    );

    return res.text();
  },

  async printMultipleCopies(printerName: string, labelXml: string, count: number) {
    for (let i = 0; i < count; i++) {
      await this.printLabel(printerName, labelXml);
      await new Promise((res) => setTimeout(res, 200)); // Prevent overload
    }
  },
};

/* ---------------------------------------------
   Label XML Updater — Replace fields dynamically
---------------------------------------------- */
export function updateLabelXml(xml: string, product: any) {
  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject1<\/Name>[\s\S]*?<Text>[\s\S]*?<\/Text>/,
    `<TextObject><Name>TextObject1</Name><Text>${product.karatType}k</Text></TextObject>`
  );

  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject12<\/Name>[\s\S]*?<Text>[\s\S]*?<\/Text>/,
    `<TextObject><Name>TextObject12</Name><Text>${product.weight} g</Text></TextObject>`
  );

  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject2<\/Name>[\s\S]*?<Text>[\s\S]*?<\/Text>/,
    `<TextObject><Name>TextObject2</Name><Text>${product.specification ?? ""}</Text></TextObject>`
  );

  xml = xml.replace(
    /<BarcodeObject>\s*<Name>BarcodeObject0<\/Name>[\s\S]*?<DataString>[\s\S]*?<\/DataString>/,
    `<BarcodeObject><Name>BarcodeObject0</Name><DataString>${product.sku}</DataString></BarcodeObject>`
  );

  return xml;
}
