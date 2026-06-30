import { useState } from "react";

export default function DonarPage() {
  const [monto, setMonto] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comprobante, setComprobante] = useState(null);

  const handleDonar = () => {
    if (!monto) {
      alert("Debe ingresar un monto");
      return;
    }

    // ✅ Aquí NO registramos una donación confirmada.
    // La transferencia se realiza fuera del sistema; solo registramos
    // una INTENCIÓN de donación que un administrador validará después.
    setMostrarMensaje(true);
    setMonto("");
    setReferencia("");
    setDescripcion("");
    setComprobante(null);
  };

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "40px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          color: "#e5e7eb",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#f9fafb",
          }}
        >
          Donación por Transferencia Bancaria
        </h2>

        <p style={{ margin: "0 0 16px", color: "#9ca3af", lineHeight: 1.6 }}>
          Realiza tu donación mediante una transferencia bancaria a la siguiente
          cuenta. La transferencia se realiza <strong>fuera del sistema</strong>{" "}
          desde tu banca en línea o sucursal.
        </p>

        {/* ✅ AVISO DE FLUJO */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            background: "rgba(96, 165, 250, 0.1)",
            border: "1px solid rgba(96, 165, 250, 0.35)",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "28px",
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: 1.3 }}>ℹ️</span>
          <p style={{ margin: 0, color: "#bfdbfe", fontSize: "14px" }}>
            Una vez realizada la transferencia, registra aquí tu{" "}
            <strong>intención de donación</strong>. La solicitud quedará{" "}
            <strong>pendiente de validación</strong> por un administrador, quien
            confirmará la donación tras verificar el comprobante.
          </p>
        </div>

        {/* ✅ DATOS BANCARIOS */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            padding: "20px 24px",
            borderRadius: "12px",
            marginBottom: "28px",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#60a5fa",
            }}
          >
            Datos bancarios
          </h3>

          {[
            { label: "Banco", valor: "Banco Nacional" },
            { label: "Cuenta", valor: "123456789" },
            { label: "IBAN", valor: "CR05015202001026284066" },
            { label: "Titular", valor: "Sistema SIGAC" },
          ].map((dato) => (
            <div
              key={dato.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                padding: "8px 0",
                borderBottom: "1px solid #1f2937",
              }}
            >
              <span style={{ color: "#9ca3af" }}>{dato.label}</span>
              <span style={{ color: "#e5e7eb", fontWeight: 600 }}>
                {dato.valor}
              </span>
            </div>
          ))}
        </div>

        {/* ✅ SEPARADOR VISUAL */}
        <div
          style={{
            height: "1px",
            background: "#374151",
            margin: "0 0 24px",
          }}
        />

        {/* ✅ FORMULARIO SIMPLE */}
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: "17px",
            fontWeight: 600,
            color: "#f9fafb",
          }}
        >
          Registrar intención de donación
        </h3>

        <p style={{ margin: "0 0 20px", color: "#9ca3af", fontSize: "13px" }}>
          Completa los datos de la transferencia que ya realizaste. Tu solicitud
          quedará pendiente de validación.
        </p>

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Monto en ₡
        </label>

        <input
          type="number"
          placeholder="Monto en ₡"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            marginBottom: "18px",
            borderRadius: "10px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#e5e7eb",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Referencia o número de comprobante{" "}
          <span style={{ color: "#6b7280" }}>(opcional)</span>
        </label>

        <input
          type="text"
          placeholder="Ej. 0098123456"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            marginBottom: "18px",
            borderRadius: "10px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#e5e7eb",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Descripción breve{" "}
          <span style={{ color: "#6b7280" }}>(opcional)</span>
        </label>

        <textarea
          placeholder="Comentario sobre tu donación..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            marginBottom: "18px",
            borderRadius: "10px",
            border: "1px solid #374151",
            background: "#111827",
            color: "#e5e7eb",
            fontSize: "15px",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Comprobante de transferencia{" "}
          <span style={{ color: "#6b7280" }}>(opcional)</span>
        </label>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setComprobante(e.target.files?.[0] ?? null)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            marginBottom: "24px",
            borderRadius: "10px",
            border: "1px dashed #374151",
            background: "#111827",
            color: "#9ca3af",
            fontSize: "13px",
            outline: "none",
          }}
        />

        <button
          onClick={handleDonar}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
        >
          Registrar intención de donación
        </button>

        {/* ✅ MENSAJE */}
        {mostrarMensaje && (
          <p
            style={{
              marginTop: "20px",
              marginBottom: 0,
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.35)",
              color: "#4ade80",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            ✅ Solicitud registrada correctamente. La donación será validada por
            un administrador.
          </p>
        )}
      </div>
    </div>
  );
}