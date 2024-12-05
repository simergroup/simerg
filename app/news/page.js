import { oxanium } from "../../utils/fonts";
import NewsList from "../../components/NewsList";

export default function NewsPage() {
  return (
    <div className="flex flex-col max-w-3xl p-4 mx-auto text-neutral-300">
      <h1 className={`${oxanium.className} text-3xl text-yellow-600 font-bold text-center uppercase tracking-wide p-2`}>
        Latest News
      </h1>
      <div className="text-justify indent-4">
        <p>
          On this page, you will find the latest news and updates about the SIMERG and our esports-related activities.
        </p>
      </div>
      <br />
      <NewsList />
    </div>
  );
}
