import { calculatePercentageChange } from "@/lib/utils/math";
import { safeToNumber } from "@/lib/utils/number";

export { safeToNumber, calculatePercentageChange };

/**
 * Alias for backward compatibility - dashboard uses "toNumber" naming
 */
export const toNumber = safeToNumber;
