import { DB } from '@/lib/db';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('team_member')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('role', 'varchar(100)', (col) => col.notNull())
		.addColumn('member_id', 'integer', (col) =>
			col.references('member.id').onDelete('cascade').notNull(),
		)
		.addColumn('team_id', 'integer', (col) =>
			col.references('team.id').onDelete('cascade').notNull(),
		)
		.execute();

	await db.schema
		.createIndex('team_member_unique_index')
		.on('team_member')
		.columns(['member_id', 'team_id'])
		.unique()
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('team_member').execute();
}
