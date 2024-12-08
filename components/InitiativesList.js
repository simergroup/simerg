"use client";

import Image from "next/image";
import Link from "next/link";
import { oxanium } from "../utils/fonts";
import { useEffect, useState } from "react";

export default function InitiativesList({ slug }) {
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitiative() {
      try {
        const response = await fetch(`/api/initiatives/${slug}`);
        if (!response.ok) throw new Error("Initiative not found");
        const data = await response.json();
        setInitiative(data);
      } catch (error) {
        console.error("Error fetching initiative:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchInitiative();
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center text-neutral-300">Loading...</div>;
  }

  if (!initiative) {
    return <div className="text-center text-neutral-300">Initiative not found</div>;
  }

  return (
    <div className="flex flex-col items-center max-w-3xl px-4 mx-auto space-y-2 text-neutral-300">
      <h2 className={`${oxanium.className} font-bold text-2xl uppercase text-yellow-600`}>
        {initiative.title}
      </h2>
      {initiative.website && initiative.image && (
        <Link href={initiative.website} target="_blank">
          <Image
            src={initiative.image}
            alt={initiative.title + " image"}
            width={208}
            height={208}
            className="hover:scale-110"
          />
        </Link>
      )}
      <div className="py-6 space-y-2 text-justify indent-4">
        <p>{initiative.description}</p>
        {initiative.website && (
          <div className="indent-0">
            <Link
              href={initiative.website}
              target="_blank"
              className="font-bold text-yellow-600 underline underline-offset-2 w-fit hover:scale-105"
            >
              Visit Website
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
