import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export function useTeam() {
	const [team, setTeam] = useState([]);
	const api = useApi();

	const fetchTeam = async () => {
		try {
			const data = await api.get("/api/team");
			setTeam(data);
		} catch (error) {
			console.error("Error fetching team:", error);
		}
	};

	const createTeamMember = async (memberData) => {
		try {
			// If memberData is already FormData, use it directly
			const formData =
				memberData instanceof FormData
					? memberData
					: Object.entries(memberData).reduce((fd, [key, value]) => {
							if (key === "roles" && Array.isArray(value)) {
								fd.append(key, JSON.stringify(value));
							} else {
								fd.append(key, value);
							}
							return fd;
						}, new FormData());

			const data = await api.post("/api/team", formData);
			setTeam([data, ...team]);
			return data;
		} catch (error) {
			console.error("Error creating team member:", error);
			throw error;
		}
	};

	const updateTeamMember = async (id, memberData) => {
		try {
			// If memberData is already FormData, use it directly
			const formData =
				memberData instanceof FormData
					? memberData
					: Object.entries(memberData).reduce((fd, [key, value]) => {
							if (key === "roles" && Array.isArray(value)) {
								fd.append(key, JSON.stringify(value));
							} else {
								fd.append(key, value);
							}
							return fd;
						}, new FormData());

			const data = await api.put(`/api/team/${id}`, formData);
			setTeam(team.map((m) => (m._id === id ? data : m)));
			return data;
		} catch (error) {
			console.error("Error updating team member:", error);
			throw error;
		}
	};

	const deleteTeamMember = async (id) => {
		try {
			await api.delete(`/api/team/${id}`);
			setTeam(team.filter((m) => m._id !== id));
		} catch (error) {
			console.error("Error deleting team member:", error);
			throw error;
		}
	};

	useEffect(() => {
		fetchTeam();
	}, []);

	return {
		team,
		loading: api.loading,
		error: api.error,
		createTeamMember,
		updateTeamMember,
		deleteTeamMember,
		refreshTeam: fetchTeam,
	};
}
