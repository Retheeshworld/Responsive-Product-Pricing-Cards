"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const billingButtons = Array.from(document.querySelectorAll(".billing-option"));
  const prices = Array.from(document.querySelectorAll(".price"));
  const billingLabels = Array.from(document.querySelectorAll(".billing-label"));
  const planButtons = Array.from(document.querySelectorAll(".plan-button"));
  const selectionStatus = document.querySelector(".selection-status");
  const supportedPeriods = new Set(["monthly", "yearly"]);
  let selectedPeriod = "monthly";

  const priceFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  function updatePrices(period) {
    const priceAttribute = period === "monthly" ? "monthly" : "yearly";
    const label = period === "monthly" ? "per month" : "per year";

    prices.forEach((price) => {
      const value = Number(price.dataset[priceAttribute]);
      if (!Number.isFinite(value)) {
        throw new Error(`Missing valid ${priceAttribute} price for a plan.`);
      }

      price.textContent = priceFormatter.format(value);
      price.setAttribute("aria-label", `${priceFormatter.format(value)} rupees ${label}`);
    });

    billingLabels.forEach((billingLabel) => {
      billingLabel.textContent = label;
    });
  }

  function updateToggleState(period) {
    billingButtons.forEach((button) => {
      const isActive = button.dataset.period === period;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setBillingPeriod(period) {
    if (!supportedPeriods.has(period)) {
      throw new RangeError(`Unsupported billing period: ${period}`);
    }

    updatePrices(period);
    updateToggleState(period);
    selectedPeriod = period;
  }

  function handlePlanSelection(planName) {
    const periodLabel = selectedPeriod === "monthly" ? "Monthly" : "Yearly";
    selectionStatus.textContent = `You selected ${planName} — ${periodLabel} billing.`;
  }

  billingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setBillingPeriod(button.dataset.period);
    });
  });

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const planCard = button.closest("[data-plan]");
      if (planCard) {
        handlePlanSelection(planCard.dataset.plan);
      }
    });
  });

  const yearElement = document.querySelector("#copyright-year");
  yearElement.textContent = String(new Date().getFullYear());
  setBillingPeriod("monthly");
});
