import { db } from "@/lib/kysely";
import { TeamMember } from "@/models/Team";
import { sql } from "kysely";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const teamId = Number.parseInt((await params).id, 10);

		if (isNaN(teamId)) {
			return NextResponse.json(
				{ error: 'Invalid team ID' },
				{ status: 400 },
			);
		}

		const team = await db
			.selectFrom('team as t')
			.select([
				't.id',
				't.name',
				't.parent_team_id',
				sql<TeamMember[]>`array_agg(
				CASE
				WHEN tm.id IS NOT NULL
				THEN jsonb_build_object(
					'id', m.id,
					'name', m.name,
					'role', tm.role
				)
				ELSE NULL
				END
				) FILTER (WHERE m.id IS NOT NULL)`.as('members'),
			])
			.leftJoin('team_member as tm', 't.id', 'tm.team_id')
			.leftJoin('member as m', 'tm.member_id', 'm.id')
			.where('t.id', '=', teamId)
			.groupBy('t.id')
			.executeTakeFirst();

		if (!team) {
			return NextResponse.json(
				{ error: 'Team not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			...team,
			members: team.members || [],
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch teams' },
			{ status: 500 },
		);
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const teamId = Number.parseInt((await params).id, 10);
		const { name, parent_team_id, members } = await request.json();

		if (isNaN(teamId)) {
			return NextResponse.json(
				{ error: 'Invalid team ID' },
				{ status: 400 },
			);
		}

		const result = await db
			.updateTable('team')
			.set({
				name,
				parent_team_id,
			})
			.where('id', '=', teamId)
			.executeTakeFirst();

		if (!result.numUpdatedRows) {
			return NextResponse.json(
				{ error: 'Team not found' },
				{ status: 404 },
			);
		}

		await db.transaction().execute(async (trx) => {
			await trx
				.updateTable('member')
				.set({ active: false })
				.where('id', 'in', db.selectFrom('team_member').select('member_id').where('team_id', '=', teamId))
				.execute();

			await trx
				.deleteFrom('team_member')
				.where('team_id', '=', teamId)
				.execute();

			for (const member of members) {
				if (member.id > 0) {
					console.log(`Updating member ${member.id} with name ${member.name}`);
					await trx
						.updateTable('member')
						.set({
							name: member.name,
							active: true,
						})
						.where('id', '=', member.id)
						.execute();

					await trx
						.insertInto('team_member')
						.values({
							team_id: teamId,
							member_id: member.id,
							role: member.role,
						})
						.execute();
				} else {
					const [newMember] = await trx
						.insertInto('member')
						.values({
							name: member.name,
							active: true,
						})
						.returning('id')
						.execute();

					await trx
						.insertInto('team_member')
						.values({
							team_id: teamId,
							member_id: newMember.id,
							role: member.role,
						})
						.execute();
				}
			}
		});

		return NextResponse.json({});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to update team' },
			{ status: 500 },
		);
	}
}
