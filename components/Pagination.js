export default function Pagination({ newsPerPage, totalNews, paginate, currentPage }) {
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalNews / newsPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<nav className="mt-4 flex justify-center">
			<ul className="flex space-x-2">
				{pageNumbers.map((number) => (
					<li key={number}>
						<button
							onClick={() => paginate(number)}
							className={`rounded px-3 py-1 ${
								currentPage === number
									? "bg-yellow-600 text-white"
									: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
							}`}
						>
							{number}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
