import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import useAttachmentStore from "../../stores/useAttachmentStore";

export default function QRCodeView({ size = 256 }: { size?: number }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const { attachment } = useAttachmentStore();

  const qrText = `https://oleo-soft.com/index.html?id=${attachment.attachmentsId}&name=${attachment.name}&number=${attachment.number}`;

  const descargarQR = () => {
    if (!qrRef.current) return;

    // 1. Buscamos el SVG dentro del contenedor
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // 2. Serializamos el SVG a una cadena XML
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    // 3. Convertimos a una URL base64
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Fondo blanco (porque los SVG pueden ser transparentes y al descargar se verían negros)
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      // 4. Creamos un enlace temporal para la descarga
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${attachment.number}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="text-center">
      <div
        ref={qrRef}
        style={{
          padding: "20px",
          background: "white",
          display: "inline-block",
        }}
      >
        <QRCodeSVG value={qrText} size={size} level="H" />
      </div>
      <div className="mt-3">
        <button onClick={descargarQR} className="btn btn-success">
          Download QR (PNG)
        </button>
      </div>
    </div>
  );
}
