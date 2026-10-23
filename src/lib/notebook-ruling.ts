const RULE_SIDE_INSET = 16;
const RULE_BASELINE_GAP = 3;

export function getNotebookRuleY(index: number, textTop: number, lineHeight: number) {
  return textTop + (index + 1) * lineHeight - RULE_BASELINE_GAP;
}

export function getNotebookRulePath(
  width: number,
  height: number,
  textTop: number,
  lineHeight: number
) {
  if (
    ![width, height, textTop, lineHeight].every(Number.isFinite) ||
    width <= RULE_SIDE_INSET * 2 ||
    height <= 0 ||
    lineHeight <= 0
  ) {
    return '';
  }

  const right = width - RULE_SIDE_INSET;
  const rules: string[] = [];

  for (let index = 0; ; index += 1) {
    const y = getNotebookRuleY(index, textTop, lineHeight);
    if (y >= height) {
      break;
    }

    rules.push(`M${RULE_SIDE_INSET} ${y.toFixed(2)} H${right.toFixed(2)}`);
  }

  return rules.join(' ');
}
