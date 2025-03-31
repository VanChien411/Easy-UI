export const lightTheme = {
  backgroundColor: "rgb(235,236,240)",
  textColor: "#000000",
  cardBorderColor: "rgb(224, 79, 173)", // Changed to a lighter color
  buttonHtmlColor: "#f06529",
  buttonJsColor: "#f7df1e",
  buttonCssColor: "#2965f1",
  backgroundColorRgba: " #ffffff",
  backgroundColorNavbar:
    "linear-gradient(to right, rgb(224, 79, 173), rgb(255, 105, 180))",
  textColorFollow: "rgb(104, 29, 66)", // Changed to a lighter pink color
  textColorFollowHover: "rgb(255, 105, 180)", // Changed to a lighter hover color
  backgroundColorFollow: "rgb(255, 105, 180)", // Changed to a lighter background color
};

export const darkTheme = {
  backgroundColor: "linear-gradient(45deg, #201629, #000000, #201629)",
  textColor: "#ffffff",
  cardBorderColor: "#dcdcdc",
  buttonHtmlColor: "#f06529",
  buttonJsColor: "#f7df1e",
  buttonCssColor: "#2965f1",
  backgroundColorRgba: "rgba(32, 22, 41, 1)",
  backgroundColorNavbar: "rgba(101, 101, 237, 0.09)",
  textColorFollow: "#ffffff",
  textColorFollowHover: "#ffffff",
  backgroundColorFollow: "rgba(32, 22, 41, 1)",
};

export function applyTheme(theme) {
  document.documentElement.style.setProperty(
    "--background-color",
    theme.backgroundColor
  );
  document.documentElement.style.setProperty("--text-color", theme.textColor);
  document.documentElement.style.setProperty(
    "--card-border-color",
    theme.cardBorderColor
  );
  document.documentElement.style.setProperty(
    "--button-html-color",
    theme.buttonHtmlColor
  );
  document.documentElement.style.setProperty(
    "--button-js-color",
    theme.buttonJsColor
  );
  document.documentElement.style.setProperty(
    "--button-css-color",
    theme.buttonCssColor
  );
  document.documentElement.style.setProperty(
    "--background-color-rgba",
    theme.backgroundColorRgba
  );
  document.documentElement.style.setProperty(
    "--background-color-navbar",
    theme.backgroundColorNavbar
  );
  document.documentElement.style.setProperty(
    "--text-color-follow",
    theme.textColorFollow
  );
  document.documentElement.style.setProperty(
    "--text-color-follow-hover",
    theme.textColorFollowHover
  );
  document.documentElement.style.setProperty(
    "  --background-color-follow",
    theme.backgroundColorFollow
  );
}
