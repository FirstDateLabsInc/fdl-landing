// Shared radar chart geometry utilities

export interface RadarConfig {
  size: number;
  radius: number;
  levels?: number;
}

export interface RadarHelpers {
  center: number;
  levels: number;
  polarToCartesian: (angle: number, r: number) => { x: number; y: number };
  getPolygonPoints: (values: number[], maxValue?: number) => string;
  getGridPoints: (level: number, numAxes: number) => string;
}

/**
 * Factory function to create radar chart geometry helpers
 * with configurable size and radius
 */
export function createRadarHelpers(config: RadarConfig): RadarHelpers {
  const { size, radius, levels = 5 } = config;
  const center = size / 2;

  function polarToCartesian(angle: number, r: number): { x: number; y: number } {
    const adjustedAngle = angle - Math.PI / 2;
    return {
      x: center + r * Math.cos(adjustedAngle),
      y: center + r * Math.sin(adjustedAngle),
    };
  }

  function getPolygonPoints(values: number[], maxValue = 100): string {
    const n = values.length;
    const angleStep = (2 * Math.PI) / n;
    return values
      .map((value, i) => {
        const angle = i * angleStep;
        const normalizedRadius = (value / maxValue) * radius;
        const { x, y } = polarToCartesian(angle, normalizedRadius);
        return `${x},${y}`;
      })
      .join(" ");
  }

  function getGridPoints(level: number, numAxes: number): string {
    const r = (level / levels) * radius;
    const angleStep = (2 * Math.PI) / numAxes;
    return Array.from({ length: numAxes })
      .map((_, i) => {
        const { x, y } = polarToCartesian(i * angleStep, r);
        return `${x},${y}`;
      })
      .join(" ");
  }

  return { center, levels, polarToCartesian, getPolygonPoints, getGridPoints };
}

// Pre-configured helpers for chart sizes used in the app
export const OVERALL_RADAR_CONFIG = { size: 500, radius: 120, levels: 5 } as const;
export const CATEGORY_RADAR_CONFIG = { size: 500, radius: 70, levels: 5 } as const;

export const OVERALL_RADAR = createRadarHelpers(OVERALL_RADAR_CONFIG);
export const CATEGORY_RADAR = createRadarHelpers(CATEGORY_RADAR_CONFIG);
