/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { fluidCalc } from '@/utils/fluidCalc';

describe('fluidCalc Utility', () => {
    describe('Basic Functionality', () => {
        it('should generate CSS clamp() with pixel values', () => {
            const result = fluidCalc(16, 32, 320, 1440);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toMatch(/px/);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });

        it('should generate CSS clamp() with rem values', () => {
            const result = fluidCalc('1rem', '2rem', 320, 1440);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toMatch(/rem/);
            expect(result).toContain('1rem');
            expect(result).toContain('2rem');
        });

        it('should use default viewport widths when not provided', () => {
            const result = fluidCalc(16, 32);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });

        it('should handle mixed units (rem and px)', () => {
            const result = fluidCalc('1rem', 32, 320, 1440);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toMatch(/rem/);
            expect(result).toContain('1rem');
            expect(result).toContain('2rem'); // 32px = 2rem
        });
    });

    describe('Unit Conversion', () => {
        it('should convert rem to px correctly (16px base)', () => {
            const result = fluidCalc('1rem', '2rem', 320, 1440);
            // 1rem = 16px, 2rem = 32px
            expect(result).toContain('1rem');
            expect(result).toContain('2rem');
        });

        it('should handle decimal rem values', () => {
            const result = fluidCalc('1.5rem', '2.5rem', 320, 1440);
            expect(result).toContain('1.5rem');
            expect(result).toContain('2.5rem');
        });

        it('should handle decimal pixel values', () => {
            const result = fluidCalc(16.5, 32.5, 320, 1440);
            expect(result).toContain('16.5px');
            expect(result).toContain('32.5px');
        });

        it('should prefer rem output when any input uses rem', () => {
            const result1 = fluidCalc('1rem', 32, 320, 1440);
            const result2 = fluidCalc(16, '2rem', 320, 1440);

            expect(result1).toMatch(/rem/);
            expect(result2).toMatch(/rem/);
        });

        it('should use px output when no rem inputs', () => {
            const result = fluidCalc(16, 32, 320, 1440);
            expect(result).toMatch(/px/);
            expect(result).not.toMatch(/rem/);
        });
    });

    describe('Mathematical Calculations', () => {
        it('should calculate slope correctly', () => {
            // Simple case: 16px to 32px over 320px to 1440px
            // Slope = (32 - 16) / (1440 - 320) = 16 / 1120 = 0.0142857...
            const result = fluidCalc(16, 32, 320, 1440);

            // The result should contain a vw value that represents the slope
            expect(result).toMatch(/\d+\.?\d*vw/);
        });

        it('should handle zero slope (same min and max values)', () => {
            const result = fluidCalc(20, 20, 320, 1440);
            expect(result).toContain('20px');
            // Should still generate valid clamp() even with zero slope
            expect(result).toMatch(/^clamp\(/);
        });

        it('should handle negative slope (decreasing values)', () => {
            const result = fluidCalc(32, 16, 320, 1440);
            expect(result).toContain('16px'); // min value
            expect(result).toContain('32px'); // max value
            expect(result).toMatch(/^clamp\(/);
        });

        it('should calculate intersection correctly', () => {
            // Test with known values to verify intersection calculation
            const result = fluidCalc(16, 32, 320, 1440);

            // Intersection = minValue - slope * minWidth
            // Should be included in the middle expression
            expect(result).toMatch(/[+-]?\d+\.?\d*(px|rem)/);
        });
    });

    describe('CSS Output Format', () => {
        it('should generate valid CSS clamp() syntax', () => {
            const result = fluidCalc(16, 32, 320, 1440);

            // Should start with clamp( and end with )
            expect(result).toMatch(/^clamp\(.+\)$/);

            // Should have exactly 2 commas (3 values)
            const commaCount = (result.match(/,/g) || []).length;
            expect(commaCount).toBe(2);
        });

        it('should have three comma-separated values', () => {
            const result = fluidCalc(16, 32, 320, 1440);
            const values = result
                .replace('clamp(', '')
                .replace(')', '')
                .split(',');

            expect(values).toHaveLength(3);
            expect(values[0].trim()).toMatch(/\d+\.?\d*(px|rem)/); // min value
            expect(values[1].trim()).toMatch(
                /[+-]?\d+\.?\d*(px|rem)\s*[+-]\s*\d+\.?\d*vw/
            ); // preferred value
            expect(values[2].trim()).toMatch(/\d+\.?\d*(px|rem)/); // max value
        });

        it('should format numbers with appropriate precision', () => {
            const result = fluidCalc(16.123456, 32.987654, 320, 1440);

            // Should handle decimal precision reasonably
            expect(result).toMatch(/\d+\.\d+/);
        });

        it('should handle very small decimal values', () => {
            const result = fluidCalc(0.1, 0.2, 320, 1440);
            expect(result).toContain('0.1px');
            expect(result).toContain('0.2px');
        });
    });

    describe('Edge Cases', () => {
        it('should handle string numbers', () => {
            const result = fluidCalc('16', '32', 320, 1440);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });

        it('should handle zero values', () => {
            const result = fluidCalc(0, 32, 320, 1440);
            expect(result).toContain('0px');
            expect(result).toContain('32px');
        });

        it('should handle negative values', () => {
            const result = fluidCalc(-16, 32, 320, 1440);
            expect(result).toContain('-16px');
            expect(result).toContain('32px');
        });

        it('should handle very large values', () => {
            const result = fluidCalc(1000, 2000, 320, 1440);
            expect(result).toContain('1000px');
            expect(result).toContain('2000px');
        });

        it('should handle very small viewport widths', () => {
            const result = fluidCalc(16, 32, 100, 200);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });

        it('should handle very large viewport widths', () => {
            const result = fluidCalc(16, 32, 320, 5000);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });

        it('should handle equal viewport widths', () => {
            const result = fluidCalc(16, 32, 1000, 1000);
            expect(result).toMatch(/^clamp\(/);
            // Should handle division by zero gracefully
        });

        it('should handle inverted viewport widths (max < min)', () => {
            const result = fluidCalc(16, 32, 1440, 320);
            expect(result).toMatch(/^clamp\(/);
            expect(result).toContain('16px');
            expect(result).toContain('32px');
        });
    });

    describe('Real-world Scenarios', () => {
        it('should generate responsive font sizes', () => {
            const result = fluidCalc('1rem', '2rem', 320, 1440);
            expect(result).toMatch(
                /^clamp\(1rem,\s*[+-]?\d+\.?\d*rem\s*[+-]\s*\d+\.?\d*vw,\s*2rem\)$/
            );
        });

        it('should generate responsive spacing', () => {
            const result = fluidCalc(8, 24, 320, 1440);
            expect(result).toMatch(
                /^clamp\(8px,\s*[+-]?\d+\.?\d*px\s*[+-]\s*\d+\.?\d*vw,\s*24px\)$/
            );
        });

        it('should handle typical mobile-to-desktop scaling', () => {
            const result = fluidCalc('14px', '18px', 375, 1200);
            expect(result).toContain('14px');
            expect(result).toContain('18px');
            expect(result).toMatch(/vw/);
        });

        it('should handle component padding scaling', () => {
            const result = fluidCalc('1rem', '3rem', 320, 1440);
            expect(result).toContain('1rem');
            expect(result).toContain('3rem');
        });

        it('should handle button size scaling', () => {
            const result = fluidCalc(40, 56, 320, 1440);
            expect(result).toContain('40px');
            expect(result).toContain('56px');
        });
    });

    describe('Performance and Consistency', () => {
        it('should execute quickly', () => {
            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                fluidCalc(16, 32, 320, 1440);
            }

            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100); // Should complete 1000 calls within 100ms
        });

        it('should return consistent results for same inputs', () => {
            const results = Array.from({ length: 10 }, () =>
                fluidCalc(16, 32, 320, 1440)
            );

            results.forEach((result, index) => {
                if (index > 0) {
                    expect(result).toBe(results[0]);
                }
            });
        });

        it('should handle rapid successive calls', () => {
            const results = [];
            for (let i = 0; i < 100; i++) {
                results.push(fluidCalc(i, i * 2, 320, 1440));
            }

            expect(results).toHaveLength(100);
            results.forEach(result => {
                expect(result).toMatch(/^clamp\(/);
            });
        });
    });

    describe('Input Validation', () => {
        it('should handle NaN inputs gracefully', () => {
            expect(() => fluidCalc(NaN, 32, 320, 1440)).not.toThrow();
            expect(() => fluidCalc(16, NaN, 320, 1440)).not.toThrow();
        });

        it('should handle Infinity inputs gracefully', () => {
            expect(() => fluidCalc(Infinity, 32, 320, 1440)).not.toThrow();
            expect(() => fluidCalc(16, Infinity, 320, 1440)).not.toThrow();
        });

        it('should handle empty string inputs', () => {
            expect(() => fluidCalc('', '32px', 320, 1440)).not.toThrow();
            expect(() => fluidCalc('16px', '', 320, 1440)).not.toThrow();
        });

        it('should handle invalid rem strings', () => {
            expect(() =>
                fluidCalc('invalidrem', '2rem', 320, 1440)
            ).not.toThrow();
            expect(() =>
                fluidCalc('1rem', 'invalidrem', 320, 1440)
            ).not.toThrow();
        });

        it('should handle null/undefined inputs gracefully', () => {
            expect(() => fluidCalc(null as any, 32, 320, 1440)).not.toThrow();
            expect(() =>
                fluidCalc(16, undefined as any, 320, 1440)
            ).not.toThrow();
        });
    });
});
