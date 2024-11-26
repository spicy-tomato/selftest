import { defineConfig, extendTheme, ThemingConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

const theme = extendTheme({ config });

export default theme;
