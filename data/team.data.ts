import { Team, TeamBody, TeamNode } from "@/models/Team";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createTeam = async (team: TeamBody) => {
	const res = await fetch(`${BASE_URL}/api/teams`, {
		method: 'POST',
		body: JSON.stringify({
			...team,
			parent_team_id: team.parent_team_id === '' ? null : team.parent_team_id,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error('Failed to create team');
	}
};

export const updateTeam = async (teamId: string, team: TeamBody) => {
	const res = await fetch(`${BASE_URL}/api/teams/${teamId}`, {
		method: 'PUT',
		body: JSON.stringify({
			...team,
			parent_team_id: team.parent_team_id === '' ? null : team.parent_team_id,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error('Failed to update team');
	}
};

export const getTeam = async (teamId: string) => {
	const res = await fetch(`${BASE_URL}/api/teams/${teamId}`);

	if (!res.ok) {
		throw new Error('Failed to fetch team');
	}

	return res.json() as unknown as Team;
};

export const getTeams = async () => {
	const res = await fetch(`${BASE_URL}/api/teams`);

	if (!res.ok) {
		throw new Error('Failed to fetch teams');
	}

	return res.json() as unknown as Team[];
};

export const getTeamsTree = async () => {
	const res = await fetch(`${BASE_URL}/api/teams/tree`);

	if (!res.ok) {
		throw new Error('Failed to fetch teams tree');
	}

	return res.json() as unknown as TeamNode[];
};
