import { styled } from "@macaron-css/react";

export const Button = styled("button", {
  base: {
    borderRadius: 6,
    cursor: "pointer",
  },
  variants: {
    color: {
      neutral: { background: "whitesmoke" },
      brand: { background: "blueviolet" },
      accent: { background: "slateblue" },
    },
    size: {
      smallest: { padding: 6 },
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    },
    rounded: {
      true: { borderRadius: 999 },
    },
  },
  compoundVariants: [
    {
      variants: {
        color: "neutral",
        size: "large",
      },
      style: {
        background: "ghostwhite",
      },
    },
  ],

  defaultVariants: {
    color: "accent",
    size: "medium",
  },
});
