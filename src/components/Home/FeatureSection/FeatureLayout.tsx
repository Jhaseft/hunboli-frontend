export function FeatureLayout({ children, reverse = false }) {
  const [first, second] = children;

  return (
    <div className="grid md:grid-cols-2  lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center mb-20 sm:mb-24 md:mb-32">
      <div className={reverse ? "order-1 lg:order-2 sm:order-2" : "order-1"}>
        {first}
      </div>

      <div className={reverse ? "order-2 lg:order-1 sm:order-1" : "order-2"}>
        {second}
      </div>
    </div>
  );
}
