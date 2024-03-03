import React from "react";
import Box from "@mui/material/Box";
import { Chord, Key, degreeLabel, functionColor, intervalLabel, majorScaleDistance, majorScaleFunction } from "definitions";
import { BoxContainer } from "./styled";

export type PaletteProps = Readonly<{
  scaleKey: Key;
  menu: Chord[];
  setMenu: (value: Chord[]) => void;
}>

export const Palette: React.FC<PaletteProps> = ({
  scaleKey,
  menu,
}) => {
  return (
    <Box sx={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eee" }}>
      <BoxContainer>
        {
          menu.map((menuItem, idx) => {
            const index = Key.indexOf(scaleKey);
            return (
              <Box key={idx} sx={{
                height: 80,
                width: 80,
                backgroundColor: functionColor[majorScaleFunction[menuItem.degree-1]],
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}>
                <div>
                  <b>
                    {degreeLabel[menuItem.degree-1]}{intervalLabel[menuItem.interval]}
                  </b>
                </div>
                <div>
                  {`(${Key[(index + majorScaleDistance[menuItem.degree-1]) % 12]}${intervalLabel[menuItem.interval]})`}
                </div>
              </Box>
            )
          })
        }
      </BoxContainer>
    </Box>
  )
}
