/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventType = {
  _id: string;
  title: string;
  image?: string;
  startsAt: string;
  endsAt: string;
  queueType: "FIFO" | "PRIORITY";
  isActive: boolean;
};

const queueTypes = [
  { label: "All", value: "all" },
  { label: "FIFO", value: "FIFO" },
  { label: "PRIORITY", value: "PRIORITY" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const PAGE_SIZE = 9;

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states initialized from URL params
  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );
  const [queueTypeRaw, setQueueTypeRaw] = useState<string>(
    searchParams.get("queueType") ?? "all"
  );
  const [statusRaw, setStatusRaw] = useState<string>(
    searchParams.get("status") ?? "all"
  );

  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );

  // Data states
  const [events, setEvents] = useState<EventType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce ref for search
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean "all" values to empty strings for API params
  const cleanParam = (val: string) => (val === "all" ? "" : val);

  async function fetchEvents() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("searchTerm", search.trim());
      if (cleanParam(queueTypeRaw))
        params.set("queueType", cleanParam(queueTypeRaw));
      if (cleanParam(statusRaw)) params.set("isActive", cleanParam(statusRaw));
      params.set("page", page.toString());
      params.set("limit", PAGE_SIZE.toString());

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/event?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvents(data.data || []);
      setTotalPages(data.meta?.totalPage || 1);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error occurred");
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  // Update URL query and fetch data, debounce search
  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (queueTypeRaw !== "all") params.set("queueType", queueTypeRaw);
    if (statusRaw !== "all") params.set("status", statusRaw);
    params.set("page", page.toString());

    router.replace(`/events?${params.toString()}`, { scroll: false });

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchEvents();
    }, 350);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search, queueTypeRaw, statusRaw, page, router]);

  // Reset all filters
  function resetFilters() {
    setSearch("");
    setQueueTypeRaw("all");
    setStatusRaw("all");
    setPage(1);
  }

  // Pagination buttons
  function Pagination() {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          aria-current={page === i ? "page" : undefined}
          onClick={() => setPage(i)}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            page === i
              ? "bg-blue-600   shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }

    return (
      <nav
        aria-label="Pagination Navigation"
        className="flex justify-center gap-2 mt-8 select-none"
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ← Prev
        </button>
        {pages}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next →
        </button>
      </nav>
    );
  }

  // Skeleton loader UI
  function SkeletonCard() {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden h-[250px]">
        <div className="bg-gray-300 h-36 w-full" />
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="inline-block mt-3 px-3 py-1 bg-gray-300 rounded-full w-16 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-24">
      {/* Filters & Search - Top Centered */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 flex-wrap">
        {/* Search */}
        <Input
          aria-label="Search events by title"
          placeholder="Search by event title..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="bg-transparent border border-gray-600 placeholder-gray-400  focus:ring-2 focus:ring-blue-600 focus:border-blue-600 max-w-sm w-full"
        />

        {/* Queue Type */}
        <Select
          value={queueTypeRaw}
          onValueChange={(val) => {
            setPage(1);
            setQueueTypeRaw(val);
          }}
          aria-label="Filter by queue type"
        >
          <SelectTrigger className="bg-transparent border border-gray-600   focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
            <SelectValue placeholder="Queue Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {queueTypes.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={statusRaw}
          onValueChange={(val) => {
            setPage(1);
            setStatusRaw(val);
          }}
          aria-label="Filter by event status"
        >
          <SelectTrigger className="bg-transparent border border-gray-600   focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="outline"
          onClick={resetFilters}
          className="border-gray-600 hover:bg-gray-800   whitespace-nowrap"
          aria-label="Reset filters"
        >
          Reset
        </Button>
      </section>

      {/* Events Grid */}
      <section>
        <h1
          className="font-extrabold mb-6 text-center  "
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          📅 Upcoming Queue Events
        </h1>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(PAGE_SIZE)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-gray-400">No upcoming events found.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event._id} href={`/events/${event._id}`}>
                  <div className="bg-white text-black shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <Image
                      src={event.image || "/default-event-image.jpg"}
                      alt={event.title}
                      width={600}
                      height={192}
                      className="w-full h-44 object-cover"
                      style={{ objectFit: "cover" }}
                      priority={false}
                      placeholder="blur"
                      blurDataURL="/default-event-image.jpg"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-1">
                        Starts: {new Date(event.startsAt).toLocaleString()}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Ends: {new Date(event.endsAt).toLocaleString()}
                      </p>
                      <span className="inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                        {event.queueType}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </>
        )}
      </section>
    </div>
  );
}
