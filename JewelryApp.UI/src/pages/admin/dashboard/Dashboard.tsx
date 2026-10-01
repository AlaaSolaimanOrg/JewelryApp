import { FaExclamationTriangle, FaTools } from "react-icons/fa";
import MiniStatCard from "../../../components/cards/MiniStatCard/MiniStatCard";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import HorizontalBarRow from "../../../components/charts/HorizontalBarRow/HorizontalBarRow";
import SplitBarRow from "../../../components/charts/SplitBarRow/SplitBarRow";
import {
  getAdminAttentionItems,
  getAdminCashGoldSnapshot,
  getAdminInventorySnapshot,
  getAdminRepairsStats,
  getAdminSalesSummary,
} from "../../../apis/dashboard.api";
import useLocalApi from "../../../hooks/useLocalApi";
import type {
  AttentionItem,
  CashGoldSnapshot,
  InventorySnapshot,
  RepairsStats,
  SalesSummary,
} from "./Dashboard.type";
import {
  ATTENTION_COLORS,
  EMPTY_CASH_GOLD_SNAPSHOT,
  EMPTY_INVENTORY_SNAPSHOT,
  EMPTY_REPAIRS_STATS,
  EMPTY_SALES_SUMMARY,
  fmtCurrency,
  fmtCurrencyRounded,
  fmtNumber,
  fmtWeight,
} from "./Dashboard.utils";
import "./dashboard.scss";

