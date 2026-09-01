import { useEffect } from "react";
import { connectSocket } from "../services/socket";

export function useSocket({ onNewReport, onStatusUpdated } = {}) {
  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    const newHandler = (report) => onNewReport?.(report);
    const statusHandler = (report) => onStatusUpdated?.(report);

    socket.on("new_disaster_report", newHandler);
    socket.on("report_status_updated", statusHandler);

    return () => {
      socket.off("new_disaster_report", newHandler);
      socket.off("report_status_updated", statusHandler);
    };
  }, [onNewReport, onStatusUpdated]);
}
