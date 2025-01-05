import Link from "next/link";

const TeamsEmpty = () => {
	return (
		<div className="hero min-h-full">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-4xl font-bold">
						No team found
					</h1>

					<p className="py-6">
						You don&apos;t have any teams yet.<br/>
						Create a team to get started
					</p>

					<Link href="/teams/create" className="btn btn-primary">
						Create a team
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TeamsEmpty;
