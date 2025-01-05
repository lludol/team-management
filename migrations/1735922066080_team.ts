import { DB } from '@/lib/db';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('team')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(255)', (col) => col.notNull())
		.addColumn('parent_team_id', 'integer', (col) =>
			col.references('team.id'),
		)
		.execute();

	await db.schema
		.createIndex('team_parent_team_id_index')
		.on('team')
		.columns(['parent_team_id'])
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('team').execute();
}
