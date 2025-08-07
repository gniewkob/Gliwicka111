interface BenchmarkResult {
  name: string
  duration: number
  memory: {
    before: number
    after: number
    peak: number
  }
  iterations: number
  averageTime: number
  minTime: number
  maxTime: number
}

export class PerformanceBenchmark {
  private results: BenchmarkResult[] = []

  async benchmark(name: string, fn: () => Promise<void> | void, iterations = 100): Promise<BenchmarkResult> {
    const times: number[] = []
    const memoryBefore = this.getMemoryUsage()
    let peakMemory = memoryBefore

    console.log(`Starting benchmark: ${name} (${iterations} iterations)`)

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      await fn()
      const endTime = performance.now()

      times.push(endTime - startTime)

      const currentMemory = this.getMemoryUsage()
      if (currentMemory > peakMemory) {
        peakMemory = currentMemory
      }

      // Progress indicator
      if (i % Math.floor(iterations / 10) === 0) {
        console.log(`Progress: ${Math.round((i / iterations) * 100)}%`)
      }
    }

    const memoryAfter = this.getMemoryUsage()
    const totalDuration = times.reduce((sum, time) => sum + time, 0)

    const result: BenchmarkResult = {
      name,
      duration: totalDuration,
      memory: {
        before: memoryBefore,
        after: memoryAfter,
        peak: peakMemory,
      },
      iterations,
      averageTime: totalDuration / iterations,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
    }

    this.results.push(result)
    this.logResult(result)

    return result
  }

  private getMemoryUsage(): number {
    if (typeof process !== "undefined" && process.memoryUsage) {
      return process.memoryUsage().heapUsed
    }

    if (typeof performance !== "undefined" && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize
    }

    return 0
  }

  private logResult(result: BenchmarkResult): void {
    console.log(`\n📊 Benchmark Results: ${result.name}`)
    console.log(`⏱️  Total Duration: ${result.duration.toFixed(2)}ms`)
    console.log(`📈 Average Time: ${result.averageTime.toFixed(2)}ms`)
    console.log(`⚡ Min Time: ${result.minTime.toFixed(2)}ms`)
    console.log(`🐌 Max Time: ${result.maxTime.toFixed(2)}ms`)
    console.log(`🔄 Iterations: ${result.iterations}`)
    console.log(`💾 Memory Before: ${this.formatBytes(result.memory.before)}`)
    console.log(`💾 Memory After: ${this.formatBytes(result.memory.after)}`)
    console.log(`💾 Peak Memory: ${this.formatBytes(result.memory.peak)}`)
    console.log(`📊 Memory Delta: ${this.formatBytes(result.memory.after - result.memory.before)}`)
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  getResults(): BenchmarkResult[] {
    return [...this.results]
  }

  compareResults(name1: string, name2: string): void {
    const result1 = this.results.find((r) => r.name === name1)
    const result2 = this.results.find((r) => r.name === name2)

    if (!result1 || !result2) {
      console.error("One or both benchmark results not found")
      return
    }

    console.log(`\n🔍 Comparison: ${name1} vs ${name2}`)

    const timeDiff = ((result2.averageTime - result1.averageTime) / result1.averageTime) * 100
    const memoryDiff = ((result2.memory.peak - result1.memory.peak) / result1.memory.peak) * 100

    console.log(`⏱️  Time Difference: ${timeDiff > 0 ? "+" : ""}${timeDiff.toFixed(2)}%`)
    console.log(`💾 Memory Difference: ${memoryDiff > 0 ? "+" : ""}${memoryDiff.toFixed(2)}%`)

    if (Math.abs(timeDiff) < 5) {
      console.log("✅ Performance is similar")
    } else if (timeDiff < 0) {
      console.log(`🚀 ${name1} is faster by ${Math.abs(timeDiff).toFixed(2)}%`)
    } else {
      console.log(`🚀 ${name2} is faster by ${timeDiff.toFixed(2)}%`)
    }
  }

  exportResults(format: "json" | "csv" = "json"): string {
    if (format === "csv") {
      const headers = [
        "Name",
        "Total Duration (ms)",
        "Average Time (ms)",
        "Min Time (ms)",
        "Max Time (ms)",
        "Iterations",
        "Memory Before (bytes)",
        "Memory After (bytes)",
        "Peak Memory (bytes)",
      ]

      const rows = this.results.map((result) => [
        result.name,
        result.duration.toFixed(2),
        result.averageTime.toFixed(2),
        result.minTime.toFixed(2),
        result.maxTime.toFixed(2),
        result.iterations.toString(),
        result.memory.before.toString(),
        result.memory.after.toString(),
        result.memory.peak.toString(),
      ])

      return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    }

    return JSON.stringify(this.results, null, 2)
  }
}

export const benchmark = new PerformanceBenchmark()

// Usage examples and test cases
export const runFormBenchmarks = async () => {
  console.log("🚀 Starting Form Performance Benchmarks...")

  // Benchmark form validation
  await benchmark.benchmark(
    "Form Validation",
    async () => {
      const { virtualOfficeFormSchema } = await import("@/lib/validation-schemas")
      const testData = {
        firstName: "Jan",
        lastName: "Kowalski",
        email: "jan@example.com",
        phone: "+48123456789",
        businessType: "llc",
        package: "standard",
        startDate: "2024-02-01",
        gdprConsent: true,
      }

      virtualOfficeFormSchema.parse(testData)
    },
    1000,
  )

  // Benchmark form rendering
  await benchmark.benchmark(
    "Form Rendering",
    async () => {
      const { render } = await import("@testing-library/react")
      const { VirtualOfficeForm } = await import("@/components/forms")

      const { unmount } = render(<VirtualOfficeForm />)
      unmount()
    },
    100,
  )

  // Benchmark analytics tracking
  await benchmark.benchmark(
    "Analytics Tracking",
    async () => {
      const { analyticsClient } = await import("@/lib/analytics-client")

      analyticsClient.trackFormView("virtual-office")
      analyticsClient.trackFieldFocus("virtual-office", "firstName")
      analyticsClient.trackFieldBlur("virtual-office", "firstName")
    },
    1000,
  )

  // Compare results
  benchmark.compareResults("Form Validation", "Form Rendering")
  benchmark.compareResults("Form Validation", "Analytics Tracking")

  console.log("\n📄 Exporting results...")
  console.log(benchmark.exportResults("json"))
}
