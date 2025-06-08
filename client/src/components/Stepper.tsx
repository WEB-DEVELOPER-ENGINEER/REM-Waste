import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { CreditCard, Shield, Truck, Calendar, Recycle, MapPin } from "lucide-react";

interface Step {
  id: string;
  name: string;
  description?: string;
  status: "complete" | "current" | "upcoming";
  icon?: React.ComponentType<{ className?: string }>;
}

interface StepperProps {
  steps?: Step[];
  currentStepId?: string;
  onStepClick?: (stepId: string) => void;
}

const defaultSteps: Step[] = [
  { id: "Postcode", name: "Postcode", status: "current", icon: MapPin },
  { id: "Waste Type", name: "Waste Type", status: "upcoming", icon: Recycle },
  { id: "Select Skip", name: "Select Skip", status: "upcoming", icon:  Truck},
  { id: "Permit Check", name: "Permit Check", status: "upcoming", icon: Shield },
  { id: "Choose Date", name: "Choose Date", status: "upcoming", icon: Calendar },
  { id: "Payment", name: "Payment", status: "upcoming", icon: CreditCard },
];

/**
 * Stepper component for multi-step processes
 * Shows the current step and progress through the process
 */
const Stepper: React.FC<StepperProps> = ({
  steps = defaultSteps,
  currentStepId = "Postcode",
  onStepClick,
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && steps[stepIndex] && steps[stepIndex].status !== "upcoming") {
      onStepClick(steps[stepIndex].id);
    }
  };

  // Update step statuses based on current step
  const stepsWithStatus = steps.map((step, index) => {
    const currentStepIndex = steps.findIndex((s) => s.id === currentStepId);

    let status: "complete" | "current" | "upcoming" = "upcoming";
    if (index < currentStepIndex) {
      status = "complete";
    } else if (index === currentStepIndex) {
      status = "current";
    }

    return { ...step, status };
  });

  return (
    <nav aria-label="Progress" className="border-t border-b border-gray-200 bg-gray-50">
      <ol
        role="list"
        className="divide-y divide-gray-200 rounded-md md:flex md:divide-y-0 max-w-7xl mx-auto"
      >
        {stepsWithStatus.map((step, stepIdx) => {
          const isCompleted = step.status === "complete";
          const isCurrent = step.status === "current";
          const isUpcoming = step.status === "upcoming";

          const buttonClasses = `group flex w-full items-center px-6 py-4 text-sm font-medium ${
            isUpcoming ? "cursor-not-allowed" : "cursor-pointer"
          }`;

          const spanClasses = `ml-4 text-sm font-medium ${
            isCurrent ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-500"
          } ${!isUpcoming && "group-hover:text-gray-700"}`;

          const iconContainerClasses = `flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
            isCompleted
              ? "bg-blue-600 group-hover:bg-blue-800"
              : isCurrent
              ? "border-2 border-blue-600"
              : "border-2 border-gray-300 group-hover:border-gray-400"
          }`;

          const StepIcon = step.icon;

          return (
            <li key={step.id} className="relative md:flex md:flex-1">
              <button
                type="button"
                onClick={() => handleStepClick(stepIdx)}
                className={buttonClasses}
                disabled={isUpcoming}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={iconContainerClasses}>
                  {isCompleted ? (
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  ) : StepIcon ? (
                    <StepIcon
                      className={`h-6 w-6 ${
                        isCurrent ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                  ) : (
                    <span
                      className={
                        isCurrent ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                      }
                    >
                      {stepIdx + 1}
                    </span>
                  )}
                </span>
                <span className={spanClasses}>{step.name}</span>
              </button>

              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray-200"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
