/**
 * @description A fluid calculation utility.
 * Returns a CSS clamp() expression for responsive scaling.
 *
 * @param {string | number} minValue - The minimum value (e.g., "1rem" or 16).
 * @param {string | number} maxValue - The maximum value (e.g., "2rem" or 32).
 * @param {number} minWidth - The min viewport width in px (default 320).
 * @param {number} maxWidth - The max viewport width in px (default 1440).
 * @returns {string} A CSS clamp() string ready to use in Emotion or styled-components.
 * 
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

export const fluidCalc = (
  minValue: string | number,
  maxValue: string | number,
  minWidth: number = 320,
  maxWidth: number = 1440
): string => {
  const remBase = 16;

  // Convert rem → px
  const toPx = (value: string | number): number => {
    if (typeof value === 'string' && value.includes('rem')) {
      return parseFloat(value) * remBase;
    }
    return typeof value === 'number' ? value : parseFloat(value);
  };

  const minValuePx = toPx(minValue);
  const maxValuePx = toPx(maxValue);

  const slope = (maxValuePx - minValuePx) / (maxWidth - minWidth);
  const intersection = minValuePx - slope * minWidth;

  // Decide output unit (rem if any side used rem)
  const useRem =
    (typeof minValue === 'string' && minValue.includes('rem')) ||
    (typeof maxValue === 'string' && maxValue.includes('rem'));

  const base = useRem ? remBase : 1;
  const intersectionUnit = intersection / base;
  const slopeVW = slope * 100;

  const unit = useRem ? 'rem' : 'px';

  // Return CSS clamp()
  return `clamp(${minValue}, calc(${intersectionUnit.toFixed(4)}${unit} + ${slopeVW.toFixed(4)}vw), ${maxValue})`;
};
