// ─── Utilidades puras para el módulo de Inventario ───────────────────────────

/**
 * Formatea una fecha ISO a cadena local legible.
 * @param {string} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

/**
 * Calcula el estado de un producto según existencia y mínimo.
 * @param {number|string} existencia
 * @param {number|string} minimo
 * @returns {'Agotado'|'Mínimos'|'Normal'}
 */
export function computeEstado(existencia, minimo) {
  if (Number(existencia) <= 0) return 'Agotado'
  if (Number(existencia) <= Number(minimo)) return 'Mínimos'
  return 'Normal'
}

/**
 * Retorna la fecha/hora actual en formato ISO.
 * @returns {string}
 */
export function nowIso() {
  return new Date().toISOString()
}