export const dynamic = 'force-dynamic';

import TeamForm from "@/components/team/TeamForm";
import { getMembers } from "@/data/member.data";
import { getTeams } from "@/data/team.data";

export default async function CreateTeam() {
	const teams = await getTeams();
	const members = await getMembers();

	return (
		<div className="flex flex-col items-center flex-1">
			<h1 className="text-4xl font-bold">
				Create a new team
			</h1>

			<div className="border border-gray-200 rounded-lg p-4 mt-4">
				<TeamForm teams={teams} availableMembers={members} />
			</div>
		</div>
	);
}
