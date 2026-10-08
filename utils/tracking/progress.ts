export type StepKey = "created" | "transit" | "delivery" | "completed";

export interface ProgressStep {
  key: StepKey;
  label: string;
  completed: boolean;
}

export const getProgressSteps = (
  history: any[],
  courier: string
): ProgressStep[] => {
  const steps: ProgressStep[] = [
    { key: "created", label: "Pesanan Dibuat", completed: false },
    { key: "transit", label: "Dalam Pengiriman", completed: false },
    { key: "delivery", label: "Diantar oleh Kurir", completed: false },
    { key: "completed", label: "Sampai", completed: false },
  ];

  if (courier === "Lion Parcel") {
    const flags = {
      completed: history.some((h) => h.statusCode === "POD"),
      delivery: history.some((h) => ["DEL", "HND"].includes(h.statusCode)),
      transit: history.some((h) =>
        ["STI", "TRANSIT", "INHUB", "OUTHUB"].includes(h.statusCode)
      ),
      created: history.length > 0,
    };

    steps[0].completed = flags.created;
    steps[1].completed = flags.transit;
    steps[2].completed = flags.delivery;
    steps[3].completed = flags.completed;
  }

  if (courier === "SiCepat") {
    const flags = {
      completed: history.some((h) => h.statusCode === "DELIVERED"),
      delivery: history.some((h) => h.statusCode === "ANT"),
      transit: history.some((h) => ["OUT", "IN"].includes(h.statusCode)),
      created: history.some((h) => ["PICKREQ", "IN"].includes(h.statusCode)),
    };

    steps[0].completed = flags.created;
    steps[1].completed = flags.transit;
    steps[2].completed = flags.delivery;
    steps[3].completed = flags.completed;
  }

  return steps;
};

/** Index tahap terjauh yang sudah tercapai, -1 jika belum ada. */
export const getCurrentStepIndex = (steps: ProgressStep[]) =>
  steps.reduce((last, step, i) => (step.completed ? i : last), -1);
