import React, { useCallback, useState } from "react"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button } from "@mui/material";

export type BeatType =  "4/4" | "3/4";

type SecondModalProps = Readonly<{
  open: boolean;
  onSelect: (value: BeatType) => void;
}>;

export const SecondModal: React.FC<SecondModalProps> = ({
  open,
  onSelect,
}) => {
  const [beatType, setBeatType] = useState<BeatType>("4/4");
  const changeBeatType = useCallback((event: SelectChangeEvent) => {
    setBeatType((event.target.value) as BeatType);
  }, [setBeatType]);
  const onSubmit = useCallback(() => {
    onSelect(beatType);
  }, [beatType, onSelect]);

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
          <MenuItem value="4/4">4/4拍子</MenuItem>
          <MenuItem value="3/4">3/4拍子</MenuItem>
        </Select>
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
