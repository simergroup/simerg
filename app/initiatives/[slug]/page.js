import InitiativesList from "../../../components/InitiativesList";

export default function InitiativesSlugPage({ params }) {
  return <InitiativesList slug={params.slug} />;
}
