#!/usr/bin/env node

/**
 * Cloudflare Pages 部署前检查脚本
 * 验证所有必需的配置文件和设置
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const REQUIRED_FILES = [
  { path: 'public/_headers', desc: 'HTTP Headers 配置' },
  { path: 'public/_redirects', desc: 'SPA 路由重定向' },
  { path: '.node-version', desc: 'Node.js 版本锁定' },
  { path: 'wrangler.toml', desc: 'Cloudflare 配置' },
  { path: 'package.json', desc: 'Node.js 项目配置' },
  { path: 'vite.config.ts', desc: 'Vite 构建配置' },
];

const REQUIRED_SCRIPTS = ['dev', 'build', 'preview'];

console.log('🔍 开始检查 Cloudflare Pages 部署配置...\n');

let hasErrors = false;
let hasWarnings = false;

// 检查必需文件
console.log('📁 检查必需文件:');
for (const file of REQUIRED_FILES) {
  const filePath = resolve(process.cwd(), file.path);
  if (existsSync(filePath)) {
    console.log(`  ✅ ${file.path} - ${file.desc}`);
  } else {
    console.log(`  ❌ ${file.path} - ${file.desc} [缺失]`);
    hasErrors = true;
  }
}
console.log('');

// 检查 package.json 脚本
console.log('📜 检查 package.json 脚本:');
try {
  const packageJson = JSON.parse(
    readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')
  );

  for (const script of REQUIRED_SCRIPTS) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ npm run ${script} - ${packageJson.scripts[script]}`);
    } else {
      console.log(`  ❌ npm run ${script} [缺失]`);
      hasErrors = true;
    }
  }

  // 检查构建命令
  if (packageJson.scripts?.build === 'tsc && vite build') {
    console.log('  ✅ 构建命令正确: tsc && vite build');
  } else {
    console.log('  ⚠️  构建命令可能不正确');
    hasWarnings = true;
  }
} catch (error) {
  console.log('  ❌ 无法读取 package.json');
  hasErrors = true;
}
console.log('');

// 检查 Node.js 版本
console.log('🔧 检查 Node.js 版本:');
try {
  const nodeVersion = readFileSync(
    resolve(process.cwd(), '.node-version'),
    'utf-8'
  ).trim();
  const currentVersion = process.version;

  console.log(`  📌 锁定版本: ${nodeVersion}`);
  console.log(`  💻 当前版本: ${currentVersion}`);

  if (currentVersion.includes(nodeVersion)) {
    console.log('  ✅ 版本匹配');
  } else {
    console.log('  ⚠️  版本不匹配（不影响 Cloudflare 部署）');
    hasWarnings = true;
  }
} catch (error) {
  console.log('  ❌ 无法读取 .node-version');
  hasErrors = true;
}
console.log('');

// 检查 _headers 文件内容
console.log('🔐 检查安全 Headers:');
try {
  const headers = readFileSync(
    resolve(process.cwd(), 'public/_headers'),
    'utf-8'
  );

  const requiredHeaders = [
    'Cross-Origin-Opener-Policy',
    'Cross-Origin-Embedder-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
  ];

  for (const header of requiredHeaders) {
    if (headers.includes(header)) {
      console.log(`  ✅ ${header}`);
    } else {
      console.log(`  ❌ ${header} [缺失]`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.log('  ❌ 无法读取 _headers 文件');
  hasErrors = true;
}
console.log('');

// 检查 Cloudflare 配置
console.log('☁️  Cloudflare Pages 配置建议:');
console.log('  📋 构建命令: npm run build');
console.log('  📂 输出目录: dist');
console.log('  🔧 Node.js 版本: 22.16.0');
console.log('  📍 根目录: / (默认)');
console.log('');

// 检查 dist 目录（如果存在）
console.log('📦 检查构建输出:');
const distPath = resolve(process.cwd(), 'dist');
if (existsSync(distPath)) {
  console.log('  ✅ dist 目录存在');
  console.log('  💡 建议: 运行 npm run build 确保是最新版本');
} else {
  console.log('  ⚠️  dist 目录不存在');
  console.log('  💡 建议: 运行 npm run build 生成构建文件');
  hasWarnings = true;
}
console.log('');

// 总结
console.log('═══════════════════════════════════════════');
if (hasErrors) {
  console.log('❌ 检查失败: 发现必需配置缺失');
  console.log('   请修复上述错误后重新部署');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  检查通过（有警告）');
  console.log('   可以部署，但建议检查警告项');
  process.exit(0);
} else {
  console.log('✅ 所有检查通过！可以开始部署');
  console.log('');
  console.log('🚀 部署步骤:');
  console.log('   1. 将代码推送到 Git 仓库');
  console.log('   2. 在 Cloudflare Dashboard 连接仓库');
  console.log('   3. 使用上述配置创建项目');
  console.log('   4. 点击 Deploy');
  console.log('');
  console.log('   或使用 CLI: npm run deploy:preview');
  process.exit(0);
}

