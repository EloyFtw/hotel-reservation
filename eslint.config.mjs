import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    // Configurar el parser para TypeScript
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    // Incluir el plugin de TypeScript
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Desactiva errores por variables no usadas
      "@typescript-eslint/no-explicit-any": "off", // Desactiva errores por uso de 'any'
      "react/no-unescaped-entities": "off", // Desactiva errores por comillas sin escapar en JSX
      "@typescript-eslint/no-require-imports": "off", // Desactiva errores por uso de require()
      "react-hooks/exhaustive-deps": "warn", // Cambia advertencias de useEffect a warn
    },
  },
];