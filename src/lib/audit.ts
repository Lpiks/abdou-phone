import { connectDB } from './db';
import AuditLog from '@/models/AuditLog';
import { IAuditEntry } from '@/types';

export type { IAuditEntry };

declare global {
  // eslint-disable-next-line no-var
  var memoryAuditLogs: IAuditEntry[] | undefined;
}

let inMemoryAuditLogs: IAuditEntry[] = global.memoryAuditLogs || [
  {
    id: 'log_init_01',
    action: 'system_init',
    adminEmail: 'system@abdouphone.dz',
    targetType: 'settings',
    details: 'Initialisation du registre d’audit conforme Loi 18-07 / ANPDP.',
    ipMasked: '127.0.0.***',
    createdAt: new Date().toISOString(),
  },
];

if (!global.memoryAuditLogs) global.memoryAuditLogs = inMemoryAuditLogs;

export function maskIp(ip?: string | null): string {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return '127.0.0.***';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  }
  return '***.***.***.***';
}

export async function recordAuditLog(entry: {
  action: string;
  adminEmail: string;
  targetType: 'order' | 'product' | 'auth' | 'settings' | 'export' | 'promo';
  targetId?: string;
  details: string;
  ipMasked?: string;
}): Promise<void> {
  const ip = entry.ipMasked || '127.0.0.***';
  const mongooseInstance = await connectDB();

  if (mongooseInstance) {
    try {
      await AuditLog.create({
        ...entry,
        ipMasked: ip,
      });
      return;
    } catch (e) {
      console.warn('[Audit] Failed to persist to Mongo, logging to memory:', e);
    }
  }

  inMemoryAuditLogs.unshift({
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...entry,
    ipMasked: ip,
    createdAt: new Date().toISOString(),
  });
}

export async function listAuditLogs(limit: number = 100): Promise<IAuditEntry[]> {
  const mongooseInstance = await connectDB();
  if (mongooseInstance) {
    try {
      const docs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
      if (docs && docs.length > 0) return JSON.parse(JSON.stringify(docs));
    } catch (e) {
      console.warn('[Audit] Failed to list from Mongo, falling back to memory:', e);
    }
  }

  return inMemoryAuditLogs.slice(0, limit);
}
