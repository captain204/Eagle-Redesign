'use client'

import { useEffect } from 'react'

/**
 * A Next.js 14-16 development bug occasionally fires performance.measure()
 * with a negative timestamp. This component overrides performance.measure
 * to catch and suppress this specific error in the browser safely, without
 * crashing the page renderer.
 */
export default function PerformancePolyfill() {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.performance) {
            const originalMeasure = window.performance.measure.bind(window.performance)

            // @ts-ignore
            window.performance.measure = function (measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions | undefined, endMark?: string | undefined): PerformanceMeasure | undefined {
                try {
                    // Try to execute the original performance.measure
                    return originalMeasure(measureName, startOrMeasureOptions, endMark) as PerformanceMeasure
                } catch (error: any) {
                    // Next.js 14-16 Dev Runtime bug where it tries to pass a negative timestamp
                    if (error?.message?.includes('cannot have a negative time stamp')) {
                        console.warn(`[PerformancePolyfill] Suppressed negative timestamp error for measure: ${measureName}`)
                        return
                    }

                    // Re-throw if it's a different error
                    throw error
                }
            }
        }
    }, [])

    return null
}
