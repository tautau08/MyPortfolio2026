import type { ReactNode } from "react";

export type Lang = "java" | "ts" | "js" | "sol" | "kotlin" | "python" | "sql";

const KEYWORDS: Record<Lang, string[]> = {
  java: ["public", "private", "protected", "class", "void", "return", "if", "else", "new", "throws", "throw", "implements", "extends", "final", "static", "import", "package", "try", "catch", "for", "null", "true", "false"],
  ts: ["const", "let", "export", "import", "from", "return", "async", "await", "function", "if", "else", "new", "type", "interface", "true", "false", "null"],
  js: ["const", "let", "export", "import", "from", "return", "async", "await", "function", "if", "else", "new", "true", "false", "null"],
  sol: ["function", "public", "payable", "returns", "return", "require", "uint", "uint256", "address", "memory", "private", "view", "if", "true", "false"],
  kotlin: ["private", "fun", "val", "var", "when", "else", "if", "return", "null", "true", "false"],
  python: ["def", "return", "if", "else", "for", "in", "import", "from", "class", "None", "True", "False", "with", "as"],
  sql: ["SELECT", "FROM", "JOIN", "ON", "WHERE", "AND", "OR", "COUNT", "as", "REPLACE"],
};

const COMMENT: Record<Lang, string> = {
  java: "\\/\\/.*$",
  ts: "\\/\\/.*$",
  js: "\\/\\/.*$",
  sol: "\\/\\/.*$",
  kotlin: "\\/\\/.*$",
  python: "#.*$",
  sql: "--.*$",
};

const STRINGS = "\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`";
const REST = "@\\w+|\\b\\d+(?:\\.\\d+)?\\b|\\b[A-Za-z_]\\w*\\b";

/** A deliberately small highlighter: comments, strings, annotations, numbers, keywords. */
export function highlightLine(line: string, lang: Lang): ReactNode[] {
  const kw = new Set(KEYWORDS[lang]);
  const re = new RegExp(`(${COMMENT[lang]})|(${STRINGS})|(${REST})`, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line))) {
    const tok = m[0];
    if (m.index > last) out.push(line.slice(last, m.index));
    last = m.index + tok.length;

    const cls = m[1]
      ? "text-code-dim italic"
      : m[2]
        ? "text-code-str"
        : tok.startsWith("@")
          ? "text-code-ann"
          : /^\d/.test(tok)
            ? "text-code-num"
            : kw.has(tok)
              ? "text-code-kw"
              : null;

    out.push(
      cls ? (
        <span key={m.index} className={cls}>
          {tok}
        </span>
      ) : (
        tok
      ),
    );
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
