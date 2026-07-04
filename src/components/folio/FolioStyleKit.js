"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolioScreen = FolioScreen;
exports.FolioCrayonSurface = FolioCrayonSurface;
exports.FolioButton = FolioButton;
exports.FolioPageIntro = FolioPageIntro;
exports.FolioToolbar = FolioToolbar;
exports.FolioDeckHero = FolioDeckHero;
exports.FolioFlowStrip = FolioFlowStrip;
exports.FolioFlashcardPaper = FolioFlashcardPaper;
exports.FolioDifficultyRow = FolioDifficultyRow;
exports.FolioBrowseControls = FolioBrowseControls;
exports.FolioTutorialModal = FolioTutorialModal;
exports.DeckTopicIcon = DeckTopicIcon;
exports.FolioMark = FolioMark;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var crayon_fill_1 = require("@/components/ui/crayon-fill");
var icons_1 = require("./icons");
var folio_theme_1 = require("./folio-theme");
var SESSION_FLOW_TUTORIAL = require('../../../assets/tutorial/session-flow-tutorial.png');
function FolioScreen(_a) {
    var children = _a.children, contentStyle = _a.contentStyle;
    var insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    return (<react_native_1.ScrollView style={styles.screen} directionalLockEnabled keyboardShouldPersistTaps="handled" contentContainerStyle={[
            styles.screenContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
            contentStyle,
        ]}>
      {children}
    </react_native_1.ScrollView>);
}
function FolioCrayonSurface(_a) {
    var children = _a.children, _b = _a.tone, tone = _b === void 0 ? 'cream' : _b, textureOpacity = _a.textureOpacity, style = _a.style, contentStyle = _a.contentStyle;
    var config = folio_theme_1.FOLIO_TONES[tone];
    return (<react_native_1.View style={[
            styles.crayonSurface,
            { backgroundColor: config.backgroundColor, borderColor: config.borderColor },
            style,
        ]}>
      <crayon_fill_1.CrayonFill tone={config.crayonTone} variant={config.variant} opacity={textureOpacity !== null && textureOpacity !== void 0 ? textureOpacity : config.opacity}/>
      <react_native_1.View style={[styles.crayonSurfaceContent, contentStyle]}>{children}</react_native_1.View>
    </react_native_1.View>);
}
function FolioButton(_a) {
    var label = _a.label, hint = _a.hint, _b = _a.tone, tone = _b === void 0 ? 'review' : _b, icon = _a.icon, _c = _a.size, size = _c === void 0 ? 'md' : _c, style = _a.style, textStyle = _a.textStyle, disabled = _a.disabled, pressableProps = __rest(_a, ["label", "hint", "tone", "icon", "size", "style", "textStyle", "disabled"]);
    var config = folio_theme_1.FOLIO_TONES[tone];
    return (<react_native_1.Pressable accessibilityRole="button" disabled={disabled} style={function (_a) {
            var pressed = _a.pressed;
            return [
                styles.button,
                styles["button_".concat(size)],
                { backgroundColor: config.backgroundColor, borderColor: config.borderColor },
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                style,
            ];
        }} {...pressableProps}>
      <crayon_fill_1.CrayonFill tone={config.crayonTone} variant={config.variant} opacity={config.opacity}/>
      <react_native_1.View style={styles.buttonContent}>
        {icon ? <FolioMark name={icon} color={config.textColor} size={size === 'sm' ? 17 : 24}/> : null}
        {label ? (<react_native_1.Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.buttonLabel, { color: config.textColor }, textStyle]}>
            {label}
          </react_native_1.Text>) : null}
        {hint ? <react_native_1.Text style={[styles.buttonHint, { color: config.textColor }]}>{hint}</react_native_1.Text> : null}
      </react_native_1.View>
    </react_native_1.Pressable>);
}
function FolioPageIntro(_a) {
    var eyebrow = _a.eyebrow, title = _a.title, subtitle = _a.subtitle;
    return (<react_native_1.View style={styles.pageIntro}>
      <react_native_1.Text style={styles.eyebrow}>{eyebrow}</react_native_1.Text>
      <react_native_1.Text style={styles.pageTitle}>{title}</react_native_1.Text>
      {subtitle ? <react_native_1.Text style={styles.pageSubtitle}>{subtitle}</react_native_1.Text> : null}
    </react_native_1.View>);
}
function FolioToolbar(_a) {
    var _b = _a.title, title = _b === void 0 ? 'Folio' : _b, onBack = _a.onBack, onUndo = _a.onUndo, onEdit = _a.onEdit, onHelp = _a.onHelp, _c = _a.canUndo, canUndo = _c === void 0 ? true : _c;
    return (<react_native_1.View style={styles.toolbar}>
      <FolioButton label="" tone="warning" icon="back" size="square" onPress={onBack} style={styles.toolbarBack}/>
      <react_native_1.Text style={styles.toolbarTitle}>{title}</react_native_1.Text>
      <react_native_1.View style={styles.toolbarActions}>
        <FolioButton label="Undo" tone="undo" icon="undo" size="sm" onPress={onUndo} disabled={!canUndo} style={styles.toolbarAction}/>
        <FolioButton label="Edit" tone="edit" icon="edit" size="sm" onPress={onEdit} style={styles.toolbarAction}/>
        <FolioButton label="" tone="help" icon="help" size="square" onPress={onHelp} style={styles.toolbarHelp}/>
      </react_native_1.View>
    </react_native_1.View>);
}
function FolioDeckHero(_a) {
    var deckName = _a.deckName, subtitle = _a.subtitle, _b = _a.mode, mode = _b === void 0 ? 'review' : _b;
    return (<FolioCrayonSurface tone="review" textureOpacity={0.34} style={styles.deckHero}>
      <react_native_1.View style={styles.deckHeroContent}>
        <DeckTopicIcon deckName={deckName}/>
        <react_native_1.View style={styles.deckHeroText}>
          <react_native_1.Text numberOfLines={2} ellipsizeMode="tail" style={styles.deckTitle}>
            {deckName}
          </react_native_1.Text>
          <react_native_1.Text style={styles.deckSubtitle}>
            <react_native_1.Text style={styles.deckSubtitleStrong}>{mode === 'browse' ? 'Browse cards' : subtitle.split(' ')[0]}</react_native_1.Text>
            {mode === 'browse' ? ' - no scheduling changes' : " ".concat(subtitle.replace(subtitle.split(' ')[0], ''))}
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </FolioCrayonSurface>);
}
function FolioFlowStrip(_a) {
    var mode = _a.mode, countLabel = _a.countLabel, middleLabel = _a.middleLabel;
    var title = mode === 'review' ? 'Session flow' : 'Browse flow';
    var helper = middleLabel !== null && middleLabel !== void 0 ? middleLabel : (mode === 'review' ? 'Cards move based on how hard they felt.' : 'All cards');
    return (<FolioCrayonSurface tone="review" textureOpacity={0.28} style={styles.flowStrip}>
      <react_native_1.View style={styles.flowHeader}>
        <react_native_1.View>
          <react_native_1.Text style={styles.flowTitle}>{title}</react_native_1.Text>
          <react_native_1.View style={styles.flowUnderline}/>
        </react_native_1.View>
        <react_native_1.Text numberOfLines={2} style={styles.flowHelper}>{helper}</react_native_1.Text>
        <react_native_1.Text style={styles.flowCount}>{countLabel}</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.View style={styles.flowCards}>
        {(mode === 'review' ? REVIEW_FLOW : BROWSE_FLOW).map(function (card, index) { return (<FlowMarker key={"".concat(card, "-").concat(index)} tone={card} current={mode === 'review' ? index === 6 : index === 4}/>); })}
      </react_native_1.View>

      {mode === 'review' ? (<react_native_1.View style={styles.flowLegend}>
          {['new', 'again', 'hard', 'good', 'easy'].map(function (tone) { return (<react_native_1.View key={tone} style={styles.flowLegendItem}>
              <FlowMarker tone={tone} small/>
              <react_native_1.Text style={styles.flowLegendText}>{LABELS[tone]}</react_native_1.Text>
            </react_native_1.View>); })}
        </react_native_1.View>) : (<react_native_1.Text style={styles.browseModeNote}>Browse cards without changing the schedule.</react_native_1.Text>)}
    </FolioCrayonSurface>);
}
var REVIEW_FLOW = ['new', 'new', 'new', 'again', 'hard', 'good', 'good', 'ghost', 'ghost', 'ghost', 'good', 'easy', 'again', 'hard', 'new'];
var BROWSE_FLOW = ['new', 'again', 'hard', 'good', 'good', 'easy', 'again', 'new'];
var LABELS = {
    new: 'New',
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
};
function FlowMarker(_a) {
    var tone = _a.tone, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.small, small = _c === void 0 ? false : _c;
    return (<react_native_1.View style={styles.markerSlot}>
      {current ? <react_native_1.View style={styles.currentRay}/> : null}
      <react_native_1.View style={[
            small ? styles.markerSmall : styles.marker,
            tone === 'new' && styles.markerNew,
            tone === 'again' && styles.markerAgain,
            tone === 'hard' && styles.markerHard,
            tone === 'good' && styles.markerGood,
            tone === 'easy' && styles.markerEasy,
            tone === 'ghost' && styles.markerGhost,
            current && styles.markerCurrent,
        ]}/>
      {current ? <react_native_1.View style={styles.currentPointer}/> : null}
    </react_native_1.View>);
}
function FolioFlashcardPaper(_a) {
    var question = _a.question, answer = _a.answer, _b = _a.isRevealed, isRevealed = _b === void 0 ? false : _b, progressLabel = _a.progressLabel, _c = _a.doodleLabel, doodleLabel = _c === void 0 ? 'FIND' : _c;
    return (<react_native_1.View style={styles.cardStack}>
      <react_native_1.View style={[styles.stackSheet, styles.stackSheetBack]}/>
      <react_native_1.View style={[styles.stackSheet, styles.stackSheetMid]}/>
      <FolioCrayonSurface tone="cream" textureOpacity={0.07} style={styles.flashcard}>
        <react_native_1.View style={styles.flashcardContent}>
          <react_native_1.View style={styles.flashcardTopRow}>
            <FolioMark name="card-star" color={folio_theme_1.FOLIO.colors.blueCrayon} size={26}/>
            <react_native_1.Text style={styles.cardProgress}>{progressLabel}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={styles.questionArea}>
            <react_native_1.Text numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.74} style={styles.question}>
              {isRevealed && answer ? answer : question}
            </react_native_1.Text>
            <react_native_1.View style={styles.questionUnderline}/>
            <react_native_1.Text style={styles.doodleLabel}>{doodleLabel}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.Text style={styles.revealHint}>{isRevealed ? 'Tap to see prompt' : 'Tap to reveal answer'}</react_native_1.Text>
        </react_native_1.View>
      </FolioCrayonSurface>
    </react_native_1.View>);
}
function FolioDifficultyRow(_a) {
    var onGrade = _a.onGrade;
    return (<react_native_1.View style={styles.difficultyRow}>
      <FolioButton label="Again" hint="< 1 min" icon="again" tone="warning" size="lg" onPress={function () { return onGrade('again'); }} style={styles.difficultyButton}/>
      <FolioButton label="Hard" hint="5 min" icon="hard" tone="danger" size="lg" onPress={function () { return onGrade('hard'); }} style={styles.difficultyButton}/>
      <FolioButton label="Good" hint="15 min" icon="good" tone="review" size="lg" onPress={function () { return onGrade('good'); }} style={styles.difficultyButton}/>
      <FolioButton label="Easy" hint="4 d" icon="easy" tone="easy" size="lg" onPress={function () { return onGrade('easy'); }} style={styles.difficultyButton}/>
    </react_native_1.View>);
}
function FolioBrowseControls(_a) {
    var onPrevious = _a.onPrevious, onFlip = _a.onFlip, onNext = _a.onNext;
    return (<react_native_1.View style={styles.browseControls}>
      <FolioButton label="Previous" icon="previous" tone="browse" size="md" onPress={onPrevious} style={styles.browseSideButton}/>
      <FolioButton label="Flip card" icon="flip" tone="browse" size="md" onPress={onFlip} style={styles.browseFlipButton}/>
      <FolioButton label="Next" icon="next" tone="browse" size="md" onPress={onNext} style={styles.browseSideButton}/>
    </react_native_1.View>);
}
function FolioTutorialModal(_a) {
    var visible = _a.visible, onClose = _a.onClose;
    return (<react_native_1.Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <react_native_1.View style={styles.tutorialOverlay}>
        <react_native_1.View style={styles.tutorialCard}>
          <crayon_fill_1.CrayonFill tone="review" variant="loose" opacity={0.2}/>
          <react_native_1.View style={styles.tutorialHeader}>
            <react_native_1.View>
              <react_native_1.Text style={styles.tutorialEyebrow}>Folio guide</react_native_1.Text>
              <react_native_1.Text style={styles.tutorialTitle}>How review flow works</react_native_1.Text>
            </react_native_1.View>
            <FolioButton label="Close" tone="warning" icon="close" size="pill" onPress={onClose}/>
          </react_native_1.View>
          <react_native_1.Image source={SESSION_FLOW_TUTORIAL} resizeMode="contain" style={styles.tutorialImage}/>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
}
function DeckTopicIcon(_a) {
    var deckName = _a.deckName, _b = _a.size, size = _b === void 0 ? 72 : _b;
    var kind = inferDeckKind(deckName);
    var iconName = getDeckIconName(kind);
    var iconColor = kind === 'language'
        ? folio_theme_1.FOLIO.colors.orange
        : kind === 'programming'
            ? folio_theme_1.FOLIO.colors.greenDeep
            : folio_theme_1.FOLIO.colors.blueDeep;
    var secondaryColor = kind === 'language'
        ? folio_theme_1.FOLIO.colors.orangeCrayon
        : kind === 'programming'
            ? folio_theme_1.FOLIO.colors.greenCrayon
            : folio_theme_1.FOLIO.colors.blueCrayon;
    return (<react_native_1.View style={[styles.deckIconShell, { width: size, minHeight: size, borderRadius: Math.max(18, size * 0.24) }]}>
      <icons_1.FolioSvgIcon name={iconName} size={Math.round(size * 0.78)} color={iconColor} secondaryColor={secondaryColor}/>
    </react_native_1.View>);
}
function getDeckIconName(kind) {
    if (kind === 'ai')
        return 'deck-ai';
    if (kind === 'language')
        return 'deck-language';
    if (kind === 'programming')
        return 'deck-programming';
    return 'deck-general';
}
function inferDeckKind(deckName) {
    var _a;
    var text = (_a = deckName === null || deckName === void 0 ? void 0 : deckName.toLowerCase()) !== null && _a !== void 0 ? _a : '';
    if (/\b(ai|llm|model|retrieval|generation|embedding|agent|architecture|system|neural)\b/.test(text))
        return 'ai';
    if (/\b(spanish|french|japanese|language|phrase|vocab|verb|grammar|anki|store help)\b/.test(text))
        return 'language';
    if (/\b(python|javascript|typescript|react|sql|code|programming|function|variable)\b/.test(text))
        return 'programming';
    return 'general';
}
function FolioMark(_a) {
    var name = _a.name, _b = _a.color, color = _b === void 0 ? folio_theme_1.FOLIO.colors.blueDeep : _b, _c = _a.size, size = _c === void 0 ? 24 : _c;
    return <icons_1.FolioSvgIcon name={name} color={color} size={size}/>;
}
var styles = react_native_1.StyleSheet.create({
    screen: { flex: 1, backgroundColor: folio_theme_1.FOLIO.colors.paper },
    screenContent: { paddingHorizontal: folio_theme_1.FOLIO.spacing.lg, gap: folio_theme_1.FOLIO.spacing.md },
    crayonSurface: __assign({ position: 'relative', overflow: 'hidden', borderWidth: 1, borderRadius: folio_theme_1.FOLIO.radius.xl }, folio_theme_1.FOLIO.shadows.soft),
    crayonSurfaceContent: { position: 'relative', zIndex: 1 },
    button: __assign({ position: 'relative', overflow: 'hidden', borderWidth: 1, borderRadius: folio_theme_1.FOLIO.radius.lg, alignItems: 'center', justifyContent: 'center' }, folio_theme_1.FOLIO.shadows.soft),
    button_sm: { minWidth: 58, minHeight: 56, paddingHorizontal: 8, paddingVertical: 5 },
    button_md: { minHeight: 52, paddingHorizontal: 18, paddingVertical: 10 },
    button_lg: { minHeight: 94, paddingHorizontal: 14, paddingVertical: 12 },
    button_square: { width: 60, minHeight: 60, padding: 0 },
    button_pill: { minHeight: 46, paddingHorizontal: 18, paddingVertical: 8, borderRadius: folio_theme_1.FOLIO.radius.pill },
    buttonContent: { position: 'relative', zIndex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
    buttonLabel: { fontSize: 17, lineHeight: 21, fontWeight: '900', textAlign: 'center' },
    buttonHint: { opacity: 0.88, fontSize: 12, lineHeight: 15, fontWeight: '800', textAlign: 'center' },
    pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
    disabled: { opacity: 0.45 },
    pageIntro: { gap: 8 },
    eyebrow: { color: folio_theme_1.FOLIO.colors.blue, fontSize: 13, lineHeight: 16, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
    pageTitle: { color: folio_theme_1.FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900' },
    pageSubtitle: { color: folio_theme_1.FOLIO.colors.muted, fontSize: 16, lineHeight: 23 },
    toolbar: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: folio_theme_1.FOLIO.spacing.sm },
    toolbarBack: { flexShrink: 0 },
    toolbarTitle: { flex: 1, color: folio_theme_1.FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
    toolbarActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexShrink: 0 },
    toolbarAction: { width: 60 },
    toolbarHelp: { borderWidth: 2 },
    deckHero: { borderRadius: folio_theme_1.FOLIO.radius.xl },
    deckHeroContent: { flexDirection: 'row', alignItems: 'center', gap: folio_theme_1.FOLIO.spacing.md, paddingHorizontal: folio_theme_1.FOLIO.spacing.md, paddingVertical: 12 },
    deckHeroText: { flex: 1, gap: 4, minWidth: 0 },
    deckTitle: { color: folio_theme_1.FOLIO.colors.ink, fontSize: 25, lineHeight: 31, fontWeight: '900' },
    deckSubtitle: { color: folio_theme_1.FOLIO.colors.muted, fontSize: 16, lineHeight: 21, fontWeight: '800' },
    deckSubtitleStrong: { color: folio_theme_1.FOLIO.colors.blueDeep },
    flowStrip: { borderRadius: folio_theme_1.FOLIO.radius.xl },
    flowHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: folio_theme_1.FOLIO.spacing.sm, paddingHorizontal: folio_theme_1.FOLIO.spacing.md, paddingTop: 12 },
    flowTitle: { color: folio_theme_1.FOLIO.colors.ink, fontSize: 18, lineHeight: 22, fontWeight: '900' },
    flowUnderline: { height: 3, marginTop: 5, borderRadius: 999, backgroundColor: folio_theme_1.FOLIO.colors.blueDeep },
    flowHelper: { flex: 1, color: folio_theme_1.FOLIO.colors.muted, fontSize: 13, lineHeight: 17, fontWeight: '800', textAlign: 'center' },
    flowCount: { color: folio_theme_1.FOLIO.colors.blueDeep, fontSize: 15, lineHeight: 20, fontWeight: '900', textAlign: 'right' },
    flowCards: { flexDirection: 'row', justifyContent: 'center', gap: 7, paddingTop: 12, paddingHorizontal: 8 },
    markerSlot: { width: 17, alignItems: 'center' },
    marker: { width: 16, height: 28, borderRadius: 7, borderWidth: 1.5 },
    markerSmall: { width: 14, height: 24, borderRadius: 6, borderWidth: 1.5 },
    markerNew: { backgroundColor: folio_theme_1.FOLIO.colors.card, borderColor: folio_theme_1.FOLIO.colors.border },
    markerAgain: { backgroundColor: folio_theme_1.FOLIO.colors.orangeSoft, borderColor: folio_theme_1.FOLIO.colors.orangeCrayon },
    markerHard: { backgroundColor: folio_theme_1.FOLIO.colors.coralSoft, borderColor: folio_theme_1.FOLIO.colors.coralCrayon },
    markerGood: { backgroundColor: folio_theme_1.FOLIO.colors.blueSoft, borderColor: folio_theme_1.FOLIO.colors.blueCrayon },
    markerEasy: { backgroundColor: folio_theme_1.FOLIO.colors.greenSoft, borderColor: folio_theme_1.FOLIO.colors.greenCrayon },
    markerGhost: { backgroundColor: 'transparent', borderColor: folio_theme_1.FOLIO.colors.blueCrayon, borderStyle: 'dashed' },
    markerCurrent: { borderColor: folio_theme_1.FOLIO.colors.blueDeep, borderWidth: 2.5 },
    currentRay: { width: 4, height: 10, borderRadius: 999, backgroundColor: folio_theme_1.FOLIO.colors.blueDeep, marginBottom: 2 },
    currentPointer: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: folio_theme_1.FOLIO.colors.blueDeep, transform: [{ rotate: '180deg' }], marginTop: 2 },
    flowLegend: { flexDirection: 'row', justifyContent: 'space-around', gap: 4, paddingHorizontal: 8, paddingTop: 10, paddingBottom: 12 },
    flowLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    flowLegendText: { color: folio_theme_1.FOLIO.colors.muted, fontSize: 12, lineHeight: 15, fontWeight: '800' },
    browseModeNote: { color: folio_theme_1.FOLIO.colors.blueDeep, fontSize: 14, lineHeight: 18, fontWeight: '900', textAlign: 'center', paddingTop: 10, paddingBottom: 12 },
    cardStack: { position: 'relative' },
    stackSheet: { position: 'absolute', left: 18, right: 18, height: 28, bottom: -12, borderRadius: folio_theme_1.FOLIO.radius.xl, backgroundColor: folio_theme_1.FOLIO.colors.card, borderWidth: 1, borderColor: folio_theme_1.FOLIO.colors.border, opacity: 0.6 },
    stackSheetBack: { bottom: -18, opacity: 0.28 },
    stackSheetMid: { bottom: -10, opacity: 0.42 },
    flashcard: { borderRadius: folio_theme_1.FOLIO.radius.xl, minHeight: 330, backgroundColor: folio_theme_1.FOLIO.colors.card },
    flashcardContent: { minHeight: 330, paddingHorizontal: folio_theme_1.FOLIO.spacing.xl, paddingVertical: folio_theme_1.FOLIO.spacing.lg, justifyContent: 'space-between' },
    flashcardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardProgress: { color: folio_theme_1.FOLIO.colors.muted, fontSize: 28, lineHeight: 34, fontWeight: '900' },
    questionArea: { alignItems: 'center', justifyContent: 'center', gap: 14 },
    question: { color: folio_theme_1.FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
    questionUnderline: { width: '52%', height: 3, borderRadius: 999, backgroundColor: folio_theme_1.FOLIO.colors.blueCrayon },
    doodleLabel: { color: folio_theme_1.FOLIO.colors.blueDeep, fontSize: 16, lineHeight: 20, fontWeight: '900', letterSpacing: 0.5 },
    revealHint: { color: folio_theme_1.FOLIO.colors.muted, fontSize: 18, lineHeight: 23, fontWeight: '800', textAlign: 'center' },
    difficultyRow: { flexDirection: 'row', gap: 9 },
    difficultyButton: { flex: 1, minHeight: 94, borderRadius: folio_theme_1.FOLIO.radius.lg },
    browseControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    browseSideButton: { flex: 1, minHeight: 58, borderRadius: folio_theme_1.FOLIO.radius.lg },
    browseFlipButton: { flex: 1.35, minHeight: 64, borderRadius: folio_theme_1.FOLIO.radius.lg, borderWidth: 2 },
    tutorialOverlay: { flex: 1, backgroundColor: 'rgba(42,36,31,0.42)', padding: folio_theme_1.FOLIO.spacing.lg, justifyContent: 'center' },
    tutorialCard: __assign({ position: 'relative', overflow: 'hidden', borderRadius: folio_theme_1.FOLIO.radius.xl, backgroundColor: folio_theme_1.FOLIO.colors.card, borderColor: folio_theme_1.FOLIO.colors.blueCrayon, borderWidth: 1, padding: folio_theme_1.FOLIO.spacing.md, gap: folio_theme_1.FOLIO.spacing.md }, folio_theme_1.FOLIO.shadows.card),
    tutorialHeader: { position: 'relative', zIndex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: folio_theme_1.FOLIO.spacing.md },
    tutorialEyebrow: { color: folio_theme_1.FOLIO.colors.blueDeep, fontSize: 12, lineHeight: 15, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
    tutorialTitle: { color: folio_theme_1.FOLIO.colors.ink, fontSize: 22, lineHeight: 27, fontWeight: '900' },
    tutorialImage: { position: 'relative', zIndex: 1, width: '100%', minHeight: 420, maxHeight: 620, borderRadius: folio_theme_1.FOLIO.radius.lg },
    deckIconShell: { alignItems: 'center', justifyContent: 'center', backgroundColor: folio_theme_1.FOLIO.colors.card, borderColor: folio_theme_1.FOLIO.colors.blueCrayon, borderWidth: 1 },
});
