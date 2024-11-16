import ProjectsList from "../../../components/ProjectsList";

export default function ProjectsPage({ params }) {
  const { type, slug } = params;
  return <ProjectsList type={type} slug={slug} />;
}
