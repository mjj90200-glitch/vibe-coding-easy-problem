/**
 * 口算练习 - 面向小学生的计算题生成器 (Backend)
 * =============================================
 * 纯 Node.js 后端，零外部依赖。
 * 使用内置 http 模块提供 RESTful API + 静态文件服务。
 *
 * 运行方式：
 *   cd backend && node server.js
 *   # 访问 http://localhost:8000
 */

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

// -----------------------------------------------------------------
// 配置
// -----------------------------------------------------------------
const PORT = 8000;
const FRONTEND_DIR = path.resolve(__dirname, '..', 'frontend');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

// -----------------------------------------------------------------
// 题目生成引擎
// -----------------------------------------------------------------

/**
 * 生成一道加法题
 * 约束：50 ≤ 运算结果 ≤ 100，两个加数均为正整数
 */
function generateAddition() {
  const result = randomInt(50, 100);
  const a = randomInt(1, result - 1);
  const b = result - a;
  return buildProblem('add', '+', a, b, result);
}

/**
 * 生成一道减法题
 * 约束：50 ≤ 被减数 ≤ 100，结果 ≥ 0
 */
function generateSubtraction() {
  const a = randomInt(50, 100);
  const b = randomInt(1, a);
  const result = a - b;
  return buildProblem('sub', '-', a, b, result);
}

function buildProblem(type, operator, a, b, result) {
  return {
    id:        crypto.randomBytes(4).toString('hex'),
    type:      type,
    operand1:  a,
    operand2:  b,
    operator:  operator,
    answer:    result,
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -----------------------------------------------------------------
// API 路由处理
// -----------------------------------------------------------------

function handleAPI(req, res) {
  const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = u.pathname;

  // GET /api/types
  if (p === '/api/types' && req.method === 'GET') {
    return sendJSON(res, { types: ['add', 'sub', 'both'] });
  }

  // GET /api/generate
  if (p === '/api/generate' && req.method === 'GET') {
    const count = Math.min(Math.max(parseInt(u.searchParams.get('count')) || 10, 1), 50);
    const types = ['add', 'sub', 'both'].includes(u.searchParams.get('types'))
      ? u.searchParams.get('types') : 'both';

    const problems = [];
    for (let i = 0; i < count; i++) {
      const t = types === 'both' ? (Math.random() < 0.5 ? 'add' : 'sub') : types;
      problems.push(t === 'add' ? generateAddition() : generateSubtraction());
    }

    return sendJSON(res, { problems, total: problems.length });
  }

  // 404
  sendJSON(res, { error: 'Not Found' }, 404);
}

// -----------------------------------------------------------------
// 静态文件服务
// -----------------------------------------------------------------

function serveStatic(req, res) {
  let fp = path.join(FRONTEND_DIR, req.url === '/' ? 'index.html' : req.url);

  // 安全：防止目录穿越
  if (!fp.startsWith(FRONTEND_DIR)) {
    return sendJSON(res, { error: 'Forbidden' }, 403);
  }

  const ext = path.extname(fp);
  const ct  = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fp, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return fs.readFile(path.join(FRONTEND_DIR, 'index.html'), (e2, d2) => {
          if (e2) return sendJSON(res, { error: 'Not Found' }, 404);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(d2);
        });
      }
      return sendJSON(res, { error: 'Internal Server Error' }, 500);
    }
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  });
}

// -----------------------------------------------------------------
// 辅助
// -----------------------------------------------------------------

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data, null, 2));
}

// -----------------------------------------------------------------
// 主服务
// -----------------------------------------------------------------

const server = http.createServer((req, res) => {
  const p = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  p.startsWith('/api/') ? handleAPI(req, res) : serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🧮  口算小练习');
  console.log('  ' + '─'.repeat(30));
  console.log('  服务已启动: http://localhost:' + PORT);
  console.log('  API 端点:   /api/generate  /api/types');
  console.log('  ' + '─'.repeat(30));
  console.log('');
});
