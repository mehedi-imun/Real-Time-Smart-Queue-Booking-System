"use client";
import { Button } from "@/components/ui/button";
import React from "react";

type EventType = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
};

const formatDateForGoogleCalendar = (dateStr: string) => {
  const date = new Date(dateStr);
  // Format: YYYYMMDDTHHmmssZ (UTC time)
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
};

type AddToCalendarProps = {
  event?: EventType;
};

const AddToCalendar: React.FC<AddToCalendarProps> = ({ event }) => {
  if (!event) return null;

  const handleAddToCalendar = () => {
    const start = formatDateForGoogleCalendar(event.startsAt);
    const end = formatDateForGoogleCalendar(event.endsAt);
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent("Dhaka, Bangladesh"); // Replace if needed

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${start}/${end}&location=${location}`;

    window.open(calendarUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleAddToCalendar}
      aria-label="Add event to Google Calendar"
    >
      📅 Add to Google Calendar
    </Button>
  );
};

export default AddToCalendar;
