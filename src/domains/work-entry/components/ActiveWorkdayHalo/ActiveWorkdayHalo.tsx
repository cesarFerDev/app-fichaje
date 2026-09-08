import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import {
  contentStyles,
  durationStyles,
  haloStyles,
  startTimeStyles,
  statusStyles,
} from "./styles";

type Props = {
  duration: string;
  startTime: string;
};

export function ActiveWorkdayHalo({ duration, startTime }: Props) {
  const { t } = useTranslation("workEntry");

  return (
    <Box component="section" sx={haloStyles}>
      <Box sx={contentStyles}>
        <Typography component="h2" sx={statusStyles}>
          {t("workday.status.active")}
        </Typography>
        <Typography component="p" sx={durationStyles}>
          {duration}
        </Typography>
        <Typography component="p" sx={startTimeStyles}>
          {t("workday.startTime", { time: startTime })}
        </Typography>
      </Box>
    </Box>
  );
}
