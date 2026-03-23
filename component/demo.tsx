"use client";

import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { Sparkles } from "lucide-react";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[200px] pt-[100px] md:pt-[200px]">
      <ContainerScroll
        titleComponent={
          <h1 className="text-4xl font-semibold text-black dark:text-white flex flex-col items-center justify-center gap-4">
            <Sparkles className="w-12 h-12 text-yellow-500 mb-4" />
            Unleash the power of <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              Scroll Animations
            </span>
          </h1>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
