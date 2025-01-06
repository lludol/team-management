import { db, sql } from "@/lib/kysely";
import { TeamMember, TeamNode } from "@/models/Team";

export const getTeam = async (teamId: number) => {
	try {
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
			throw new Error('Team not found');
		}

		return {
			...team,
			members: team.members || [],
		};
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch team');
	}
};
export type Team = Awaited<ReturnType<typeof getTeam>>;

export const getTeams = async () => {
	try {
		const teams = await db
			.selectFrom('team')
			.select(['id', 'name'])
			.orderBy('name')
			.execute();

		return teams;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch teams');
	}
};
export type Teams = Awaited<ReturnType<typeof getTeams>>;

export const getTeamsTree = async () => {
	try {
		const teams = await db
			.withRecursive('team_hierarchy', (q1) => q1
				.selectFrom('team as t')
				.select([
					't.id',
					't.name',
					't.parent_team_id',
					sql<string>`CAST(t.name AS varchar)`.as('path'),
				])
				.where('t.parent_team_id', 'is', null)

				.unionAll(q1
					.selectFrom('team as t2')
					.innerJoin('team_hierarchy as th', 'th.id', 't2.parent_team_id')
					.select([
						't2.id',
						't2.name',
						't2.parent_team_id',
						sql<string>`CAST(th.path || ' > ' || t2.name AS varchar)`.as('path'),
					]),
				),
			)
			.selectFrom('team_hierarchy as th1')
			.leftJoin('team_member as tm', 'th1.id', 'tm.team_id')
			.leftJoin('member as m', 'tm.member_id', 'm.id')
			.select([
				'th1.id',
				'th1.name',
				'th1.parent_team_id',
				'th1.path',
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
			.groupBy([
				'th1.id',
				'th1.name',
				'th1.path',
				'th1.parent_team_id',
			])
			.orderBy('th1.path')
			.execute();

		const buildTree = (nodes: TeamNode[], parentId: number | null = null): TeamNode[] => {
			return nodes
				.filter((node) => node.parent_team_id === parentId)
				.map((node) => ({
					...node,
					members: node.members || [],
					children: buildTree(nodes, node.id),
				}));
		};

		return buildTree(teams as unknown as TeamNode[]);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch teams tree');
	}
};
export type TeamsTree = Awaited<ReturnType<typeof getTeamsTree>>;
