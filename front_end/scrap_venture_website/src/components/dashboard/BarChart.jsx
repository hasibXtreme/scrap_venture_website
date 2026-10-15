import { useState } from 'react';

/**
 * Modern Interactive Bar Chart for ScrapVenture Dashboards
 * Features:
 * - Gradient pillars with animated transitions
 * - Hover value tooltips
 * - Dynamic scaling to highest value
 * - Legend with color dots
 */
export default function BarChart({
  title,
  subtitle,
  data = [], // [{ label: 'Customers', value: 120, color: 'green' }]
  height = 200,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxValue = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">{title}</h3>
          {subtitle && <p className="chart-card__desc">{subtitle}</p>}
        </div>
      </div>

      <div className="bar-chart-container">
        <div className="bar-chart-bars" style={{ height: `${height}px` }}>
          {data.map((item, idx) => {
            const val = Number(item.value) || 0;
            const pct = Math.max(Math.round((val / maxValue) * 100), val > 0 ? 8 : 4);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.label}
                className="bar-group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div
                  className="bar-val-bubble"
                  style={{
                    opacity: isHovered || val > 0 ? 1 : 0.7,
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                  }}
                >
                  {val.toLocaleString()}
                </div>

                <div
                  className={`bar-pillar bar-pillar--${item.color || 'green'}`}
                  style={{
                    height: `${pct}%`,
                  }}
                />

                <span className="bar-label">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="chart-legend">
          {data.map((item) => (
            <div className="legend-item" key={item.label}>
              <span
                className="legend-dot"
                style={{
                  background:
                    item.color === 'blue'
                      ? '#3b82f6'
                      : item.color === 'orange'
                      ? '#f97316'
                      : item.color === 'purple'
                      ? '#8b5cf6'
                      : '#269c26',
                }}
              />
              <span>
                {item.label}: <strong>{(Number(item.value) || 0).toLocaleString()}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
