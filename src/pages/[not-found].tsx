import { Heading } from "~/components/heading";
import { PageLayout } from "~/components/layout";
import { Button } from "../components/ui/button";

// TODO: validate mobile
const NotFoundPage = () => {
  return (
    <PageLayout className="flex items-center justify-center">
      <div className="m-8 flex gap-8">
        <div className="mt-4 hidden md:block">
          <svg
            width="56"
            height="46"
            viewBox="0 0 56 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.998 0C29.5512 0 30.9841 0.764994 31.7717 2.01958L55.3984 39.5553C56.1969 40.8201 56.1969 42.3807 55.4202 43.6455C54.6436 44.9103 53.1888 45.6956 51.6247 45.6956H4.37128C2.8071 45.6956 1.35231 44.9103 0.575692 43.6455C-0.200926 42.3807 -0.189988 40.8099 0.597568 39.5553L24.2243 2.01958C25.0118 0.764994 26.4447 0 27.998 0ZM27.998 13.0559C26.5432 13.0559 25.3728 14.1473 25.3728 15.5039V26.9278C25.3728 28.2844 26.5432 29.3758 27.998 29.3758C29.4528 29.3758 30.6232 28.2844 30.6232 26.9278V15.5039C30.6232 14.1473 29.4528 13.0559 27.998 13.0559ZM31.4982 35.9037C31.4982 35.0381 31.1294 34.2079 30.473 33.5957C29.8166 32.9836 28.9263 32.6397 27.998 32.6397C27.0696 32.6397 26.1793 32.9836 25.5229 33.5957C24.8665 34.2079 24.4977 35.0381 24.4977 35.9037C24.4977 36.7694 24.8665 37.5996 25.5229 38.2117C26.1793 38.8238 27.0696 39.1677 27.998 39.1677C28.9263 39.1677 29.8166 38.8238 30.473 38.2117C31.1294 37.5996 31.4982 36.7694 31.4982 35.9037Z"
              className="fill-yellow-200 dark:fill-yellow-800"
            />
            <path
              d="M27.9978 13C26.543 13 25.3726 14.0914 25.3726 15.448V26.8719C25.3726 28.2285 26.543 29.3199 27.9978 29.3199C29.4526 29.3199 30.623 28.2285 30.623 26.8719V15.448C30.623 14.0914 29.4526 13 27.9978 13ZM31.4981 35.8478C31.4981 34.9822 31.1293 34.152 30.4729 33.5398C29.8164 32.9277 28.9261 32.5838 27.9978 32.5838C27.0695 32.5838 26.1792 32.9277 25.5228 33.5398C24.8663 34.152 24.4976 34.9822 24.4976 35.8478C24.4976 36.7135 24.8663 37.5437 25.5228 38.1558C26.1792 38.7679 27.0695 39.1118 27.9978 39.1118C28.9261 39.1118 29.8164 38.7679 30.4729 38.1558C31.1293 37.5437 31.4981 36.7135 31.4981 35.8478Z"
              className="fill-yellow-600 dark:fill-yellow-400"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-2">
            <Heading size="xl">404</Heading>
            <div className="font-serif text-3xl/tight">
              You hit an invisible wall...
            </div>
          </div>

          <div className="flex flex-col gap-8 ">
            <div className="text-xl/tight text-neutral-800 dark:text-neutral-400">
              Sorry, the page you were looking for doesn’t exist or has been
              removed.
              <br />
              Click the button below to go back to the homepage.
            </div>
            <Button
              as="a"
              variant="secondary"
              href="/"
              className="md:max-w-fit"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="flex h-full items-center justify-center">
        <div>
          <div className="flex items-end gap-8">
            <div className="hidden pb-1 md:block">
              <svg
                width="56"
                height="46"
                viewBox="0 0 56 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.998 0C29.5512 0 30.9841 0.764994 31.7717 2.01958L55.3984 39.5553C56.1969 40.8201 56.1969 42.3807 55.4202 43.6455C54.6436 44.9103 53.1888 45.6956 51.6247 45.6956H4.37128C2.8071 45.6956 1.35231 44.9103 0.575692 43.6455C-0.200926 42.3807 -0.189988 40.8099 0.597568 39.5553L24.2243 2.01958C25.0118 0.764994 26.4447 0 27.998 0ZM27.998 13.0559C26.5432 13.0559 25.3728 14.1473 25.3728 15.5039V26.9278C25.3728 28.2844 26.5432 29.3758 27.998 29.3758C29.4528 29.3758 30.6232 28.2844 30.6232 26.9278V15.5039C30.6232 14.1473 29.4528 13.0559 27.998 13.0559ZM31.4982 35.9037C31.4982 35.0381 31.1294 34.2079 30.473 33.5957C29.8166 32.9836 28.9263 32.6397 27.998 32.6397C27.0696 32.6397 26.1793 32.9836 25.5229 33.5957C24.8665 34.2079 24.4977 35.0381 24.4977 35.9037C24.4977 36.7694 24.8665 37.5996 25.5229 38.2117C26.1793 38.8238 27.0696 39.1677 27.998 39.1677C28.9263 39.1677 29.8166 38.8238 30.473 38.2117C31.1294 37.5996 31.4982 36.7694 31.4982 35.9037Z"
                  className="fill-yellow-200 dark:fill-yellow-800"
                />
                <path
                  d="M27.9978 13C26.543 13 25.3726 14.0914 25.3726 15.448V26.8719C25.3726 28.2285 26.543 29.3199 27.9978 29.3199C29.4526 29.3199 30.623 28.2285 30.623 26.8719V15.448C30.623 14.0914 29.4526 13 27.9978 13ZM31.4981 35.8478C31.4981 34.9822 31.1293 34.152 30.4729 33.5398C29.8164 32.9277 28.9261 32.5838 27.9978 32.5838C27.0695 32.5838 26.1792 32.9277 25.5228 33.5398C24.8663 34.152 24.4976 34.9822 24.4976 35.8478C24.4976 36.7135 24.8663 37.5437 25.5228 38.1558C26.1792 38.7679 27.0695 39.1118 27.9978 39.1118C28.9261 39.1118 29.8164 38.7679 30.4729 38.1558C31.1293 37.5437 31.4981 36.7135 31.4981 35.8478Z"
                  className="fill-yellow-600 dark:fill-yellow-400"
                />
              </svg>
            </div>
            <Heading size="xl">404</Heading>
          </div>
          <div className="pl-[88px]">
            <div className="font-serif text-3xl/tight">
              You hit an invisible wall
            </div>
            <div className="pt-14 text-xl/tight text-neutral-800 dark:text-neutral-400">
              Sorry, the page you were looking for doesn’t exist or has been
              removed.
              <br />
              Click the button below to go back to the homepage.
            </div>
            <div className="pt-8">
              <Button as="a" variant="secondary" href="/">
                Home
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </PageLayout>
  );
};
export default NotFoundPage;
