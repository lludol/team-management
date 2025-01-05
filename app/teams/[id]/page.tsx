export const dynamic = 'force-dynamic';

import TeamForm from "@/components/team/TeamForm";
import { getMembers } from "@/data/member.data";
import { getTeam, getTeams } from "@/data/team.data";

export default async function Team({
	params,
}: {
	params: Promise<{ id: string }>,
}) {
	const teamId = (await params).id;
	const team = await getTeam(teamId);
	const teams = await getTeams();
	const members = await getMembers();

	return (
		<div className="flex flex-col items-center flex-1">
			<h1 className="text-4xl font-bold">
				Edit team {team.name}
			</h1>

			<div className="border border-gray-200 rounded-lg p-4 mt-4">
				<TeamForm teams={teams} team={team} availableMembers={members} />
			</div>
		</div>
	);
}
