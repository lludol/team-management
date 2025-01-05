import { db } from "@/lib/kysely";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const teams = await db
			.selectFrom('team')
			.select(['id', 'name'])
			.orderBy('name')
			.execute();

		return NextResponse.json(teams);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch teams' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const { name, parent_team_id, members } = await request.json();

	try {
		const [newTeam] = await db
			.insertInto('team')
			.values({
				name,
				parent_team_id,
			})
			.returning('id')
			.execute();

		await db.transaction().execute(async (trx) => {
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
							team_id: newTeam.id,
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
							team_id: newTeam.id,
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
			{ error: 'Failed to create team' },
			{ status: 500 },
		);
	}
}
