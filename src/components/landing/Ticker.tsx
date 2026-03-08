const TICKER_ITEMS = [
  'REMOTE WORK GEAR',
  'CREATOR SETUPS',
  'GAMING PERIPHERALS',
  'STUDENT ESSENTIALS',
  'DELIVERED TO GHANA',
  'PREMIUM IMPORTS',
];

const TICKER_ITEMS_2 = [
  'SONY WH-1000XM5',
  'RING LIGHT PRO',
  'MECHANICAL KEYBOARDS',
  'LAPTOP STANDS',
  'WEBCAM 4K',
  'MONITOR ARMS',
  'USB-C HUBS',
  'GAMING MICE',
];

function TickerRow() {
  return (
    <>
      {TICKER_ITEMS.map((item) => (
        <span className="ticker-item" key={item}>
          {item} <span className="ticker-sep">{'\u2726'}</span>
        </span>
      ))}
    </>
  );
}

function TickerRow2() {
  return (
    <>
      {TICKER_ITEMS_2.map((item) => (
        <span className="ticker-item" key={item}>
          {item} <span className="ticker-sep">{'\u2726'}</span>
        </span>
      ))}
    </>
  );
}

export function Ticker() {
  return (
    <div aria-hidden="true">
      <div className="ticker">
        <div className="ticker-inner">
          <TickerRow />
          <TickerRow />
        </div>
      </div>
      <div className="ticker ticker-reverse">
        <div className="ticker-inner">
          <TickerRow2 />
          <TickerRow2 />
        </div>
      </div>
    </div>
  );
}
