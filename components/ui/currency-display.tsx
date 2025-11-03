"use client";

import { useEffect, useState } from "react";

interface CurrencyDisplayProps {
  amount: number;
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function CurrencyDisplay({
  amount,
  locale = "id-ID",
  currency = "IDR",
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
}: CurrencyDisplayProps) {
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  
  useEffect(() => {
    // Format the currency on the client side to ensure consistent locale
    setFormattedAmount(
      new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    );
  }, [amount, locale, minimumFractionDigits, maximumFractionDigits]);
  
  return (
    <>
      Rp{formattedAmount}
    </>
  );
}