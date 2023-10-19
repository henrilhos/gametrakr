import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const ThemeSwitch = () => {
  const { theme, systemTheme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const isChecked = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark";
  };

  return (
    <Switch
      checked={isChecked()}
      onChange={handleThemeChange}
      className={classNames(
        "bg-neutral-100 dark:bg-slate-900",
        "relative inline-flex h-10 w-[72px] flex-shrink-0 cursor-pointer rounded-xl p-1 transition-colors duration-200 ease-in-out",
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={classNames(
          isChecked()
            ? "translate-x-8 bg-yellow-400 text-black"
            : "translate-x-0 bg-yellow-500 text-white",
          "pointer-events-none relative inline-block h-8 w-8 transform rounded-xl ring-0 transition duration-200 ease-in-out",
        )}
      >
        <span
          className={classNames(
            isChecked()
              ? "opacity-0 duration-100 ease-out"
              : "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faSun} />
        </span>
        <span
          className={classNames(
            isChecked()
              ? "opacity-100 duration-200 ease-in"
              : "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
          )}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faMoon} />
        </span>
      </span>
    </Switch>
  );
};
