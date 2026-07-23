import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import reportRoutes from './routes/reports.js'

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API 路由
app.use('/api/reports', reportRoutes)

// 健康检查
app.use('/api/health', (_req: Request, res: Response): void => {
  res.status(200).json({ success: true, message: 'ok' })
})

// 生产环境：提供静态文件
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req: Request, res: Response): void => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// 错误处理
app.use((error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Server error:', error)
  res.status(500).json({ success: false, error: '服务器内部错误' })
})

// 404
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: 'API 不存在' })
})

export default app
