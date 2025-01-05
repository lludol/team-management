import { DB } from '@/lib/db';
import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('team_metadata')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('key', 'varchar(100)', (col) => col.notNull())
		.addColumn('value', 'varchar(255)', (col) => col.notNull())
		.addColumn('team_id', 'integer', (col) =>
			col.references('team.id').onDelete('cascade').notNull(),
		)
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn('updated_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	await db.schema
		.createIndex('team_metadata_unique_index')
		.on('team_metadata')
		.columns(['team_id', 'key'])
		.unique()
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('team_metadata').execute();
}
