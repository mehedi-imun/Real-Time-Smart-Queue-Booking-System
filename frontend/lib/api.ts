export async function getEventById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event/${id}`, {
      method: "GET",
      cache: "no-store", // ensures SSR freshness
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch event: ${res.statusText}`);
    }

    const data = await res.json();
    return data?.data || null; // Adjust based on your API response structure
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
}
