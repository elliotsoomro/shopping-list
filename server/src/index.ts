import { buildApp } from './app'
import { buildConfig, config } from './config'

buildConfig()

const app = buildApp()

app.listen(config.port, () => {
  console.log(`🚀 Listening on http://localhost:${config.port}`)
})
