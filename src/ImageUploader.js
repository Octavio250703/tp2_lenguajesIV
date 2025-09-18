import React, { useCallback, useMemo, useRef, useState } from "react";

function bytesToSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImageUploader({ multiple = false, maxMB = 10 }) {
  const [items, setItems] = useState([]); // { id, src, name, size, width, height, file }
  const [messages, setMessages] = useState([]);
  const dzRef = useRef(null);
  const maxBytes = maxMB * 1024 * 1024;

  const addFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    const errors = [];

    for (const file of files) {
      if (!file.type?.startsWith("image/")) {
        errors.push(`❌ ${file.name}: formato no soportado (solo imágenes).`);
        continue;
      }
      if (file.size > maxBytes) {
        errors.push(`❌ ${file.name}: supera ${maxMB}MB (${bytesToSize(file.size)}).`);
        continue;
      }

      const dataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { width, height } = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = dataURL;
      });

      accepted.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        src: dataURL,
        name: file.name,
        size: file.size,
        width,
        height,
        file,
      });
    }

    setItems((prev) => (multiple ? [...prev, ...accepted] : accepted.slice(0, 1)));
    if (errors.length) setMessages((prev) => [...prev, ...errors]);
  }, [maxBytes, maxMB, multiple]);

  const onInputChange = (e) => addFiles(e.target.files);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dzRef.current?.classList.remove("over");
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    dzRef.current?.classList.add("over");
  };
  const onDragLeave = () => dzRef.current?.classList.remove("over");

  const hasImages = items.length > 0;

  const handleRemove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clearAll = () => setItems([]);

  const handleDownload = (item) => {
    const a = document.createElement("a");
    a.href = item.src;
    a.download = item.name || "imagen";
    a.click();
  };

  const helperText = useMemo(
    () => (
      <ul className="helper-list" role="list">
        <li>Formatos admitidos: JPG, PNG, GIF.</li>
        <li>Límite: {maxMB}MB por archivo.</li>
        <li>Arrastrá y soltá o hacé clic para seleccionar.</li>
        {!multiple && <li>Modo de una sola imagen (podés habilitar múltiples).</li>}
      </ul>
    ),
    [maxMB, multiple]
  );

  return (
    <div className="uploader">
      <div
        ref={dzRef}
        className="dropzone"
        role="button"
        aria-label="Zona para soltar o seleccionar imágenes"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="dz-icon" aria-hidden>⬆️</div>
        <p className="dz-title">Arrastrá tus imágenes aquí</p>
        <p className="dz-subtitle">o hacé clic para seleccionarlas</p>
        <input
          id="file-input"
          className="visually-hidden"
          type="file"
          accept="image/*"
          onChange={onInputChange}
          multiple={multiple}
        />
      </div>

      <div className="helper-card">
        <h3>Consejos</h3>
        {helperText}
      </div>

      {messages.length > 0 && (
        <div className="messages" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className="msg-error">{m}</div>
          ))}
        </div>
      )}

      {hasImages && (
        <div className="toolbar">
          <h3 className="toolbar-title">Vista previa ({items.length})</h3>
          <button className="btn" onClick={clearAll}>Limpiar todo</button>
        </div>
      )}

      {hasImages && (
        <div className={multiple ? "grid" : "single"}>
          {items.map((item) => (
            <div key={item.id} className="img-card">
              <div className="img-wrap">
                <img src={item.src} alt={item.name} />
              </div>
              <div className="img-meta">
                <div className="meta-primary" title={item.name}>
                  <span className="meta-name">{item.name}</span>
                </div>
                <div className="meta-secondary">
                  {bytesToSize(item.size)} • {item.width}×{item.height}px
                </div>
                <div className="actions">
                  <button className="btn ghost" onClick={() => handleDownload(item)}>Descargar</button>
                  <button className="btn danger" onClick={() => handleRemove(item.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
