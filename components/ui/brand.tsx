"use client"

import { FC } from "react"
import { SquidIconSVG } from "../icons/squidicon-svg"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <SquidIconSVG theme={theme === "dark" ? "dark" : "light"} scale={0.2} />
      </div>

      <div className="text-4xl font-bold tracking-wide">Squidy</div>
    </div>
  )
}
