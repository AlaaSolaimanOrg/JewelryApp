import { KaratType } from "../../../types/enums";

export const ALL_TIME_KEY = "ALL_TIME";

export const dummyInventoryReports = {
  ALL_TIME: {
    added: [
      { karat: KaratType.Karat18, itemCount: 23, totalWeight: 156.3 },
      { karat: KaratType.Karat21, itemCount: 14, totalWeight: 98.0 },
      { karat: KaratType.Karat22, itemCount: 6, totalWeight: 44.1 },
      { karat: KaratType.Karat24, itemCount: 2, totalWeight: 15.2 },
    ],
    returned: [
      { karat: KaratType.Karat18, itemCount: 8, totalWeight: 44.1 },
      { karat: KaratType.Karat21, itemCount: 3, totalWeight: 18.6 },
    ],
  },

  "2025-01-01_2025-01-31": {
    added: [
      { karat: KaratType.Karat18, itemCount: 14, totalWeight: 92.5 },
      { karat: KaratType.Karat21, itemCount: 8, totalWeight: 56.3 },
      { karat: KaratType.Karat22, itemCount: 3, totalWeight: 21.9 },
    ],
    returned: [
      { karat: KaratType.Karat18, itemCount: 5, totalWeight: 28.1 },
      { karat: KaratType.Karat21, itemCount: 2, totalWeight: 11.4 },
    ],
  },

  "2025-02-01_2025-02-28": {
    added: [
      { karat: KaratType.Karat18, itemCount: 9, totalWeight: 63.8 },
      { karat: KaratType.Karat21, itemCount: 6, totalWeight: 41.7 },
      { karat: KaratType.Karat24, itemCount: 2, totalWeight: 15.2 },
    ],
    returned: [
      { karat: KaratType.Karat18, itemCount: 3, totalWeight: 16.0 },
    ],
  },
};
