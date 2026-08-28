export const SHARE_IMAGE_MIME = "image/jpeg";
export const SHARE_IMAGE_QUALITY = 0.92;
export const SHARE_IMAGE_EXT = "jpg";

export type ShareImageAction = "copy" | "download";
export type ShareImageActionResult =
  | "clipboard"
  | "share"
  | "download"
  | "tab"
  | "preview"
  | "cancelled";

function getIOSVersion(): number | null {
  if (typeof navigator === "undefined") return null;
  const match = navigator.userAgent.match(/OS (\d+)[_\d]*.*like Mac OS X/);
  return match ? parseInt(match[1], 10) : null;
}

export function isIOS() {
  return getIOSVersion() !== null;
}

export function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileSharePlatform() {
  return isIOS() || isAndroid();
}

function encodeBlobAsPng(blob: Blob) {
  return (async () => {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not encode the image.");
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("Could not encode the image."))),
        "image/png",
      );
    });
  })();
}

function toShareImageFile(blob: Blob, fileName: string) {
  const imageBlob = blob.type === SHARE_IMAGE_MIME ? blob : new Blob([blob], { type: SHARE_IMAGE_MIME });
  return new File([imageBlob], `${fileName}.${SHARE_IMAGE_EXT}`, { type: SHARE_IMAGE_MIME });
}

export async function shareImageFile(blob: Blob, fileName: string) {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return "unsupported" as const;
  }

  const file = toShareImageFile(blob, fileName);
  try {
    await navigator.share({ files: [file] });
    return "shared" as const;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return "cancelled" as const;
    return "unsupported" as const;
  }
}

async function runNativeShareAction(blob: Blob, fileName: string) {
  const shareResult = await shareImageFile(blob, fileName);
  if (shareResult === "shared") return "share" as const;
  if (shareResult === "cancelled") return "cancelled" as const;
  return "unsupported" as const;
}

function isSafariDesktop() {
  if (typeof navigator === "undefined" || isMobileSharePlatform()) return false;
  return /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(navigator.userAgent);
}

export function copyImageBlob(blob: Blob) {
  if (isMobileSharePlatform()) return Promise.resolve(false);
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    return Promise.resolve(false);
  }

  try {
    const png = blob.type === "image/png" ? blob : encodeBlobAsPng(blob);
    const item = isSafariDesktop()
      ? new ClipboardItem({ "image/png": png })
      : new ClipboardItem({ [blob.type || SHARE_IMAGE_MIME]: blob });
    return navigator.clipboard
      .write([item])
      .then(() => true)
      .catch(() => navigator.clipboard
        .write([new ClipboardItem({ "image/png": png })])
        .then(() => true)
        .catch(() => false));
  } catch {
    return Promise.resolve(false);
  }
}

export function copyShareImage(blob: Blob, fileName: string): Promise<ShareImageActionResult> {
  if (isMobileSharePlatform()) {
    return runNativeShareAction(blob, fileName).then((shareAction) => {
      if (shareAction === "share") return "share";
      if (shareAction === "cancelled") return "cancelled";
      return "preview";
    });
  }

  return copyImageBlob(blob).then((copied) => {
    if (copied) return "clipboard";
    return runNativeShareAction(blob, fileName).then((shareAction) => {
      if (shareAction === "share") return "share";
      if (shareAction === "cancelled") return "cancelled";
      return "preview";
    });
  });
}

export function downloadImageBlob(blob: Blob, fileName: string, href?: string) {
  try {
    const url = href ?? URL.createObjectURL(blob);
    const revoke = !href;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.${SHARE_IMAGE_EXT}`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (revoke) window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

export function openImageInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    URL.revokeObjectURL(url);
    return false;
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

export function downloadShareImage(blob: Blob, fileName: string, href?: string): Promise<ShareImageActionResult> {
  if (isMobileSharePlatform()) {
    return runNativeShareAction(blob, fileName).then((shareAction) => {
      if (shareAction === "share") return "share";
      if (shareAction === "cancelled") return "cancelled";
      if (isAndroid() && openImageInNewTab(blob)) return "tab";
      return "preview";
    });
  }

  if (downloadImageBlob(blob, fileName, href)) return Promise.resolve("download");

  return runNativeShareAction(blob, fileName).then((shareAction) => {
    if (shareAction === "share") return "share";
    if (shareAction === "cancelled") return "cancelled";
    return "preview";
  });
}

export function createImagePreviewUrl(blob: Blob) {
  return URL.createObjectURL(blob);
}

export function shareFileName(value: string) {
  return value.replace(/\.(png|jpe?g|webp)$/i, "").replace(/^-+|-+$/g, "");
}
