"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

export default function PortfolioAnalytics() {
  return <VercelAnalytics beforeSend={(event) => event.url.includes("/admin") ? null : event}/>;
}
