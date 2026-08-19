import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["private-storage/**"],
  },
];

export default eslintConfig;
