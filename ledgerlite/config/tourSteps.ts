import { Step } from "react-joyride";

export const dashboardTourSteps: Step[] = [
  {
    target: '[data-tour="welcome-banner"]',
    title: "Welcome to LedgerLite! 👋",
    content: "Let's take a quick 1-minute tour to help you get familiar with your financial dashboard and business tracker.",
    placement: "bottom",
    skipBeacon: true, // Auto-open without clicking pulsating dot
  },
  {
    target: '[data-tour="dashboard-metrics"]',
    title: "Real-time Metrics 📊",
    content: "View your total sales, expenses, and current profit margin instantly. These update automatically as operations change.",
    placement: "bottom",
  },
  {
    target: '[data-tour="quick-actions"]',
    title: "Quick Action Shortcuts ⚡",
    content: "Instantly create new sales entries, record custom expenses, or add products to your stock list from any view on the dashboard.",
    placement: "bottom",
  },
  {
    target: '[data-tour="sales-chart"]',
    title: "Revenue Tracking Trend 📈",
    content: "Track your sales progress over time. Hover over bars to inspect detailed transactions values on specific days.",
    placement: "top",
  },
  {
    target: '[data-tour="low-stock-alerts"]',
    title: "Low Stock Panel ⚠️",
    content: "Monitors inventory thresholds in real time. Items running low are flagged here, prompting you to restock immediately.",
    placement: "left",
  },
  {
    target: '[data-tour="recent-transactions"]',
    title: "Recent Transactions 📁",
    content: "Review history inputs. Clicking rows lets you inspect invoice specifics or modify logs.",
    placement: "top",
  },
  {
    target: '[data-tour="sidebar-nav"]',
    title: "Sidebar Menu ☰",
    content: "Navigate to specific feature sections, check settings dashboards, or customize profile preferences.",
    placement: "right",
  },
];
