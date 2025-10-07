import React, { useEffect, useState } from "react";

/**
 * Página "API" robusta con fallbacks y caché local.
 * Intenta en este orden:
 *  1) open.er-api.com (tiempo real, sin API key)
 *  2) frankfurter.app (tiempo real, sin API key)
 *  3) jsDelivr (fawazahmed0/currency-api) – JSON estático diario (sin API key)
 * Además:
 *  - Timeout por solicitud
 *  - Mensaje de error claro
 *  - Caché en localStorage (fxCache) por si todas fallan
 */

const CURRENCY_CARDS = [
  { code: "ARS", name: "Peso argentino", flag: "ar" },
  { code: "EUR", name: "Euro",            flag: "eu" },
];

function normalizeFromOpenERAPI(json) {
  if (json?.result !== "success") throw new Error(json?.["error-type"] || "API error");
  return {
    base: json.base_code,
    date: json.time_last_update_utc,
    rates: json.rates,
    provider: "open.er-api.com",
  };
}

function normalizeFromFrankfurter(json) {
  // Frankfurter responde: { amount, base, date, rates: { ARS, EUR } }
  if (!json || !json.base || !json.rates) throw new Error("API error (frankfurter)");
  return {
    base: json.base,
    date: json.date,
    rates: json.rates,
    provider: "api.frankfurter.app",
  };
}

function normalizeFromFawaz(json) {
  // Estructura: { date: "2025-10-07", usd: { ars: 1400.0, eur: 0.93, ... } }
  if (!json || !json.date || !json.usd) throw new Error("API error (cdn)");
  const rates = {};
  if (json.usd.ars) rates["ARS"] = json.usd.ars;
  if (json.usd.eur) rates["EUR"] = json.usd.eur;
  return {
    base: "USD",
    date: json.date,
    rates,
    provider: "jsDelivr (fawazahmed0/currency-api)",
  };
}

async function fetchWithTimeout(url, opts = {}, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal, headers: { ...(opts.headers || {}), "cache-control": "no-cache" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export default function Api() {
  const [data, setData] = useState(null);      // { base, date, rates, provider }
  const [status, setStatus] = useState("idle");// idle | loading | success | error | cached
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setStatus("loading");
      try {
        // 1) open.er-api.com
        try {
          const j1 = await fetchWithTimeout("https://open.er-api.com/v6/latest/USD");
          const d1 = normalizeFromOpenERAPI(j1);
          if (!mounted) return;
          setData(d1);
          setStatus("success");
          localStorage.setItem("fxCache", JSON.stringify({ ...d1, ts: Date.now() }));
          return;
        } catch {}

        // 2) frankfurter.app
        try {
          const j2 = await fetchWithTimeout("https://api.frankfurter.app/latest?from=USD&to=ARS,EUR");
          const d2 = normalizeFromFrankfurter(j2);
          if (!mounted) return;
          setData(d2);
          setStatus("success");
          localStorage.setItem("fxCache", JSON.stringify({ ...d2, ts: Date.now() }));
          return;
        } catch {}

        // 3) jsDelivr (fawazahmed0/currency-api)
        try {
          const j3 = await fetchWithTimeout("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json");
          const d3 = normalizeFromFawaz(j3);
          if (!mounted) return;
          setData(d3);
          setStatus("success");
          localStorage.setItem("fxCache", JSON.stringify({ ...d3, ts: Date.now() }));
          return;
        } catch {}

        // 4) Si todas fallan, intentamos leer caché
        const cached = localStorage.getItem("fxCache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!mounted) return;
          setData(parsed);
          setStatus("cached");
          setError("Mostrando valores en caché por error de red o CORS.");
          return;
        }

        // Sin datos
        throw new Error("No se pudo obtener datos de las fuentes.");
      } catch (e) {
        if (!mounted) return;
        setStatus("error");
        setError(e?.message || String(e));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="card">
      <h2 className="card-title">API – Cotizaciones (Base: USD)</h2>

      {status === "loading" && <p>Cargando cotizaciones...</p>}
      {status === "error" && (
        <div className="messages">
          <div className="msg-error">No se pudo obtener la información. {error}</div>
        </div>
      )}
      {status === "cached" && (
        <div className="messages">
          <div className="msg-warn">Sin conexión a las fuentes. Mostrando datos en caché local.</div>
        </div>
      )}

      {(status === "success" || status === "cached") && data && (
        <>
          <p className="subtitle" style={{ margin: "8px 0 18px" }}>
            Fecha de referencia: <strong>{data.date}</strong> • Base: <strong>{data.base}</strong> • Fuente: <strong>{data.provider}</strong>
          </p>

          <div className="grid">
            {CURRENCY_CARDS.map((c) => {
              const rate = data.rates?.[c.code];
              const inverse = rate ? 1 / rate : null;
              return (
                <div key={c.code} className="img-card">
                  <div className="img-wrap" style={{ background: "#0b1227" }}>
                    <img
                      src={`https://flagcdn.com/256x192/${c.flag}.png`}
                      alt={`Bandera ${c.name}`}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="img-meta">
                    <div className="meta-primary">
                      <span className="meta-name">{c.name}</span>
                      <span className="meta-secondary" style={{ marginLeft: 8 }}>({c.code})</span>
                    </div>
                    <div className="meta-secondary" style={{ marginTop: 8 }}>
                      <div>1 {data.base} = <strong>{rate?.toLocaleString("es-AR", { maximumFractionDigits: 4 })}</strong> {c.code}</div>
                      {inverse && (
                        <div>1 {c.code} = <strong>{inverse.toLocaleString("es-AR", { maximumFractionDigits: 6 })}</strong> {data.base}</div>
                      )}
                      <div>Actualizado (API): <strong>{data.date}</strong></div>
                      <div>Proveedor: {data.provider}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
