import { db } from "@/lib/kysely";
import { TeamNode, TeamMember } from "@/models/Team";
import { sql } from "kysely";
import { NextResponse } from "next/server";

export async function GET() {
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

		return NextResponse.json(buildTree(teams as unknown as TeamNode[]));
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch teams' },
			{ status: 500 },
		);
	}
}


