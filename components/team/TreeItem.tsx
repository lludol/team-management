"use client";

import { TeamNode } from "@/models/Team";
import TreeContent from "./TreeContent";

interface Props {
	team: TeamNode;
}

const TreeItem = ({
	team,
}: Props) => {
	return (
		<li>
			{ team.children.length === 0 && <TreeContent
				id={team.id}
				name={team.name}
				path={team.path}
				members={team.members}
			/>}

			{ team.children.length > 0 && <>
				<TreeContent
					id={team.id}
					name={team.name}
					path={team.path}
					members={team.members}
				/>
				<ul>
					{ team.children.map((child) => (
						<TreeItem key={child.id.toString()} team={child}/>
					))}
				</ul>
			</>}
		</li>
	);
};

export default TreeItem;
