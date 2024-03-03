import React from "react";
import Box from "@mui/material/Box";
import { Chord } from "definitions";
import { BoxContainer } from "./styled";

export type PaletteProps = Readonly<{
  menu: Chord[];
  setMenu: (value: Chord[]) => void;
}>

export const Palette: React.FC<PaletteProps> = () => {
  return (
    <Box sx={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eee" }}>
      <BoxContainer>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#477fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          I
        </Box>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#19e341",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          IIm
        </Box>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#477fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          IIIm
        </Box>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#19e341",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          IV
        </Box>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#ff475d",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          V
        </Box>
        <Box sx={{
          height: 80,
          width: 80,
          backgroundColor: "#477fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          VIm
        </Box>
      </BoxContainer>
    </Box>
  )
}
