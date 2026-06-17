import { useEffect, useState } from "react";

interface SeatSearchFloatingProps {
  onOpen: () => void;
}

export function SeatSearchFloating({ onOpen }: SeatSearchFloatingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    const show = () => {
      setIsVisible(true);
      intervals.push(setTimeout(() => setIsVisible(false), 30000)); // Hide after 30s
    };

    // Show first time after 3s
    intervals.push(setTimeout(show, 3000));

    // Then show every 60s (30s hidden + 30s visible)
    intervals.push(
      setInterval(() => {
        show();
      }, 60000),
    );

    return () => {
      intervals.forEach((id) => clearTimeout(id));
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 animate-in slide-in-from-bottom-4 z-50">
      <button
        onClick={onOpen}
        className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent to-accent/80 px-6 py-4 text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all"
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">Bạn đã xác nhận tham dự?</p>
          <p className="text-xs opacity-90">Tìm kiếm vị trí bàn tiệc ngay 🍽️</p>
        </div>
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold animate-pulse">
          !
        </div>
      </button>
    </div>
  );
}
