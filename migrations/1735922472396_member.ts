import { DB } from '@/lib/db';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('member')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.addColumn('active', 'boolean', (col) => col.defaultTo(false).notNull())
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('member').execute();
}
