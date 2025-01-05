import { db } from "@/lib/kysely";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const members = await db
			.selectFrom('member')
			.select(['id', 'name', 'active'])
			.orderBy('name')
			.execute();

		return NextResponse.json(members);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Failed to fetch members' },
			{ status: 500 },
		);
	}
}
