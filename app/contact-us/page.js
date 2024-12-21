"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { oxanium } from "../../utils/fonts";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ContactPage() {
	const form = useRef();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
				form.current,
				{
					publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
				}
			)
			.then(
				() => {
					setName("");
					setEmail("");
					setSubject("");
					setMessage("");
					toast.success("Message sent successfully!");
				},
				() => {
					toast.error("Something went wrong. Try again!");
				}
			);
	};

	return (
		<div className="p-4 space-y-4 md:flex">
			<div className="md:max-w-lg">
				<h1
					className={`${oxanium.className} p-2 text-center text-3xl font-bold uppercase tracking-wider text-yellow-600`}
				>
					Contact us
				</h1>
				<h1 className={`${oxanium.className} p-2 text-lg font-bold uppercase text-neutral-300`}>
					Need to get in touch with us? We{"'"}d love to hear from you.
				</h1>
				<p className="p-2 text-neutral-300">
					If you have any questions or suggestions, feel free to contact us. Our team is ready to
					get involved and answer your needs! We
					{"'"}ll get to you shortly.
				</p>
				<div className="px-2 space-y-5 text-neutral-300">
					<div className="flex gap-2">
						<div className="py-1">
							<FaMapMarkerAlt className="p-2 bg-yellow-600 rounded size-8" />
						</div>
						<div>
							<h1 className="text-lg font-bold">Address</h1>
							<p>Estrada da Costa, 1495-751</p>
							<p>Cruz Quebrada</p>
						</div>
					</div>
					<div className="flex gap-2">
						<div className="py-1">
							<FaPhoneAlt className="p-2 bg-yellow-600 rounded size-8" />
						</div>
						<div>
							<h1 className="text-lg font-bold">Contact</h1>
							<p className="text-base">Mobile: 21 414 9100</p>
							<div className="space-x-1">
								<span className="text-base">Mail:</span>
								<a
									href="mailto: enhance.research.group@gmail.com"
									className="text-yellow-600 underline underline-offset-2"
								>
									simeresearchgroup@gmail.com
								</a>
							</div>
						</div>
					</div>
					<div className="flex gap-2">
						<div className="py-1">
							<FaClock className="p-2 bg-yellow-600 rounded size-8" />
						</div>
						<div>
							<h1 className="text-lg font-bold">Working hours</h1>
							<p className="text-base">Monday - Saturday: 08:00 - 22:00</p>
							<p className="text-base">Sunday: Closed</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-center p-2 mx-auto md:w-96">
				<h1 className={`${oxanium.className} p-2 text-2xl font-bold uppercase text-yellow-600`}>
					Ready to get started?
				</h1>
				<form ref={form} onSubmit={sendEmail} className="flex flex-col p-2 space-y-2">
					<input
						type="text"
						name="name"
						placeholder="Your name"
						className="px-2 py-1 rounded ring-yellow-600 placeholder:text-neutral-500 focus:ring-4"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<input
						type="email"
						name="user_email"
						placeholder="Your email"
						className="px-2 py-1 rounded ring-yellow-600 placeholder:text-neutral-500 focus:ring-4"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="subject"
						name="subject"
						placeholder="Subject"
						className="px-2 py-1 rounded ring-yellow-600 placeholder:text-neutral-500 focus:ring-4"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						required
					/>
					<textarea
						name="message"
						placeholder="Your message"
						className="px-2 py-1 rounded ring-yellow-600 resize-none placeholder:text-neutral-500 focus:ring-4"
						rows={8}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					/>
					<button
						type="submit"
						value="Send"
						className="px-4 py-1 mx-auto w-full bg-yellow-600 rounded text-neutral-900"
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
