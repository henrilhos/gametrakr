import Link from "next/link";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  href?: string;
  children: string;
};

export default function Heading({ href, children }: Props) {
  return (
    <div className="flex items-center">
      <h2 className="grow font-apfel-grotezk text-2xl/none font-bold dark:text-neutral-100">
        {children}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm/none font-bold uppercase text-neutral-600 hover:underline dark:text-neutral-700"
        >
          Show more
          <FontAwesomeIcon icon={faCaretRight} className="ml-1" />
        </Link>
      )}
    </div>
  );
}
