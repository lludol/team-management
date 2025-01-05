"use client";

import { Field, Form, Formik } from 'formik';
import { useCallback } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Team, TeamBody } from '@/models/Team';
import { createTeam, updateTeam } from '@/data/team.data';
import TeamFormMembers from './TeamFormMembers';
import { Member } from '@/models/Member';

interface Props {
	teams: Team[];
	team?: Team;
	availableMembers: Member[];
}

const teamValidationSchema = Yup.object({
	name:           Yup.string().min(3).required(),
	parent_team_id: Yup.number().nullable(),
	members:        Yup.array().of(Yup.object({
		id:        Yup.number().required(),
		name:      Yup.string().min(3).required(),
		role:      Yup.string().min(3).required(),
	})).required(),
});

const TeamForm = ({
	teams,
	team,
	availableMembers,
}: Props) => {
	const router = useRouter();
	const onSubmit = useCallback(async (values: TeamBody) => {
		if (team) {
			await updateTeam(team.id.toString(), values);
		} else {
			await createTeam(values);
		}
		router.push('/');
	}, [router, team]);

	return (
		<>
			<Formik
				initialValues={{
					name: team ? team.name : '',
					parent_team_id: team ? team.parent_team_id || '' : '',
					members: team ? team.members : [],
				}}
				validationSchema={teamValidationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="flex flex-col gap-8 min-w-96">
						<div className="flex flex-col gap-4">
							<p className="font-semibold text-lg">
								Team details
							</p>

							<Field
								type="text"
								name="name"
								id="name"
								className="input input-bordered w-full max-w-xs"
								placeholder="Enter the name of the team"
								disabled={isSubmitting}
							/>

							{ teams.length > 0 && <Field
								component="select"
								id="parent_team_id"
								name="parent_team_id"
								className="select select-bordered w-full max-w-xs"

							>
								<option value="">Select parent team (optional)</option>
								{ teams.map((team) => (
									<option
										key={team.id.toString()}
										value={team.id.toString()}
									>
										{ team.name }
									</option>
								)) }
							</Field> }
						</div>

						<TeamFormMembers disabled={isSubmitting} availableMembers={availableMembers} />

						<button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
							{team ? "Update team" : "Create team"}
						</button>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default TeamForm;
