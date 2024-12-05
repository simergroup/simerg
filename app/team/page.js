import dbConnect from "../../lib/mongodb";
import Team from "../../models/Team";
import TeamPage from "../../components/TeamPage";

export default async function Page() {
  await dbConnect();
  const team = await Team.find({}).sort({ createdAt: -1 }).lean();
  const teamData = JSON.parse(JSON.stringify(team));

  return <TeamPage team={teamData} />;
}