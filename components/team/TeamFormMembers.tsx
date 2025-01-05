import { Member } from "@/models/Member";
import { TeamBody } from "@/models/Team";
import { Field, useFormikContext } from "formik";
import { useCallback, useMemo, useState } from "react";

interface Props {
	disabled: boolean;
	availableMembers: Member[];
}

const TeamFormMembers = ({
	disabled,
	availableMembers,
}: Props) => {
	console.log('availableMembers', availableMembers);
	const { values, setFieldValue } = useFormikContext<TeamBody>();

	const [memberIdSelected, setMemberIdSelected] = useState<number>(0);
	const membersToSelect = useMemo(() => {
		const selectedMembers = values.members.map((member) => member.id);

		return availableMembers
			.filter((member) => !selectedMembers.includes(member.id));
	}, [availableMembers, values.members]);

	const addMember = useCallback(() => {
		const memberToAdd = availableMembers.find((member) => member.id === memberIdSelected);

		if (memberToAdd) {
			setFieldValue('members', [
				...values.members,
				{
					id: memberToAdd.id,
					name: memberToAdd.name,
					role: '',
				},
			]);
		}

		setMemberIdSelected(0);
	}, [availableMembers, memberIdSelected, setFieldValue, values.members]);

	const deleteMember = useCallback((id: number) => {
		setFieldValue('members', values.members.filter((member) => member.id !== id));
	}, [setFieldValue, values.members]);

	const [createId, setCreateId] = useState(-1);
	const createMember = useCallback(() => {
		setFieldValue('members', [
			...values.members,
			{
				id: createId,
				name: '',
				role: '',
			},
		]);
		setCreateId((prev) => prev - 1);
	}, [createId, setFieldValue, values.members]);

	return (
		<div className="flex flex-col gap-4">
			<p className="font-semibold text-lg">
				Members
			</p>

			<table className="table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Role</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{ values.members.map((member, index) => (
						<tr key={member.id}>
							<td>
								<Field
									type="hidden"
									name={`members[${index}].id`}
									id={`members[${index}].id`}
									disabled={disabled}
								/>
								<Field
									type="text"
									name={`members[${index}].name`}
									id={`members[${index}].name`}
									className="input input-xs input-bordered w-full max-w-xs"
									placeholder="Enter the name"
									disabled={disabled}
									required
								/>
							</td>
							<td>
								<Field
									type="text"
									name={`members[${index}].role`}
									id={`members[${index}].role`}
									className="input input-xs input-bordered w-full max-w-xs"
									placeholder="Enter the role"
									disabled={disabled}
									required
								/>
							</td>
							<td>
								<button type="button" className="btn btn-error btn-xs" disabled={disabled} onClick={() => deleteMember(member.id)}>
									Delete
								</button>
							</td>
						</tr>
					))}

					{ membersToSelect.length > 0 && <tr>
						<td colSpan={2}>
							<select
								className="select select-xs select-bordered w-full max-w-xs"
								value={memberIdSelected ? memberIdSelected.toString() : 0}
								onChange={(e) => setMemberIdSelected(parseInt(e.target.value, 10))}
							>
								<option disabled value={0}>
									Select member
								</option>
								{ membersToSelect.map((member) => (
									<option key={member.id} value={member.id}>
										{ member.name }
									</option>
								))}
							</select>
						</td>
						<td>
							<button type="button" className="btn btn-info btn-xs" disabled={disabled || memberIdSelected === 0} onClick={addMember}>
								Add
							</button>
						</td>
					</tr> }

					<tr>
						<td colSpan={3}>
							<button type="button" className="btn btn-success btn-xs w-full" disabled={disabled} onClick={createMember}>
								Create a new member
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default TeamFormMembers;
