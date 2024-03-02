import React, { ChangeEvent, useCallback, useState } from "react"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button } from "@mui/material";

export type BeatType =  "fourQuarter" | "threeQuarter";

export type SongSetting = Readonly<{
  beatType: BeatType;
  bpm: number;
}>;

type SecondModalProps = Readonly<{
  open: boolean;
  onSelect: (value: SongSetting) => void;
}>;

export const SecondModal: React.FC<SecondModalProps> = ({
  open,
  onSelect,
}) => {
  const [beatType, setBeatType] = useState<BeatType>("fourQuarter");
  const [bpm, setBpm] = useState<number>(120);
  const changeBeatType = useCallback((event: SelectChangeEvent) => {
    setBeatType((event.target.value) as BeatType);
  }, [setBeatType]);
  const changeBpm = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
  }, [setBpm]);
  const onSubmit = useCallback(() => {
    onSelect({beatType, bpm});
  }, [beatType, bpm, onSelect]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>どんな曲を作る？</DialogTitle>
      <FormControl sx={{ margin: 2 }}>
        <InputLabel htmlFor="beat-type">拍子</InputLabel>
        <Select
          autoFocus
          value={beatType}
          onChange={changeBeatType}
          label="拍子"
          inputProps={{
            name: 'beat-type',
            id: 'beat-type',
          }}
        >
          <MenuItem value="fourQuarter">4/4拍子</MenuItem>
          <MenuItem value="threeQuarter">3/4拍子</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ margin: 2 }}>
        <InputLabel htmlFor="bpm">BPM</InputLabel>
        <OutlinedInput placeholder="BPM" type="number" value={bpm} onChange={changeBpm} />
      </FormControl>
      <Button
        sx={{ mx: 2, mb: 2 }}
        size="large"
        variant="contained"
        onClick={onSubmit}
      >
        作成
      </Button>
    </Dialog>
  )
}
