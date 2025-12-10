import { db } from '../config/firebase';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Backup script to export Firestore data
 * Run with: npm run backup
 */

const BACKUP_DIR = path.join(__dirname, '../../backups');
const COLLECTIONS = ['users', 'properties', 'bookings', 'favorites', 'notifications', 'conversations'];

async function backupCollection(collectionName: string) {
  console.log(`Backing up ${collectionName}...`);
  
  const snapshot = await db.collection(collectionName).get();
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `${collectionName}_${timestamp}.json`;
  const filepath = path.join(BACKUP_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✓ Backed up ${data.length} documents to ${filename}`);
  
  return data.length;
}

async function main() {
  try {
    console.log('📦 Starting database backup...\n');

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    let totalDocs = 0;
    for (const collection of COLLECTIONS) {
      const count = await backupCollection(collection);
      totalDocs += count;
    }

    console.log(`\n✅ Backup completed! Total documents: ${totalDocs}`);
    console.log(`Backup location: ${BACKUP_DIR}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error backing up database:', error);
    process.exit(1);
  }
}

main();
