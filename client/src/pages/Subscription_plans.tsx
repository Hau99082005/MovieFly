import { useEffect, useMemo, useState } from "react";
import { Check, Monitor, Download, Ban, Sparkles, Film, Loader2 } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  is_active: boolean;
  video_quality: string;
  max_screens: number | string;
  max_downloads: number;
  has_ads: boolean;
}

interface SubscriptionPlansProps {
  onSubscribe?: (plan: Plan) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const DURATION_LABELS: Record<number, string> = {
  30: "Theo tháng",
  90: "3 tháng",
  365: "Theo năm",
};

const durationLabel = (days: number): string => DURATION_LABELS[days] || `${days} ngày`;

const formatPrice = (price: number, currency: string): string =>
  new Intl.NumberFormat("vi-VN", {
    style: currency === "VND" ? "currency" : "decimal",
    currency: currency === "VND" ? "VND" : undefined,
    maximumFractionDigits: 0,
  }).format(price) + (currency !== "VND" ? ` ${currency}` : "");

export default function SubscriptionPlans({ onSubscribe }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [activeDuration, setActiveDuration] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadPlans() {
      setStatus("loading");
      try {
        const res = await fetch(`${API_URL}/subscription-plans`);
        if (!res.ok) throw new Error("Không thể tải danh sách gói");
        const json = await res.json();

        // Chỉ giữ gói đang active trang đăng ký.
        const data = (json.data || [])
          .filter((p: Plan) => p.is_active && p.slug !== "free")
          .sort((a: Plan, b: Plan) => a.price - b.price);

        if (!ignore) {
          setPlans(data);
          const durationSet = new Set<number>(data.map((p: Plan) => p.duration_days));
          const durations = Array.from(durationSet);
          const firstDuration = durations.length > 0 ? durations.sort((a, b) => a - b)[0] : null;
          setActiveDuration(firstDuration);
          setStatus("success");
        }
      } catch {
        if (!ignore) setStatus("error");
      }
    }

    loadPlans();
    return () => {
      ignore = true;
    };
  }, []);

  const durations = useMemo(
    () => [...new Set(plans.map((p) => p.duration_days))].sort((a, b) => a - b),
    [plans]
  );

  const visiblePlans = useMemo(
    () => plans.filter((p) => p.duration_days === activeDuration),
    [plans, activeDuration]
  );

  const popularId = visiblePlans[Math.floor(visiblePlans.length / 2)]?._id;
  const selectedPlan = visiblePlans.find((p) => p._id === selectedId);

  const handleTabChange = (days: number) => {
    setActiveDuration(days);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary mb-5">
            <Film className="h-3.5 w-3.5" />
            Vé xem không giới hạn
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-50">
            Chọn gói phù hợp
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-4 text-zinc-400 max-w-md mx-auto">
            Mỗi gói là một vé vào rạp riêng của bạn — xem bao nhiêu tuỳ thích, dừng bất cứ lúc nào.
          </p>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm">Đang tải các gói...</span>
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto max-w-md text-center rounded-2xl border border-white/10 bg-zinc-900 px-6 py-10">
            <p className="text-zinc-200 font-medium">Không tải được danh sách gói.</p>
            <p className="text-zinc-500 text-sm mt-1">Vui lòng kiểm tra kết nối và thử lại.</p>
          </div>
        )}

        {status === "success" && plans.length === 0 && (
          <div className="mx-auto max-w-md text-center rounded-2xl border border-white/10 bg-zinc-900 px-6 py-10">
            <p className="text-zinc-200 font-medium">Chưa có gói nào đang mở bán.</p>
          </div>
        )}

        {status === "success" && plans.length > 0 && (
          <>
            {/* Tabs theo thời hạn */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-full border border-white/10 bg-zinc-900 p-1">
                {durations.map((days) => (
                  <button
                    key={days}
                    onClick={() => handleTabChange(days)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      activeDuration === days
                        ? "bg-primary text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {durationLabel(days)}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                visiblePlans.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : visiblePlans.length === 2
                  ? "sm:grid-cols-2 max-w-2xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {visiblePlans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  isSelected={plan._id === selectedId}
                  isPopular={plan._id === popularId && visiblePlans.length > 2}
                  onSelect={() => setSelectedId(plan._id)}
                />
              ))}
            </div>

            {/* Thanh xác nhận cố định phía dưới */}
            {selectedPlan && (
              <div className="sticky bottom-6 mt-12 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur px-6 py-4 shadow-2xl shadow-black/40">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Đã chọn</p>
                  <p className="font-semibold text-zinc-50">
                    {selectedPlan.name} ·{" "}
                    <span className="text-primary">
                      {formatPrice(selectedPlan.price, selectedPlan.currency)}
                    </span>
                    <span className="text-zinc-500">
                      {" "}
                      / {durationLabel(selectedPlan.duration_days)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onSubscribe?.(selectedPlan)}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  isPopular: boolean;
  onSelect: () => void;
}

function PlanCard({ plan, isSelected, isPopular, onSelect }: PlanCardProps) {
  const screenCount =
    typeof plan.max_screens === "number" ? plan.max_screens : plan.max_screens ? "Không giới hạn" : 1;

  const features = [
    { icon: Monitor, label: `${screenCount} màn hình cùng lúc` },
    {
      icon: Download,
      label:
        plan.max_downloads > 0
          ? `Tải xuống tối đa ${plan.max_downloads} phim`
          : "Không hỗ trợ tải xuống",
    },
    { icon: Sparkles, label: `Chất lượng ${plan.video_quality}` },
    { icon: Ban, label: plan.has_ads ? "Có quảng cáo" : "Không quảng cáo" },
  ];

  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col rounded-2xl border bg-zinc-900 text-left transition ${
        isSelected
          ? "border-primary ring-2 ring-primary/40"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Phổ biến nhất
        </span>
      )}

      {/* Phần thân vé */}
      <div className="p-6 pb-8">
        <h3 className="text-lg font-bold text-zinc-50">{plan.name}</h3>
        {plan.description && (
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{plan.description}</p>
        )}

        <ul className="mt-5 space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-300">
              <f.icon className="h-4 w-4 shrink-0 text-primary" />
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Đường xé vé — mô phỏng cuống vé xem phim */}
      <div className="relative">
        <div className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-950" />
        <div className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-950" />
        <div className="border-t border-dashed border-white/15" />
      </div>

      {/* Phần giá + CTA */}
      <div className="flex items-center justify-between gap-3 p-6 pt-5">
        <div>
          <p className="text-2xl font-black tracking-tight text-zinc-50">
            {formatPrice(plan.price, plan.currency)}
          </p>
          <p className="text-xs text-zinc-500">/ {durationLabel(plan.duration_days)}</p>
        </div>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
            isSelected
              ? "border-primary bg-primary text-white"
              : "border-white/20 text-transparent group-hover:border-white/40"
          }`}
        >
          <Check className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}