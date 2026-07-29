export default function FlowChromeIsolation() {
  return (
    <>
      <span className="care-plan-flow hidden" aria-hidden="true" />
      <style>{`
        body:has(.care-plan-flow) > footer {
          display: none;
        }

        body:has(.care-plan-flow) aside > div:last-child {
          display: none;
        }
      `}</style>
    </>
  );
}
