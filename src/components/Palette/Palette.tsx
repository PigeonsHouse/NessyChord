import React from "react";
import Box from "@mui/material/Box";
import { Chord, Interval, Key, degreeLabel, functionColor, intervalLabel, majorScaleDistance, majorScaleFunction } from "definitions";
import { BoxContainer, PopoverContainer } from "./styled";
import { Popover } from "@mui/material";

export type PaletteProps = Readonly<{
  scaleKey: Key;
  menu: Chord[];
  setMenu: (value: Chord[]) => void;
}>

export const Palette: React.FC<PaletteProps> = ({
  scaleKey,
  menu,
  setMenu,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [selectingDegreeNum, setSelectingDegreeNum] = React.useState<number>(-1);

  return (
    <Box sx={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eee" }}>
      <BoxContainer>
        {
          menu.map((menuItem, idx) => {
            const index = Key.indexOf(scaleKey);
            return (
              <Box
                key={idx} sx={{
                  height: 80,
                  width: 80,
                  backgroundColor: functionColor[majorScaleFunction[menuItem.degree-1]],
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setSelectingDegreeNum(idx);
                }}
              >
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
      <Popover
        open={selectingDegreeNum !== -1} anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setSelectingDegreeNum(-1);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <PopoverContainer>
          {Interval.map((interval, idx) => {
            const index = Key.indexOf(scaleKey);
            return (
              <Box
                key={idx} sx={{
                  height: 80,
                  width: 80,
                  backgroundColor: functionColor[majorScaleFunction[selectingDegreeNum]],
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
                onClick={() => {
                  const copyMenu = [...menu];
                  copyMenu[selectingDegreeNum] = Object.assign({
                    degree: menu[selectingDegreeNum].degree,
                    interval: interval,
                  }, {});
                  setMenu(copyMenu);
                  setAnchorEl(null);
                  setSelectingDegreeNum(-1);
                }}
              >
                <div>
                  <b>
                    {degreeLabel[selectingDegreeNum]}{intervalLabel[interval]}
                  </b>
                </div>
                <div>
                  {`(${Key[(index + majorScaleDistance[selectingDegreeNum]) % 12]}${intervalLabel[interval]})`}
                </div>
              </Box>
            )
          })}
        </PopoverContainer>
      </Popover>
    </Box>
  )
}
