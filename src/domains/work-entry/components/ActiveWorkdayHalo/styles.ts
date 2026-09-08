import type { SxProps, Theme } from "@mui/material/styles";

export const haloStyles: SxProps<Theme> = {
  width: "clamp(13.75rem, 70vw, 17.5rem)",
  aspectRatio: "1",
  display: "grid",
  placeItems: "center",
  border: 4,
  borderColor: "primary.main",
  borderRadius: "50%",
  textAlign: "center",
};

export const contentStyles: SxProps<Theme> = {
  px: 2,
};

export const statusStyles: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "1.125rem",
  fontWeight: 400,
};

export const durationStyles: SxProps<Theme> = {
  mt: 0.75,
  color: "text.primary",
  fontSize: "clamp(3rem, 15vw, 4.5rem)",
  fontWeight: 600,
  letterSpacing: "-0.045em",
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
};

export const startTimeStyles: SxProps<Theme> = {
  mt: 1,
  color: "text.secondary",
  fontVariantNumeric: "tabular-nums",
};
