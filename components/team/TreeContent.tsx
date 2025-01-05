import { TeamMember } from "@/models/Team";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface Props {
	id: number;
	name: string;
	path: string;
	members: TeamMember[];
}

const TreeContent = ({
	id, name, path, members,
}: Props) => {
	const router = useRouter();
	const onClick = useCallback(() => {
		router.push(`/teams/${id}`);
	}, [id, router]);

	return (
		<div className="flex flex-col gap-4 items-start" onClick={onClick}>
			<div className="flex flex-col">
				<p className="text-lg font-bold">{ name }</p>
				<p className="text-xs italic">{ path }</p>
			</div>

			{ members.length > 0 && <div className="flex flex-col gap-2">
				<p className="font-semibold">
					Members
				</p>
				{ members.map((member) => (<div key={member.id.toString()} className="flex gap-2 items-center pl-4">
					<p>{ member.name }</p>
					<div className="badge badge-primary">
						{ member.role }
					</div>
				</div>)) }
			</div> }
		</div>
	);
};

export default TreeContent;
