// Folio ruling uses TextKit fragments, not a separately scrolling JS background.
- (void)drawRect:(CGRect)rect {
  EnrichedTextInputView *input = (EnrichedTextInputView *)_input;
  if (input != nil && self.bounds.size.width > 32) {
    NSLayoutManager *manager = self.layoutManager;
    UIEdgeInsets inset = self.textContainerInset;
    CGRect visible = self.bounds;
    CGRect textRect = CGRectOffset(visible, -inset.left, -inset.top);
    NSRange glyphs = [manager glyphRangeForBoundingRect:textRect inTextContainer:self.textContainer];
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(context);
    CGContextClipToRect(context, visible);
    CGContextSetRGBStrokeColor(context, 197.0 / 255, 214.0 / 255, 215.0 / 255, 1);
    CGContextSetLineWidth(context, 0.8);
    void (^rule)(CGFloat) = ^(CGFloat y) {
      CGContextMoveToPoint(context, 16, y);
      CGContextAddLineToPoint(context, self.bounds.size.width - 16, y);
    };
    [manager enumerateLineFragmentsForGlyphRange:glyphs usingBlock:
      ^(CGRect lineRect, CGRect usedRect, NSTextContainer *container, NSRange range, BOOL *stop) {
        rule(inset.top + CGRectGetMaxY(lineRect) - 3);
      }];
    CGFloat step = MAX(1, MAX([input->config primaryFont].lineHeight, [input->config scaledPrimaryLineHeight]));
    CGFloat end = 0;
    if (manager.numberOfGlyphs > 0) {
      end = CGRectGetMaxY([manager lineFragmentRectForGlyphAtIndex:manager.numberOfGlyphs - 1 effectiveRange:NULL]);
    }
    // TextKit's extra fragment represents the empty row after a trailing Return.
    if (manager.extraLineFragmentTextContainer == self.textContainer && manager.extraLineFragmentRect.size.height > 0) {
      end = MAX(end, CGRectGetMaxY(manager.extraLineFragmentRect));
      rule(inset.top + end - 3);
    } else if (end == 0) {
      end = step;
      rule(inset.top + end - 3);
    }
    CGFloat y = inset.top + end - 3 + step;
    if (y < CGRectGetMinY(visible)) y += ceil((CGRectGetMinY(visible) - y) / step) * step;
    for (; y < CGRectGetMaxY(visible); y += step) rule(y);
    CGContextStrokePath(context);
    CGContextRestoreGState(context);
  }
  [super drawRect:rect];
}

