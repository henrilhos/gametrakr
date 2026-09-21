import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  loadingMessage: React.ReactNode;
  endingMessage: React.ReactNode;
}

export function InfiniteScroller({
  ref,
  fetchNextPage,
  hasNextPage,
  endingMessage,
  loadingMessage,
  children,
  ...props
}: InfiniteScrollProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { threshold: 1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} {...props} style={{ overflowAnchor: "none" }}>
      <ul className="grid gap-4">{children}</ul>
      <div ref={observerTarget} />
      {hasNextPage ? loadingMessage : endingMessage}
    </section>
  );
}
