import { useEffect, useState } from "react";
import "./App.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaPause, FaPlay } from "react-icons/fa";

function App() {
  const minRemaing = 25;
  const secRemaing = minRemaing * 60;

  const [startTime, setStartTime] = useState<Date | undefined>(new Date());
  const [remaingTime, setRemaingTime] = useState<number>(0);
  const [second, setSecond] = useState<number>(secRemaing % 60);
  const [minutes, setMinutes] = useState<number>(minRemaing);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [, setShowBar] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    console.log(darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    const selectedTheme = darkMode ? "dark" : "light";

    document.body.classList.remove("dark");
    document.body.classList.remove("light");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (isStart) {
      if (startTime == undefined) {
        return;
      }

      const countdown = setTimeout(() => {
        const currentTime = new Date().getTime();
        const timeout = currentTime - startTime.getTime();

        const sec = Math.floor(timeout / 1000);
        const min = Math.floor((timeout - 1000) / 1000 / 60) + 1;

        if (timeout / 1000 >= secRemaing) {
          setIsStart(false);
          clearInterval(countdown);
          setStartTime(undefined);
          setSecond(0);
          setMinutes(0);
          playSound();
        } else {
          setSecond((secRemaing - sec) % 60);
          setMinutes(minRemaing - min);
        }
        setRemaingTime(timeout);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isStart, remaingTime]);

  const start = () => {
    setStartTime(new Date());
    setSecond(secRemaing % 60);
    setMinutes(minRemaing);
    setIsStart(true);
  };

  const playSound = () => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.play();
  };

  const progress = (pec: number) => {
    const sec = Math.floor(remaingTime / 1000);
    const currentTime = secRemaing - sec;
    if (sec == secRemaing) {
      return { background: "none" };
    }

    if (pec <= currentTime / secRemaing) {
      return { background: "#dc2626" };
    } else if (pec - 0.2 <= currentTime / secRemaing) {
      const step = currentTime - secRemaing * (pec - 0.2);
      const stepSize = secRemaing * pec - secRemaing * (pec - 0.2);
      return {
        background: "#dc2626",
        opacity: `${Math.floor((step / stepSize) * 100)}%`,
      };
    }
  };

  return (
    <>
      <section className="w-screen h-screen relative flex items-center justify-center bg-red-500 dark:bg-gray-950 transition-colors duration-500">
        <div className="">
          <div className="p-2 rounded-lg flex items-center justify-center gap-5">
            <div
              className="flex flex-col justify-center items-center"
              onMouseLeave={() => setShowBar(false)}
              onClick={() => (!isStart ? start() : setIsStart(false))}
            >
              <span
                className="text-[80pt] font-medium text-white transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setShowBar(true)}
                onClick={() => {}}
              >
                {("0" + minutes).slice(-2)}:{("0" + second).slice(-2)}
              </span>
              <div
                className={`flex items-center justify-center transition-all duration-200`}
                onClick={() => {}}
              >
                <div className="flex gap-2 items-center">
                  <div
                    className={`rounded-full w-4 h-4 transition-opacity duration-200`}
                    style={progress(0.2)}
                  ></div>
                  <div
                    className={`rounded-full w-4 h-4 transition-opacity duration-200`}
                    style={progress(0.4)}
                  ></div>
                  <div
                    className={`rounded-full w-4 h-4 transition-opacity duration-200`}
                    style={progress(0.6)}
                  ></div>
                  <div
                    className={`rounded-full w-4 h-4 transition-opacity duration-200`}
                    style={progress(0.8)}
                  ></div>
                  <div
                    className={`rounded-full w-4 h-4 transition-opacity duration-200`}
                    style={progress(1)}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className=" text-xl">
                {!isStart && (
                  <button
                    className="p-2 text-white rounded-lg bg-red-400 hover:bg-red-200/70 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
                    onClick={() => start()}
                  >
                    <FaPlay />
                  </button>
                )}
                {isStart && (
                  <button
                    className="p-2 text-white rounded-lg bg-red-400 hover:bg-red-200/70 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
                    onClick={() => setIsStart(false)}
                  >
                    <FaPause />
                  </button>
                )}
              </div>
              <button
                className="p-2 text-white rounded-lg bg-red-400 hover:bg-red-200/70 dark:bg-red-900 dark:text-white dark:hover:bg-red-800 text-xl  "
                onClick={() => {
                  setDarkMode(!darkMode);
                }}
              >
                {darkMode ? (
                  <MdLightMode className="text-white" />
                ) : (
                  <MdDarkMode />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

