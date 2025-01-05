export const dynamic = 'force-dynamic';

import Loader from "@/components/Loader";
import Tree from "@/components/team/Tree";
import { Suspense } from "react";

export default function Home() {
	return (
		<main className="flex-1">
			<Suspense fallback={<Loader/>}>
				<Tree/>
			</Suspense>
		</main>
	);
}
