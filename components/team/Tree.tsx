import TeamsEmpty from "./TeamsEmpty";
import Link from "next/link";
import { getTeamsTree } from "@/data/team.data";
import TreeItem from "./TreeItem";

const Tree = async () => {
	const teams = await getTeamsTree();

	if (teams.length === 0) {
		return (
			<TeamsEmpty/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-4">
				<ul className="menu bg-base-200 rounded-box">
					{ teams.map((team) => (
						<TreeItem
							key={team.id.toString()}
							team={team}
						/>
					))}
				</ul>
			</div>

			<div>
				<Link href="/teams/create" className="btn btn-primary">
				Create a team
				</Link>
			</div>
		</div>
	);
};

export default Tree;
