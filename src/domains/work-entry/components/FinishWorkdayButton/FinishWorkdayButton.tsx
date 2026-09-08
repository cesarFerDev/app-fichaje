import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { buttonStyles } from "./styles";

type Props = {
  isPending: boolean;
  onClick: () => void;
};

export function FinishWorkdayButton({ isPending, onClick }: Props) {
  const { t } = useTranslation("workEntry");

  return (
    <Button
      aria-busy={isPending}
      color="primary"
      disabled={isPending}
      disableElevation
      fullWidth
      onClick={onClick}
      sx={buttonStyles}
      variant="contained"
    >
      {isPending ? (
        <CircularProgress aria-hidden="true" color="inherit" size={20} />
      ) : null}
      {t(isPending ? "workday.actions.finishing" : "workday.actions.finish")}
    </Button>
  );
}
