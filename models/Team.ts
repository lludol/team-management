export interface TeamBody {
	name: string;
	parent_team_id: number | string;
	members: Array<TeamMember>;
}

export interface TeamMember {
	id: number;
	name: string;
	role: string;
}

export interface Team {
	id: number;
	name: string;
	parent_team_id: number | null;
	members: Array<TeamMember>;
}

export interface TeamNode {
	id: number;
	name: string;
	path: string;
	parent_team_id: number | null;

	members: Array<TeamMember>;

	children: TeamNode[];
}
