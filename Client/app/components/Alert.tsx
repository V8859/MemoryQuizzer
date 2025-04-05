"use client";
import React, { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { X } from "lucide-react";

type Props = {
  timing: number;
};

const Alert = (props: Props) => {
  const [opacity, setOpacity] = useState(0);
  const { showAlert, alertMessage, alertBool } = useData();

  useEffect(() => {
    if (alertBool) {
      setOpacity(100);
    }

    const interval = 60;
    const steps = props.timing / interval;
    const opacityChangePerstep = 30 / steps;
    const fadeEffect = setInterval(() => {
      setOpacity((prevOpacity) => {
        if (prevOpacity > 0) {
          return Math.max(prevOpacity - opacityChangePerstep, 0);
        } else {
          clearInterval(fadeEffect);
          return 0;
        }
      });
    }, interval);

    return () => clearInterval(fadeEffect);
  }, [props.timing, showAlert]);

  return (
    <div className="fixed top-2 md:right-4 right-[20%] rounded md:m-5 pr-4 md:w-[25%] w-[50%] z-40">
      <div
        className="rounded w-full"
        style={{
          opacity: opacity,
          backgroundColor: "var(--welcome-text)",
          transition: `opacity ${props.timing}ms ease-out`,
          color: "var(--textHoverColor)",
        }}
      >
        <div className="flex w-full">
          <div className="flex w-full">
            <div className="md:pr-10 text-xs md:text-base pl-[5px] py-[3px] w-full">
              {alertMessage}
            </div>
            <button
              className="py-[3px] px-[10px] bg-white/20 items-center flex justify-start hover:bg-black/20"
              onClick={() => {
                setOpacity(0);
              }}
            >
              <X></X>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
