import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/75" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
										<ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
									</div>
									<div>
										<Dialog.Title as="h3" className="text-lg font-medium text-neutral-100">
											{title}
										</Dialog.Title>
										<p className="mt-2 text-sm text-neutral-400">{message}</p>
									</div>
								</div>

								<div className="mt-6 flex justify-end gap-3">
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
										onClick={onClose}
									>
										Cancel
									</button>
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
										onClick={onConfirm}
									>
										Delete
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
