import { FaExclamationTriangle, FaTools } from "react-icons/fa";
import MiniStatCard from "../../../components/cards/MiniStatCard/MiniStatCard";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import HorizontalBarRow from "../../../components/charts/HorizontalBarRow/HorizontalBarRow";
import SplitBarRow from "../../../components/charts/SplitBarRow/SplitBarRow";
import {
  ATTENTION_COLORS,
  fmtCurrency,
  fmtCurrencyRounded,
  fmtNumber,
  fmtWeight,
  MOCK_DASHBOARD,
} from "./Dashboard.utils";
import "./dashboard.scss";

const Dashboard = () => {
  const data = MOCK_DASHBOARD;
  const { today, now, salesTrend, payments, repairs, goldSoldToday, topCategory, attention } = data;

  const maxTrend = Math.max(...salesTrend.map((d) => d.value));

  return (
    <div id="dashboard" className="page">
      <div className="sec-title">Today</div>
      <div className="stats4">
        <ReportStatCard
          label="Sales revenue"
          value={fmtCurrency(today.salesRevenue.amount)}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub={
            <>
              {today.salesRevenue.transactions} transactions ·{" "}
              <span style={{ color: "var(--admin-green)" }}>
                ▲ {today.salesRevenue.changePercentage}% vs yesterday
              </span>
            </>
          }
        />
        <ReportStatCard
          label="Repairs collected"
          value={fmtCurrency(today.repairsCollected.amount)}
          accentColor="var(--admin-amber)"
          sub={`${today.repairsCollected.payments} payments · ${today.repairsCollected.repairsTakenIn} repairs taken in today`}
        />
        <ReportStatCard
          label="Refunds paid out"
          value={`−${fmtCurrency(today.refundsPaidOut.amount)}`}
          valueColor="var(--admin-red)"
          accentColor="var(--admin-red)"
          sub={`${today.refundsPaidOut.returns} returns · ${today.refundsPaidOut.toStock} to stock, ${today.refundsPaidOut.toMelt} to melt`}
        />
        <ReportStatCard
          label="Used gold bought"
          value={fmtCurrency(today.usedGoldBought.amount)}
          accentColor="var(--admin-gold)"
          sub={`${fmtWeight(today.usedGoldBought.weight)} across ${today.usedGoldBought.purchases} purchases`}
        />
      </div>

      <div className="sec-title">Money & stock right now</div>
      <div className="stats4">
        <ReportStatCard
          label="Store cash box"
          value={fmtCurrency(now.storeCash.amount)}
          valueColor="var(--admin-blue)"
          accentColor="var(--admin-blue)"
          sub={
            <>
              <span style={{ color: "var(--admin-green)" }}>
                +{fmtCurrencyRounded(now.storeCash.cashIn)} in
              </span>{" "}
              ·{" "}
              <span style={{ color: "var(--admin-red)" }}>
                −{fmtCurrencyRounded(now.storeCash.cashOut)} out
              </span>{" "}
              today
            </>
          }
        />
        <ReportStatCard
          label="Transfers box"
          value={fmtCurrency(now.transfersBox.amount)}
          valueColor="var(--admin-blue)"
          accentColor="var(--admin-blue)"
          sub={`+${fmtCurrencyRounded(now.transfersBox.todayIn)} today · ${now.transfersBox.pending} transfer pending`}
        />
        <ReportStatCard
          label="Used gold on hand"
          value={fmtWeight(now.usedGoldOnHand.weight)}
          valueColor="var(--admin-gold)"
          accentColor="var(--admin-gold)"
          sub={`Avg ${now.usedGoldOnHand.avgKarat.toFixed(1)}K · ${fmtCurrencyRounded(now.usedGoldOnHand.investedValue)} invested value`}
        />
        <ReportStatCard
          label="Stock value"
          value={fmtCurrencyRounded(now.stockValue.amount)}
          sub={`${fmtNumber(now.stockValue.items)} items · ${fmtNumber(now.stockValue.weight)}g total`}
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
