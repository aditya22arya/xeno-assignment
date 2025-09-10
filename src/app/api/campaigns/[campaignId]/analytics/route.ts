import { NextResponse } from "next/server";
import CommunicationLog from "@/models/communicationLog";
import dbConnect from "@/lib/dbConnect";
import { format } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    await dbConnect();

    const logs = await CommunicationLog.find({
      campaignId: params.campaignId,
    }).sort({ createdAt: 1 });

    // Calculate metrics
    const total = logs.length;
    const delivered = logs.filter((log) => log.status === ('delivered' as typeof log.status)).length;
    const failed = logs.filter((log) => log.status === ('failed' as typeof log.status)).length;
    const pending = logs.filter((log) => log.status === ('pending' as typeof log.status)).length;

    // Generate timeline data
    const timelineMap = new Map();
    logs.forEach((log) => {
      const date = format(new Date(log.createdAt), "yyyy-MM-dd");
      if (!timelineMap.has(date)) {
        timelineMap.set(date, { delivered: 0, failed: 0 });
      }
      const status = String(log.status) === "delivered" ? "delivered" : "failed";
      timelineMap.get(date)[status]++;
    });

    const timeline = Array.from(timelineMap.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    return NextResponse.json({
      metrics: {
        total,
        delivered,
        failed,
        pending,
      },
      timeline,
    });
  } catch (error) {
    console.error("Error fetching campaign analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign analytics" },
      { status: 500 }
    );
  }
}
