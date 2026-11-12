  // Folio ruling shares the text layout and native scroll coordinate system.
  private val folioRulePaint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
    color = Color.rgb(197, 214, 215)
  }

  override fun onDraw(canvas: android.graphics.Canvas) {
    val textLayout = layout
    if (textLayout != null && textLayout.lineCount > 0) {
      val density = resources.displayMetrics.density
      val inset = 16f * density
      val gap = 3f * density
      val clip = canvas.clipBounds
      val top = totalPaddingTop.toFloat()
      val bottom = clip.bottom.toFloat()
      folioRulePaint.strokeWidth = 0.8f * density
      if (width > inset * 2) {
        val save = canvas.save()
        canvas.clipRect(0f, scrollY + paddingTop.toFloat(), width.toFloat(), scrollY + height.toFloat())
        val first = textLayout.getLineForVertical(maxOf(0, (clip.top - top).toInt()))
        val last = textLayout.getLineForVertical(maxOf(0, (bottom - top).toInt()))
        for (line in first..last) {
          val y = top + textLayout.getLineBottom(line) - gap
          canvas.drawLine(inset, y, width - inset, y, folioRulePaint)
        }
        // Continue blank paper below the actual text, including empty notes.
        val step = maxOf(paint.fontSpacing, pixelFromSpOrDp(lineHeight ?: 28f, allowFontScaling), 1f)
        var y = top + textLayout.getLineBottom(textLayout.lineCount - 1) - gap + step
        if (y < clip.top) y += ceil((clip.top - y) / step) * step
        while (y < bottom) {
          canvas.drawLine(inset, y, width - inset, y, folioRulePaint)
          y += step
        }
        canvas.restoreToCount(save)
      }
    }
    super.onDraw(canvas)
  }

