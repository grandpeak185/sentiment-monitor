import app from './app.js';
import { startScheduler } from './scheduler.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器已启动，端口: ${PORT}`);
  // 启动定时任务
  startScheduler();
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

export default app;
