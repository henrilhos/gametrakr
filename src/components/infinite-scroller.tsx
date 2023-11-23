import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  loadingMessage: React.ReactNode;
  endingMessage: React.ReactNode;
}

export const InfiniteScroller = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>(
  ({
    fetchNextPage,
    hasNextPage,
    endingMessage,
    loadingMessage,
    children,
    ...props
  }) => {
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
      <section {...props} style={{ overflowAnchor: "none" }}>
        <ul className="grid gap-4 md:grid-cols-4">{children}</ul>
        <div ref={observerTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
      </section>
    );
  },
);

InfiniteScroller.displayName = "InfiniteScroller";
