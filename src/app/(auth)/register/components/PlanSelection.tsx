// PlanSections.tsx
import { Check, Loader2 } from "lucide-react";

interface PlanSelectionProps {
  pricings: any[];
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  errorMsg: string;
  successMsg: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
  selectedPlan: any;
}

export function PlanSelection({
  pricings, selectedPlanId, setSelectedPlanId, errorMsg, successMsg,
  isSubmitting, onSubmit, onBack, selectedPlan
}: PlanSelectionProps) {

  const isPaidPlan = selectedPlan?.price > 0;

  const freePlan = {
    id: "free",
    title: "Free Plan",
    price: 0,
    currency: "$",
    billingInterval: "mo",
    description: "Get started with basic features.",
    trialDays: 30,
  };

  const allPlans = [freePlan, ...pricings];

  return (
    <div className="card rounded-[5px] p-8 space-y-5">
      {errorMsg && <ErrorMessage message={errorMsg} />}
      {successMsg && <SuccessMessage message={successMsg} />}

      <div>
        <label className="text-sm font-body font-medium block mb-3" style={{ color: "var(--text-secondary)" }}>
          Choose Your Plan
        </label>

        <div className="grid grid-cols-1 gap-3">
          {allPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isFree = plan.price === 0;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className="p-4 rounded-[5px] border-2 text-left transition-all"
                style={{
                  borderColor: isSelected ? (isFree ? "var(--emerald)" : "var(--gold)") : "var(--border)",
                  backgroundColor: isSelected ? (isFree ? "var(--emerald-light)" : "var(--gold-light)") : "transparent",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{plan.title}</div>
                    {plan.description && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{plan.description}</p>}
                  </div>
                  {isSelected && <Check className="h-5 w-5 mt-1" style={{ color: isFree ? "var(--emerald)" : "var(--gold)" }} />}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {plan.currency}{plan.price}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>/{plan.billingInterval}</span>
                </div>

                {isFree ? (
                  <p className="text-xs text-emerald-600 mt-2">✓ Free for 1 month • No credit card required</p>
                ) : plan.trialDays ? (
                  <p className="text-xs text-emerald-600 mt-2">✓ {plan.trialDays}-day free trial</p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onBack} className="flex-1 py-3 rounded-[5px] border font-medium" style={{ borderColor: "var(--border)" }}>
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !selectedPlanId}
          className="flex-1 py-3 rounded-[5px] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70"
          style={{ backgroundColor: "var(--emerald)" }}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPaidPlan ? (
            "Continue"
          ) : (
            "Start Free for 1 Month"
          )}
          {/* {isPaidPlan && !isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} */}
        </button>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-3 text-xs rounded-[5px] font-medium border" style={{
      backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)", color: "#f87171"
    }}>
      {message}
    </div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="p-3 text-xs rounded-[5px] font-medium border" style={{
      backgroundColor: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.2)", color: "#34d399"
    }}>
      {message}
    </div>
  );
}