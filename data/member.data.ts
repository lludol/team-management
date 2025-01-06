import { db } from "@/lib/kysely";

export const getMembers = async () => {
	try {
		const members = await db
			.selectFrom('member')
			.select(['id', 'name', 'active'])
			.orderBy('name')
			.execute();

		return members;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch members');
	}
};
export type Members = Awaited<ReturnType<typeof getMembers>>;
