import { promises as fs } from 'fs'
import type { BuiltinEnvironment, ResolvedConfig } from '../types'
import { getWorkerState } from '../utils'
import { setupGlobalEnv, withEnv } from './setup'
import { startTests } from './run'

export async function run(files: string[], config: ResolvedConfig): Promise<void> {
  await setupGlobalEnv(config)

  for (const file of files) {
    const code = await fs.readFile(file, 'utf-8')

    const env = code.match(/@(?:vitest|jest)-environment\s+?([\w-]+)\b/)?.[1] || config.environment || 'node'

    if (!['node', 'jsdom', 'happy-dom'].includes(env))
      throw new Error(`Unsupported environment: ${env}`)

    const workerState = getWorkerState()
    workerState.filepath = file

    await withEnv(env as BuiltinEnvironment, config.environmentOptions || {}, async() => {
      await startTests([file], config)
    })

    workerState.filepath = undefined
  }
}
