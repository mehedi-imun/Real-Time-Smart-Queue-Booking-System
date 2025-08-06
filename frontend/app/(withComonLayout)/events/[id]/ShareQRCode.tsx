"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function ShareQRCode({ url }: { url: string }) {
  return (
    <div className="bg-white p-2 rounded">
      <QRCodeCanvas value={url} size={96} />
    </div>
  );
}
