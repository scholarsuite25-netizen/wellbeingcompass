// Ensures Prisma provider matches DATABASE_URL for Vercel vs local
// Vercel: DATABASE_URL=postgresql:// → needs provider = "postgresql"
// Local: DATABASE_URL=file:./dev.db → needs provider = "sqlite"
// Run before prisma generate/migrate
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

let url = process.env.DATABASE_URL || '';
// strip quotes if present (Vercel dashboard sometimes no quotes)
url = url.replace(/^"|"$/g, '').replace(/^'/g, '').replace(/'$/g, '');

const wantPostgres = url.startsWith('postgresql://') || url.startsWith('postgres://');
const wantSqlite = url.startsWith('file:');

let m = /datasource\s+db\s*\{[^}]*provider\s*=\s*"(sqlite|postgresql)"/s.exec(schema);
let current = m?.[1];
let desired = wantPostgres ? 'postgresql' : wantSqlite ? 'sqlite' : null;

if (desired && current && desired !== current) {
  schema = schema.replace(/(datasource\s+db\s*\{[^}]*provider\s*=\s*)"(sqlite|postgresql)"/s, `$1"${desired}"`);
  fs.writeFileSync(schemaPath, schema);
  console.log(`[prepare-prisma] Switched provider ${current} → ${desired} for DATABASE_URL=${url.slice(0,30)}...`);
} else if (desired) {
  console.log(`[prepare-prisma] Provider ${current} already correct for ${desired} (${url.slice(0,20)}...)`);
} else {
  console.log(`[prepare-prisma] DATABASE_URL not set or unknown, keeping provider ${current}`);
}
