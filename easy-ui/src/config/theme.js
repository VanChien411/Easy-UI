export const lightTheme = {
  backgroundColor: "rgb(235,236,240)",
  textColor: "#000000",
  cardBorderColor: "rgb(224, 79, 173)", // Changed to a lighter color
  buttonHtmlColor: "#f06529",
  buttonJsColor: "#f7df1e",
  buttonCssColor: "#2965f1",
  backgroundColorRgba: " #ffffff",
  backgroundColorNavbar: "#D1C4E9",
  textColorFollow: "rgb(104, 29, 66)", // Changed to a lighter pink color
  textColorFollowHover: "rgb(255, 105, 180)", // Changed to a lighter hover color
  backgroundColorFollow: "rgb(255, 105, 180)", // Changed to a lighter background color
  '--background-color-hover': '#f5f5f5',
  '--border-color': '#e0e0e0',
  // Card theme variables
  '--card-background': '#fff',
  '--card-text-color': '#333',
  '--border-color': 'rgba(0, 0, 0, 0.08)',
  '--card-preview-bg': '#f5f5f5',
  '--button-bg': '#fff',
  '--icon-color': '#666',
  '--stat-color': '#666',
  '--avatar-bg': '#f0f0f0',
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
  '--background-color-hover': '#2d2d2d',
  '--border-color': '#404040',
  // Card theme variables
  '--card-background': '#1e1e2d',
  '--card-text-color': '#eee',
  '--border-color': 'rgba(255, 255, 255, 0.08)',
  '--card-preview-bg': '#2a2a3c',
  '--button-bg': '#2a2a3c',
  '--icon-color': '#ddd',
  '--stat-color': '#bbb',
  '--avatar-bg': '#2a2a3c',
};

export function applyTheme(theme) {
  // Set data-theme attribute for CSS selectors
  document.documentElement.setAttribute('data-theme', 
    theme === darkTheme ? 'dark' : 'light');
    
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
    "--background-color-follow",
    theme.backgroundColorFollow
  );
  
  // Set card theme variables
  document.documentElement.style.setProperty(
    "--card-background",
    theme['--card-background']
  );
  document.documentElement.style.setProperty(
    "--card-text-color",
    theme['--card-text-color']
  );
  document.documentElement.style.setProperty(
    "--card-preview-bg",
    theme['--card-preview-bg']
  );
  document.documentElement.style.setProperty(
    "--button-bg",
    theme['--button-bg']
  );
  document.documentElement.style.setProperty(
    "--icon-color",
    theme['--icon-color']
  );
  document.documentElement.style.setProperty(
    "--stat-color",
    theme['--stat-color']
  );
  document.documentElement.style.setProperty(
    "--avatar-bg",
    theme['--avatar-bg']
  );
}
