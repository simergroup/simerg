import NewsCard from "../../../components/NewsCard";

export default function NewsSlugPage({ params }) {
	return <NewsCard slug={params.slug} />;
}
