import { getStockLabel, getStockStatus } from '../utils/inventory'

export function StockAlerts({ items }) {
  return (
    <div
      className="stock-alerts"
      role="alert"
      style={{ display: items.length === 0 ? 'none' : undefined }}
    >
      <h3>Alertas de stock ({items.length})</h3>
      <ul>
        {items.length === 0 ? null : items.map((item) => {
          const status = getStockStatus(item)
          return (
            <li key={item.id} className={`alert-item alert-${status}`}>
              <strong>{item.nombre}</strong> ({item.sku}) —{' '}
              {getStockLabel(status)}: {item.cantidad} / mín. {item.stockMinimo}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
