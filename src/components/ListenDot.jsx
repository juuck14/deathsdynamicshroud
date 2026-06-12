export default function ListenDot({ on, onClick }) {
  return (
    <button
      className={"listen" + (on ? " on" : "")}
      data-hot={on ? "heard" : "mark heard"}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      title={on ? "Listened — click to unmark" : "Mark as listened"}
    >
      <span className="lk">{on ? "✦ IN COLLECTION" : "+ MARK HEARD"}</span>
    </button>
  );
}
