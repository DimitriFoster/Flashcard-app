import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrayonFill } from '@/components/ui/crayon-fill';

import { FolioSvgIcon, type FolioSvgIconName } from './icons';
import { FOLIO, FOLIO_TONES, type FolioIconName, type FolioTone } from './folio-theme';
import { FOLIO_HAND_FONT } from '@/folio-review/folioFonts';

const SESSION_FLOW_TUTORIAL = require('../../../assets/tutorial/session-flow-tutorial.png');

type SurfaceProps = {
  children?: React.ReactNode;
  tone?: FolioTone;
  textureOpacity?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function FolioScreen({
  children,
  contentStyle,
}: {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      directionalLockEnabled
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.screenContent,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        contentStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

export function FolioCrayonSurface({
  children,
  tone = 'cream',
  textureOpacity,
  style,
  contentStyle,
}: SurfaceProps) {
  const config = FOLIO_TONES[tone];

  return (
    <View
      style={[
        styles.crayonSurface,
        { backgroundColor: config.backgroundColor, borderColor: config.borderColor },
        style,
      ]}>
      <CrayonFill
        tone={config.crayonTone}
        variant={config.variant}
        opacity={textureOpacity ?? config.opacity}
      />
      <View style={[styles.crayonSurfaceContent, contentStyle]}>{children}</View>
    </View>
  );
}

type ButtonProps = Omit<PressableProps, 'style'> & {
  label?: string;
  hint?: string;
  tone?: FolioTone;
  icon?: FolioIconName;
  size?: 'sm' | 'md' | 'lg' | 'square' | 'pill';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function FolioButton({
  label,
  hint,
  tone = 'review',
  icon,
  size = 'md',
  style,
  textStyle,
  disabled,
  ...pressableProps
}: ButtonProps) {
  const config = FOLIO_TONES[tone];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${size}`],
        { backgroundColor: config.backgroundColor, borderColor: config.borderColor },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...pressableProps}>
      <CrayonFill tone={config.crayonTone} variant={config.variant} opacity={config.opacity} />
      <View style={styles.buttonContent}>
        {icon ? <FolioMark name={icon} color={config.textColor} size={size === 'sm' ? 17 : 24} /> : null}
        {label ? (
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.buttonLabel, { color: config.textColor }, textStyle]}>
            {label}
          </Text>
        ) : null}
        {hint ? <Text style={[styles.buttonHint, { color: config.textColor }]}>{hint}</Text> : null}
      </View>
    </Pressable>
  );
}

export function FolioPageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.pageIntro}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function FolioToolbar({
  title = 'Folio',
  onBack,
  onUndo,
  onEdit,
  onHelp,
  canUndo = true,
}: {
  title?: string;
  onBack?: () => void;
  onUndo?: () => void;
  onEdit?: () => void;
  onHelp?: () => void;
  canUndo?: boolean;
}) {
  return (
    <View style={styles.toolbar}>
      <FolioButton label="" tone="warning" icon="back" size="square" onPress={onBack} style={styles.toolbarBack} />
      <Text style={styles.toolbarTitle}>{title}</Text>
      <View style={styles.toolbarActions}>
        <FolioButton label="Undo" tone="undo" icon="undo" size="sm" onPress={onUndo} disabled={!canUndo} style={styles.toolbarAction} />
        <FolioButton label="Edit" tone="edit" icon="edit" size="sm" onPress={onEdit} style={styles.toolbarAction} />
        <FolioButton label="" tone="help" icon="help" size="square" onPress={onHelp} style={styles.toolbarHelp} />
      </View>
    </View>
  );
}

export function FolioDeckHero({
  deckName,
  subtitle,
  mode = 'review',
}: {
  deckName: string;
  subtitle: string;
  mode?: 'review' | 'browse';
}) {
  return (
    <FolioCrayonSurface tone="review" textureOpacity={0.34} style={styles.deckHero}>
      <View style={styles.deckHeroContent}>
        <DeckTopicIcon deckName={deckName} />
        <View style={styles.deckHeroText}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.deckTitle}>
            {deckName}
          </Text>
          <Text style={styles.deckSubtitle}>
            <Text style={styles.deckSubtitleStrong}>{mode === 'browse' ? 'Browse cards' : subtitle.split(' ')[0]}</Text>
            {mode === 'browse' ? ' - no scheduling changes' : ` ${subtitle.replace(subtitle.split(' ')[0], '')}`}
          </Text>
        </View>
      </View>
    </FolioCrayonSurface>
  );
}

export function FolioFlowStrip({
  mode,
  countLabel,
  middleLabel,
}: {
  mode: 'review' | 'browse';
  countLabel: string;
  middleLabel?: string;
}) {
  const title = mode === 'review' ? 'Session flow' : 'Browse flow';
  const helper =
    middleLabel ?? (mode === 'review' ? 'Cards move based on how hard they felt.' : 'All cards');

  return (
    <FolioCrayonSurface tone="review" textureOpacity={0.28} style={styles.flowStrip}>
      <View style={styles.flowHeader}>
        <View>
          <Text style={styles.flowTitle}>{title}</Text>
          <View style={styles.flowUnderline} />
        </View>
        <Text numberOfLines={2} style={styles.flowHelper}>{helper}</Text>
        <Text style={styles.flowCount}>{countLabel}</Text>
      </View>

      <View style={styles.flowCards}>
        {(mode === 'review' ? REVIEW_FLOW : BROWSE_FLOW).map((card, index) => (
          <FlowMarker
            key={`${card}-${index}`}
            tone={card}
            current={mode === 'review' ? index === 6 : index === 4}
          />
        ))}
      </View>

      {mode === 'review' ? (
        <View style={styles.flowLegend}>
          {(['new', 'again', 'hard', 'good', 'easy'] as const).map((tone) => (
            <View key={tone} style={styles.flowLegendItem}>
              <FlowMarker tone={tone} small />
              <Text style={styles.flowLegendText}>{LABELS[tone]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.browseModeNote}>Browse cards without changing the schedule.</Text>
      )}
    </FolioCrayonSurface>
  );
}
type FlowTone = 'new' | 'again' | 'hard' | 'good' | 'easy' | 'ghost';
const REVIEW_FLOW: FlowTone[] = ['new', 'new', 'new', 'again', 'hard', 'good', 'good', 'ghost', 'ghost', 'ghost', 'good', 'easy', 'again', 'hard', 'new'];
const BROWSE_FLOW: FlowTone[] = ['new', 'again', 'hard', 'good', 'good', 'easy', 'again', 'new'];
const LABELS: Record<Exclude<FlowTone, 'ghost'>, string> = {
  new: 'New',
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
};

function FlowMarker({ tone, current = false, small = false }: { tone: FlowTone; current?: boolean; small?: boolean }) {
  return (
    <View style={styles.markerSlot}>
      {current ? <View style={styles.currentRay} /> : null}
      <View
        style={[
          small ? styles.markerSmall : styles.marker,
          tone === 'new' && styles.markerNew,
          tone === 'again' && styles.markerAgain,
          tone === 'hard' && styles.markerHard,
          tone === 'good' && styles.markerGood,
          tone === 'easy' && styles.markerEasy,
          tone === 'ghost' && styles.markerGhost,
          current && styles.markerCurrent,
        ]}
      />
      {current ? <View style={styles.currentPointer} /> : null}
    </View>
  );
}

export function FolioFlashcardPaper({
  question,
  answer,
  isRevealed = false,
  progressLabel,
  doodleLabel = 'FIND',
}: {
  question: string;
  answer?: string;
  isRevealed?: boolean;
  progressLabel: string;
  doodleLabel?: string;
}) {
  return (
    <View style={styles.cardStack}>
      <View style={[styles.stackSheet, styles.stackSheetBack]} />
      <View style={[styles.stackSheet, styles.stackSheetMid]} />
      <FolioCrayonSurface tone="cream" textureOpacity={0.07} style={styles.flashcard}>
        <View style={styles.flashcardContent}>
          <View style={styles.flashcardTopRow}>
            <FolioMark name="card-star" color={FOLIO.colors.blueCrayon} size={26} />
            <Text style={styles.cardProgress}>{progressLabel}</Text>
          </View>

          <View style={styles.questionArea}>
            <Text numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.74} style={styles.question}>
              {isRevealed && answer ? answer : question}
            </Text>
            <View style={styles.questionUnderline} />
            <Text style={styles.doodleLabel}>{doodleLabel}</Text>
          </View>

          <Text style={styles.revealHint}>{isRevealed ? 'Tap to see prompt' : 'Tap to reveal answer'}</Text>
        </View>
      </FolioCrayonSurface>
    </View>
  );
}

export function FolioDifficultyRow({ onGrade }: { onGrade: (grade: 'again' | 'hard' | 'good' | 'easy') => void }) {
  return (
    <View style={styles.difficultyRow}>
      <FolioButton label="Again" hint="< 1 min" icon="again" tone="warning" size="lg" onPress={() => onGrade('again')} style={styles.difficultyButton} />
      <FolioButton label="Hard" hint="5 min" icon="hard" tone="danger" size="lg" onPress={() => onGrade('hard')} style={styles.difficultyButton} />
      <FolioButton label="Good" hint="15 min" icon="good" tone="review" size="lg" onPress={() => onGrade('good')} style={styles.difficultyButton} />
      <FolioButton label="Easy" hint="4 d" icon="easy" tone="easy" size="lg" onPress={() => onGrade('easy')} style={styles.difficultyButton} />
    </View>
  );
}

export function FolioBrowseControls({ onPrevious, onFlip, onNext }: { onPrevious: () => void; onFlip: () => void; onNext: () => void }) {
  return (
    <View style={styles.browseControls}>
      <FolioButton label="Previous" icon="previous" tone="browse" size="md" onPress={onPrevious} style={styles.browseSideButton} />
      <FolioButton label="Flip card" icon="flip" tone="browse" size="md" onPress={onFlip} style={styles.browseFlipButton} />
      <FolioButton label="Next" icon="next" tone="browse" size="md" onPress={onNext} style={styles.browseSideButton} />
    </View>
  );
}

export function FolioTutorialModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { width, height } = useWindowDimensions();
  const useCompactGuideClose = width < 460 || height < 760;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.tutorialOverlay}>
        <View style={styles.tutorialCard}>
          <CrayonFill tone="review" variant="loose" opacity={0.2} />
          <View style={styles.tutorialHeader}>
            <View style={styles.tutorialTitleBlock}>
              <Text style={styles.tutorialEyebrow}>Beginner guide</Text>
              <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.82} numberOfLines={1} style={styles.tutorialTitle}>Spaced repetition basics</Text>
            </View>
            {useCompactGuideClose ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close help"
                onPress={onClose}
                style={({ pressed }) => [styles.tutorialCloseCircle, pressed && styles.pressed]}
              >
                <Text style={styles.tutorialCloseCircleText}>×</Text>
              </Pressable>
            ) : (
              <FolioButton label="Close" tone="warning" icon="close" size="pill" onPress={onClose} />
            )}
          </View>
          <Image source={SESSION_FLOW_TUTORIAL} resizeMode="contain" style={styles.tutorialImage} />
        </View>
      </View>
    </Modal>
  );
}

export function DeckTopicIcon({ deckName, size = 72 }: { deckName?: string; size?: number }) {
  const kind = inferDeckKind(deckName);
  const iconName = getDeckIconName(kind);
  const iconColor =
    kind === 'language'
      ? FOLIO.colors.orange
      : kind === 'programming'
        ? FOLIO.colors.greenDeep
        : FOLIO.colors.blueDeep;
  const secondaryColor =
    kind === 'language'
      ? FOLIO.colors.orangeCrayon
      : kind === 'programming'
        ? FOLIO.colors.greenCrayon
        : FOLIO.colors.blueCrayon;

  return (
    <View style={[styles.deckIconShell, { width: size, minHeight: size, borderRadius: Math.max(18, size * 0.24) }]}>
      <FolioSvgIcon
        name={iconName}
        size={Math.round(size * 0.78)}
        color={iconColor}
        secondaryColor={secondaryColor}
      />
    </View>
  );
}

function getDeckIconName(kind: ReturnType<typeof inferDeckKind>): FolioSvgIconName {
  if (kind === 'ai') return 'deck-ai';
  if (kind === 'language') return 'deck-language';
  if (kind === 'programming') return 'deck-programming';

  return 'deck-general';
}

function inferDeckKind(deckName?: string): 'ai' | 'language' | 'programming' | 'general' {
  const text = deckName?.toLowerCase() ?? '';

  if (/\b(ai|llm|model|retrieval|generation|embedding|agent|architecture|system|neural)\b/.test(text)) return 'ai';
  if (/\b(spanish|french|japanese|language|phrase|vocab|verb|grammar|anki|store help)\b/.test(text)) return 'language';
  if (/\b(python|javascript|typescript|react|sql|code|programming|function|variable)\b/.test(text)) return 'programming';

  return 'general';
}

export function FolioMark({ name, color = FOLIO.colors.blueDeep, size = 24 }: { name: FolioIconName; color?: string; size?: number }) {
  return <FolioSvgIcon name={name} color={color} size={size} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: FOLIO.colors.paper },
  screenContent: { paddingHorizontal: FOLIO.spacing.lg, gap: FOLIO.spacing.md },
  crayonSurface: { position: 'relative', overflow: 'hidden', borderWidth: 1, borderRadius: FOLIO.radius.xl, ...FOLIO.shadows.soft },
  crayonSurfaceContent: { position: 'relative', zIndex: 1 },
  button: { position: 'relative', overflow: 'hidden', borderWidth: 1, borderRadius: FOLIO.radius.lg, alignItems: 'center', justifyContent: 'center', ...FOLIO.shadows.soft },
  button_sm: { minWidth: 58, minHeight: 56, paddingHorizontal: 8, paddingVertical: 5 },
  button_md: { minHeight: 52, paddingHorizontal: 18, paddingVertical: 10 },
  button_lg: { minHeight: 94, paddingHorizontal: 14, paddingVertical: 12 },
  button_square: { width: 60, minHeight: 60, padding: 0 },
  button_pill: { minHeight: 46, paddingHorizontal: 18, paddingVertical: 8, borderRadius: FOLIO.radius.pill },
  buttonContent: { position: 'relative', zIndex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  buttonLabel: { fontSize: 17, lineHeight: 21, fontWeight: '900', textAlign: 'center' },
  buttonHint: { opacity: 0.88, fontSize: 12, lineHeight: 15, fontWeight: '800', textAlign: 'center' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
  pageIntro: { gap: 8 },
  eyebrow: { color: FOLIO.colors.blue, fontSize: 13, lineHeight: 16, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
  pageTitle: { color: FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900' },
  pageSubtitle: { color: FOLIO.colors.muted, fontSize: 16, lineHeight: 23 },
  toolbar: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: FOLIO.spacing.sm },
  toolbarBack: { flexShrink: 0 },
  toolbarTitle: { flex: 1, color: FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
  toolbarActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexShrink: 0 },
  toolbarAction: { width: 60 },
  toolbarHelp: { borderWidth: 2 },
  deckHero: { borderRadius: FOLIO.radius.xl },
  deckHeroContent: { flexDirection: 'row', alignItems: 'center', gap: FOLIO.spacing.md, paddingHorizontal: FOLIO.spacing.md, paddingVertical: 12 },
  deckHeroText: { flex: 1, gap: 4, minWidth: 0 },
  deckTitle: { color: FOLIO.colors.ink, fontSize: 25, lineHeight: 31, fontWeight: '900' },
  deckSubtitle: { color: FOLIO.colors.muted, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  deckSubtitleStrong: { color: FOLIO.colors.blueDeep },
  flowStrip: { borderRadius: FOLIO.radius.xl },
  flowHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: FOLIO.spacing.sm, paddingHorizontal: FOLIO.spacing.md, paddingTop: 12 },
  flowTitle: { color: FOLIO.colors.ink, fontSize: 18, lineHeight: 22, fontWeight: '900' },
  flowUnderline: { height: 3, marginTop: 5, borderRadius: 999, backgroundColor: FOLIO.colors.blueDeep },
  flowHelper: { flex: 1, color: FOLIO.colors.muted, fontSize: 13, lineHeight: 17, fontWeight: '800', textAlign: 'center' },
  flowCount: { color: FOLIO.colors.blueDeep, fontSize: 15, lineHeight: 20, fontWeight: '900', textAlign: 'right' },
  flowCards: { flexDirection: 'row', justifyContent: 'center', gap: 7, paddingTop: 12, paddingHorizontal: 8 },
  markerSlot: { width: 17, alignItems: 'center' },
  marker: { width: 16, height: 28, borderRadius: 7, borderWidth: 1.5 },
  markerSmall: { width: 14, height: 24, borderRadius: 6, borderWidth: 1.5 },
  markerNew: { backgroundColor: FOLIO.colors.card, borderColor: FOLIO.colors.border },
  markerAgain: { backgroundColor: FOLIO.colors.orangeSoft, borderColor: FOLIO.colors.orangeCrayon },
  markerHard: { backgroundColor: FOLIO.colors.coralSoft, borderColor: FOLIO.colors.coralCrayon },
  markerGood: { backgroundColor: FOLIO.colors.blueSoft, borderColor: FOLIO.colors.blueCrayon },
  markerEasy: { backgroundColor: FOLIO.colors.greenSoft, borderColor: FOLIO.colors.greenCrayon },
  markerGhost: { backgroundColor: 'transparent', borderColor: FOLIO.colors.blueCrayon, borderStyle: 'dashed' },
  markerCurrent: { borderColor: FOLIO.colors.blueDeep, borderWidth: 2.5 },
  currentRay: { width: 4, height: 10, borderRadius: 999, backgroundColor: FOLIO.colors.blueDeep, marginBottom: 2 },
  currentPointer: { width: 0, height: 0, borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: FOLIO.colors.blueDeep, transform: [{ rotate: '180deg' }], marginTop: 2 },
  flowLegend: { flexDirection: 'row', justifyContent: 'space-around', gap: 4, paddingHorizontal: 8, paddingTop: 10, paddingBottom: 12 },
  flowLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  flowLegendText: { color: FOLIO.colors.muted, fontSize: 12, lineHeight: 15, fontWeight: '800' },
  browseModeNote: { color: FOLIO.colors.blueDeep, fontSize: 14, lineHeight: 18, fontWeight: '900', textAlign: 'center', paddingTop: 10, paddingBottom: 12 },
  cardStack: { position: 'relative' },
  stackSheet: { position: 'absolute', left: 18, right: 18, height: 28, bottom: -12, borderRadius: FOLIO.radius.xl, backgroundColor: FOLIO.colors.card, borderWidth: 1, borderColor: FOLIO.colors.border, opacity: 0.6 },
  stackSheetBack: { bottom: -18, opacity: 0.28 },
  stackSheetMid: { bottom: -10, opacity: 0.42 },
  flashcard: { borderRadius: FOLIO.radius.xl, minHeight: 330, backgroundColor: FOLIO.colors.card },
  flashcardContent: { minHeight: 330, paddingHorizontal: FOLIO.spacing.xl, paddingVertical: FOLIO.spacing.lg, justifyContent: 'space-between' },
  flashcardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardProgress: { color: FOLIO.colors.muted, fontSize: 28, lineHeight: 34, fontWeight: '900' },
  questionArea: { alignItems: 'center', justifyContent: 'center', gap: 14 },
  question: { color: FOLIO.colors.ink, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
  questionUnderline: { width: '52%', height: 3, borderRadius: 999, backgroundColor: FOLIO.colors.blueCrayon },
  doodleLabel: { color: FOLIO.colors.blueDeep, fontSize: 16, lineHeight: 20, fontWeight: '900', letterSpacing: 0.5 },
  revealHint: { color: FOLIO.colors.muted, fontSize: 18, lineHeight: 23, fontWeight: '800', textAlign: 'center' },
  difficultyRow: { flexDirection: 'row', gap: 9 },
  difficultyButton: { flex: 1, minHeight: 94, borderRadius: FOLIO.radius.lg },
  browseControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  browseSideButton: { flex: 1, minHeight: 58, borderRadius: FOLIO.radius.lg },
  browseFlipButton: { flex: 1.35, minHeight: 64, borderRadius: FOLIO.radius.lg, borderWidth: 2 },
  tutorialOverlay: { flex: 1, backgroundColor: 'rgba(42,36,31,0.42)', padding: FOLIO.spacing.lg, justifyContent: 'center' },
  tutorialCard: { position: 'relative', overflow: 'hidden', borderRadius: FOLIO.radius.xl, backgroundColor: FOLIO.colors.card, borderColor: '#D8C8A9', borderWidth: 1, padding: FOLIO.spacing.md, gap: FOLIO.spacing.md, ...FOLIO.shadows.card },
  tutorialHeader: { position: 'relative', zIndex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: FOLIO.spacing.sm },
  tutorialTitleBlock: { flex: 1, minWidth: 0, paddingRight: 2 },
  tutorialEyebrow: { color: '#7A6D5E', fontSize: 13, lineHeight: 17, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
  tutorialTitle: { color: FOLIO.colors.ink, fontFamily: FOLIO_HAND_FONT, fontSize: 25, lineHeight: 31, fontWeight: '400' },
  tutorialImage: { position: 'relative', zIndex: 1, width: '100%', minHeight: 420, maxHeight: 620, borderRadius: FOLIO.radius.lg },
  tutorialCloseCircle: { alignItems: 'center', backgroundColor: FOLIO.colors.orangeSoft, borderColor: FOLIO.colors.orange, borderRadius: FOLIO.radius.pill, borderWidth: 2, flexShrink: 0, height: 36, justifyContent: 'center', width: 36 },
  tutorialCloseCircleText: { color: FOLIO.colors.orange, fontSize: 24, fontWeight: '900', lineHeight: 27, textAlign: 'center' },
  deckIconShell: { alignItems: 'center', justifyContent: 'center', backgroundColor: FOLIO.colors.card, borderColor: FOLIO.colors.blueCrayon, borderWidth: 1 },
});
