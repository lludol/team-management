"use server";

import { db } from "@/lib/kysely";
import { TeamBody } from "@/models/Team";

export const createTeam = async (team: TeamBody) => {
	try {
		const [newTeam] = await db
			.insertInto('team')
			.values({
				name: team.name,
				parent_team_id: Number.isInteger(team.parent_team_id) ? team.parent_team_id as number : null,
			})
			.returning('id')
			.execute();

		await db.transaction().execute(async (trx) => {
			for (const member of team.members) {
				if (member.id > 0) {
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

		return {
			id: newTeam.id,
		};
	} catch (error) {
		console.error(error);
		throw new Error('Failed to create team');
	}
};

export const updateTeam = async (teamId: number, team: TeamBody) => {
	try {
		const result = await db
			.updateTable('team')
			.set({
				name: team.name,
				parent_team_id: Number.isInteger(team.parent_team_id) ? team.parent_team_id as number : null,
			})
			.where('id', '=', teamId)
			.executeTakeFirst();

		if (!result.numUpdatedRows) {
			throw new Error('Team not found');
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

			for (const member of team.members) {
				if (member.id > 0) {
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

		return {
			id: teamId,
		};
	} catch (error) {
		console.error(error);
		throw new Error('Failed to update team');
	}
};
