export function LoadingSkeleton() {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-box" />
        </div>
      ))}
    </div>
  )
}
