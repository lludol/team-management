import { Member } from "@/models/Member";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMembers = async () => {
	const res = await fetch(`${BASE_URL}/api/members`);

	if (!res.ok) {
		throw new Error('Failed to fetch members');
	}

	return res.json() as unknown as Member[];
};
