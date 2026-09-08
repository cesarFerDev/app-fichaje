import type { SxProps, Theme } from "@mui/material/styles";

export const buttonStyles: SxProps<Theme> = {
  minHeight: 56,
  gap: 1.5,
  px: 3,
  fontSize: "1.0625rem",
  "&:hover": {
    bgcolor: "primary.dark",
  },
};
