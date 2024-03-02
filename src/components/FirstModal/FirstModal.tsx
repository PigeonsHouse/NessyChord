import React, { useCallback, useState } from "react"
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { ButtonContainer } from "./styled";

type FirstModalProps = Readonly<{
  open: boolean;
  onSelect: (value: string) => void;
}>;

export const FirstModal: React.FC<FirstModalProps> = ({
  open,
  onSelect,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const onClickNewFile = useCallback(() => {
    onSelect("newfile")
  }, [
    onSelect,
  ]);
  const onClickExistFile = useCallback(() => {
    setOpenSnackbar(true);
  }, [setOpenSnackbar]);
  const onCloseSnackbar = useCallback((_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }, [setOpenSnackbar]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>さぁ作曲しよう</DialogTitle>
      <ButtonContainer>
        <Button
          size="large"
          variant="contained"
          onClick={onClickNewFile}
        >
          新規作成
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={onClickExistFile}
        >
          ファイルを開く
        </Button>
      </ButtonContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={onCloseSnackbar}
        message="未実装です"
      />
    </Dialog>
  )
}
