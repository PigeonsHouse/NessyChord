import { Chord } from "definitions"
import React from "react";

export type SelectorPaletteProps = Readonly<{
  menu: Chord[];
}>

export const SelectorPalette: React.FC<SelectorPaletteProps> = ({
  menu,
}) => {
  return (
    <>
      {menu}
    </>
  )
}
