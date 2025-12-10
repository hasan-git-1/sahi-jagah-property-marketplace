import { db } from '../config/firebase';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Restore script to import Firestore data from backup
 * Run with: npm run restore <backup-file>
 */

async function restoreCollection(filepath: string) {
  const filename = path.basename(filepath);
  const collectionName = filename.split('_')[0];
  
  console.log(`Restoring ${collectionName} from ${filename}...`);

  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  const batch = db.batch();
  let count = 0;

  for (const doc of data) {
    const { id, ...docData } = doc;
    const docRef = db.collection(collectionName).doc(id);
    batch.set(docRef, docData);
    count++;

    // Commit batch every 500 documents (Firestore limit)
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Committed ${count} documents...`);
    }
  }

  // Commit remaining documents
  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✓ Restored ${count} documents to ${collectionName}`);
  return count;
}

async function main() {
  try {
    const backupPath = process.argv[2];

    if (!backupPath) {
      console.error('❌ Please provide a backup file path');
      console.log('Usage: npm run restore <backup-file>');
      process.exit(1);
    }

    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup file not found: ${backupPath}`);
      process.exit(1);
    }

    console.log('📥 Starting database restore...\n');
    console.log('⚠️  WARNING: This will overwrite existing data!\n');

    const count = await restoreCollection(backupPath);

    console.log(`\n✅ Restore completed! Total documents: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring database:', error);
    process.exit(1);
  }
}

main();