const Dashboard = () => {
  const { data: sales } = useLocalApi({
    apiToCall: () => getAdminSalesSummary(),
    dataInitalValue: EMPTY_SALES_SUMMARY,
  }) as { data: SalesSummary };

  const { data: cashGold } = useLocalApi({
    apiToCall: () => getAdminCashGoldSnapshot(),
    dataInitalValue: EMPTY_CASH_GOLD_SNAPSHOT,
  }) as { data: CashGoldSnapshot };

  const { data: repairsStats } = useLocalApi({
    apiToCall: () => getAdminRepairsStats(),
    dataInitalValue: EMPTY_REPAIRS_STATS,
  }) as { data: RepairsStats };

  const { data: inventory } = useLocalApi({
    apiToCall: () => getAdminInventorySnapshot(),
    dataInitalValue: EMPTY_INVENTORY_SNAPSHOT,
  }) as { data: InventorySnapshot };

  const { data: attention } = useLocalApi({
    apiToCall: () => getAdminAttentionItems(),
    dataInitalValue: [],
  }) as { data: AttentionItem[] };

  const { salesRevenue, salesTrend, payments, goldSoldToday, topCategory } = sales;
  const { storeCash, transfersBox, usedGoldOnHand, usedGoldBought } = cashGold;
  const { repairsCollected, repairs } = repairsStats;
  const { stockValue, refundsPaidOut } = inventory;

  const maxTrend = Math.max(1, ...salesTrend.map((d) => d.value));

  return (
    <div id="dashboard" className="page">
      <div className="sec-title">Today</div>
      <div className="stats4">
        <ReportStatCard
          label="Sales revenue"
          value={fmtCurrency(salesRevenue.amount)}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub={
            <>
              {salesRevenue.transactions} transactions ·{" "}
              <span style={{ color: "var(--admin-green)" }}>
                {salesRevenue.isIncrease ? "▲" : "▼"} {Math.abs(salesRevenue.changePercentage)}% vs yesterday
              </span>
            </>
          }
        />
        <ReportStatCard
          label="Repairs collected"
          value={fmtCurrency(repairsCollected.amount)}
          accentColor="var(--admin-amber)"
          sub={`${repairsCollected.payments} payments · ${repairsCollected.repairsTakenIn} repairs taken in today`}
        />
        <ReportStatCard
          label="Refunds paid out"
          value={`−${fmtCurrency(refundsPaidOut.amount)}`}
          valueColor="var(--admin-red)"
          accentColor="var(--admin-red)"
          sub={`${refundsPaidOut.returns} returns · ${refundsPaidOut.toStock} to stock, ${refundsPaidOut.toMelt} to melt`}
        />
        <ReportStatCard
          label="Used gold bought"
          value={fmtCurrency(usedGoldBought.amount)}
          accentColor="var(--admin-gold)"
          sub={`${fmtWeight(usedGoldBought.weight)} across ${usedGoldBought.purchases} purchases`}
        />
      </div>

      <div className="sec-title">Money & stock right now</div>
      <div className="stats4">
        <ReportStatCard
          label="Store cash box"
          value={fmtCurrency(storeCash.amount)}
          valueColor="var(--admin-blue)"
          accentColor="var(--admin-blue)"
          sub={
            <>
              <span style={{ color: "var(--admin-green)" }}>
                +{fmtCurrencyRounded(storeCash.cashIn)} in
              </span>{" "}
              ·{" "}
              <span style={{ color: "var(--admin-red)" }}>
                −{fmtCurrencyRounded(storeCash.cashOut)} out
              </span>{" "}
              today
            </>
          }
        />
        <ReportStatCard
          label="Transfers box"
          value={fmtCurrency(transfersBox.amount)}
          valueColor="var(--admin-blue)"
          accentColor="var(--admin-blue)"
          sub={`+${fmtCurrencyRounded(transfersBox.todayIn)} today`}
        />
        <ReportStatCard
          label="Used gold on hand"
          value={fmtWeight(usedGoldOnHand.weight)}
          valueColor="var(--admin-gold)"
          accentColor="var(--admin-gold)"
          sub={`Avg ${usedGoldOnHand.avgKarat.toFixed(1)}K · ${fmtCurrencyRounded(usedGoldOnHand.investedValue)} invested value`}
        />
        <ReportStatCard
          label="Stock value"
          value={fmtCurrencyRounded(stockValue.amount)}
          sub={`${fmtNumber(stockValue.items)} items · ${fmtNumber(stockValue.weight)}g total`}
        />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Sales — last 14 days</span>
            <span className="panel-sub">today highlighted</span>
          </div>
          <div className="chart">
            {salesTrend.map((point, i) => {
              const isToday = i === salesTrend.length - 1;
              const showVal = isToday || i % 3 === 0;
              const height = Math.max(3, Math.round((point.value / maxTrend) * 108));
              return (
                <div className="chart-group" key={point.label + i}>
                  <div className="chart-val" style={{ visibility: showVal ? "visible" : "hidden" }}>
                    ${Math.round(point.value / 1000)}k
                  </div>
                  <div className={`chart-bar${isToday ? " today" : ""}`} style={{ height }} />
                  <div className="chart-lbl">{i % 3 === 0 || isToday ? point.label : ""}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Today's payments</span>
            <span className="panel-sub">{fmtCurrencyRounded(payments.total)} collected</span>
          </div>
          <div className="pay-split">
            <SplitBarRow
              label="Cash"
              percentage={payments.cash.percentage}
              amountLabel={fmtCurrencyRounded(payments.cash.amount)}
              color="var(--admin-green)"
            />
            <SplitBarRow
              label="Card"
              percentage={payments.card.percentage}
              amountLabel={fmtCurrencyRounded(payments.card.amount)}
              color="var(--admin-purple)"
            />
          </div>
          <div className="mini-divider">
            <div className="mini-grid">
              <MiniStatCard label="Items sold" value={`${payments.itemsSold}`} sub={`${fmtWeight(payments.itemsSoldWeight)} total`} />
              <MiniStatCard
                label="Discounts given"
                value={fmtCurrencyRounded(payments.discounts)}
                valueColor="var(--admin-red)"
                sub={`on ${payments.discountedSalesCount} sales`}
              />
              <MiniStatCard label="Avg sale" value={fmtCurrencyRounded(payments.avgSale)} sub="per transaction" />
              <MiniStatCard
                label="Customers"
                value={fmtNumber(payments.customers)}
                sub={`+${payments.customersAddedToday} added today`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid3">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">
              <FaTools className="icon" /> Repairs
            </span>
            <span className="panel-sub">live</span>
          </div>
          <div className="mini-grid">
            <MiniStatCard label="In progress" value={`${repairs.inProgress}`} valueColor="var(--admin-amber)" />
            <MiniStatCard label="Awaiting call" value={`${repairs.awaitingCall}`} valueColor="var(--admin-amber)" />
            <MiniStatCard label="Due today" value={`${repairs.dueToday}`} />
            <MiniStatCard label="Overdue" value={`${repairs.overdue}`} valueColor="var(--admin-red)" />
          </div>
          <div className="panel-footnote">
            Unpaid balance: <b style={{ color: "var(--admin-red)" }}>{fmtCurrencyRounded(repairs.unpaidBalance)}</b> across{" "}
            {repairs.unpaidCount} repairs
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Gold sold today</span>
            <span className="panel-sub">by karat</span>
          </div>
          {goldSoldToday.map((g) => (
            <HorizontalBarRow
              key={g.karat}
              label={`${g.karat}K`}
              percent={g.percentage}
              color="var(--admin-gold)"
              amountLabel={fmtWeight(g.weight)}
            />
          ))}
          <div className="panel-footnote">
            Top category today: <b style={{ color: "var(--admin-t2)" }}>{topCategory.name}</b> — {topCategory.itemsSold} items
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">
              <FaExclamationTriangle className="icon" /> Needs attention
            </span>
          </div>
          {attention.length === 0 && <div className="panel-footnote">Nothing needs attention right now.</div>}
          {attention.map((a, i) => {
            const colors = ATTENTION_COLORS[a.color];
            return (
              <div className="att-item" key={i}>
                <span className="att-dot" style={{ background: colors.dot }} />
                <span className="att-text">{a.text}</span>
                <span className="att-tag" style={{ background: colors.bg, color: colors.dot }}>
                  {a.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
