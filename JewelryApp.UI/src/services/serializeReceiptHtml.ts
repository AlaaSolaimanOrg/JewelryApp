function applyComputedStyles(
  sourceElement: Element,
  targetElement: Element,
): void {
  const computedStyle = window.getComputedStyle(sourceElement);
  const targetHtmlElement = targetElement as HTMLElement;

  for (const propertyName of Array.from(computedStyle)) {
    targetHtmlElement.style.setProperty(
      propertyName,
      computedStyle.getPropertyValue(propertyName),
      computedStyle.getPropertyPriority(propertyName),
    );
  }

  const sourceChildren = Array.from(sourceElement.children);
  const targetChildren = Array.from(targetElement.children);

  for (let index = 0; index < sourceChildren.length; index += 1) {
    const sourceChild = sourceChildren[index];
    const targetChild = targetChildren[index];

    if (!sourceChild || !targetChild) {
      continue;
    }

    applyComputedStyles(sourceChild, targetChild);
  }
}

function getDataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function inlineImageSources(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      const src = image.getAttribute("src");

      if (!src || src.startsWith("data:")) {
        return;
      }

      try {
        const absoluteUrl = new URL(src, window.location.href).href;
        const response = await fetch(absoluteUrl);

        if (!response.ok) {
          return;
        }

        const dataUrl = await getDataUrlFromBlob(await response.blob());
        image.setAttribute("src", dataUrl);
      } catch {
        image.setAttribute("src", new URL(src, window.location.href).href);
      }
    }),
  );
}

export async function serializeReceiptHtml(
  element: HTMLElement,
): Promise<string> {
  const printWidth = Math.ceil(element.getBoundingClientRect().width);
  const clonedElement = element.cloneNode(true) as HTMLElement;
  applyComputedStyles(element, clonedElement);
  await inlineImageSources(clonedElement);

  clonedElement.style.margin = "0";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    @page { margin: 0; size: ${printWidth}px auto; }
    html, body {
      margin: 0;
      padding: 0;
      width: ${printWidth}px;
      max-width: ${printWidth}px;
      background: #fff;
      overflow: hidden;
    }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>${clonedElement.outerHTML}</body>
</html>`;
}