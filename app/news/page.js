import dbConnect from "../../lib/mongodb";
import News from "../../models/News";
import NewsList from "../../components/NewsList";
import { oxanium } from "../../utils/fonts";

export const dynamic = "force-dynamic";

export default async function Page() {
	try {
		await dbConnect();
		const news = await News.find({}).sort({ publishDate: -1 }).lean();
		const newsData = JSON.parse(JSON.stringify(news));

		return (
			<div className="p-4 mx-auto max-w-3xl">
				<h1
					className={`${oxanium.className} mb-4 text-center text-3xl font-bold uppercase tracking-wide text-yellow-600`}
				>
					Latest News
				</h1>
				<div className="mb-6 indent-4 text-neutral-300">
					<p>
						On this page, you will find the latest news and updates about the SIMERG and our
						esports-related activities.
					</p>
				</div>
				<NewsList news={newsData} />
			</div>
		);
	} catch (error) {
		console.error("Error fetching news:", error);
		return <div className="text-center text-neutral-300">Error loading news</div>;
	}
}
