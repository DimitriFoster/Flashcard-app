"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeCreateSection = HomeCreateSection;
/**
 * HomeCreateSection.
 *
 * This component handles the card/deck creation UI on the home screen.
 *
 * Important React pattern:
 * - The component owns temporary form state such as text inputs and expanded panels.
 * - The parent Home screen owns saved app state such as decks and cards.
 *
 * This keeps the form responsive while still letting the parent refresh the rest
 * of the screen after a deck or card is created.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var design_1 = require("@/constants/design");
var create_section_styles_1 = require("./create-section.styles");
/** Count cards for one deck. Used by the horizontal deck picker chips. */
function getDeckCardCount(deckId, cards) {
    return cards.filter(function (card) { return card.deckId === deckId; }).length;
}
function HomeCreateSection(_a) {
    var _b;
    var decks = _a.decks, cards = _a.cards, selectedDeck = _a.selectedDeck, onSelectDeckId = _a.onSelectDeckId, onCreateDeck = _a.onCreateDeck, onCreateCard = _a.onCreateCard;
    /**
     * The create area starts collapsed so the home screen feels simple and inviting.
     * Tapping the green create panel reveals the detailed form.
     */
    var _c = (0, react_1.useState)(false), showCreateDetails = _c[0], setShowCreateDetails = _c[1];
    /**
     * These pairs separate "visible state" from "mounted/rendered state".
     * That allows the panel to animate closed before it is removed from the tree.
     */
    var _d = (0, react_1.useState)(false), showDeckPicker = _d[0], setShowDeckPicker = _d[1];
    var _e = (0, react_1.useState)(false), isDeckPickerRendered = _e[0], setIsDeckPickerRendered = _e[1];
    var _f = (0, react_1.useState)(false), showNewDeckForm = _f[0], setShowNewDeckForm = _f[1];
    var _g = (0, react_1.useState)(false), isNewDeckFormRendered = _g[0], setIsNewDeckFormRendered = _g[1];
    /** Controlled inputs for creating decks and cards. */
    var _h = (0, react_1.useState)(''), deckName = _h[0], setDeckName = _h[1];
    var _j = (0, react_1.useState)(''), front = _j[0], setFront = _j[1];
    var _k = (0, react_1.useState)(''), back = _k[0], setBack = _k[1];
    var _l = (0, react_1.useState)(''), statusMessage = _l[0], setStatusMessage = _l[1];
    /**
     * Animated.Value objects persist across renders with useRef.
     * They drive chevron rotation, panel height, opacity, and slide-in movement.
     */
    var deckPickerProgress = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var newDeckProgress = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var statusTimeoutRef = (0, react_1.useRef)(null);
    var addCardButtonLabel = selectedDeck ? "Add to ".concat(selectedDeck.name) : 'Choose a deck first';
    (0, react_1.useEffect)(function () {
        return function () {
            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);
    function showStatus(message) {
        setStatusMessage(message);
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = setTimeout(function () {
            setStatusMessage('');
        }, 1500);
    }
    function toggleDeckPicker() {
        var nextValue = showDeckPicker ? 0 : 1;
        if (!showDeckPicker) {
            setIsDeckPickerRendered(true);
        }
        setShowDeckPicker(!showDeckPicker);
        react_native_1.Animated.timing(deckPickerProgress, {
            toValue: nextValue,
            duration: design_1.MOTION.fast,
            easing: react_native_1.Easing.out(react_native_1.Easing.quad),
            /**
             * Height animation cannot use the native driver.
             * Native driver only supports transform and opacity.
             */
            useNativeDriver: false,
        }).start(function (_a) {
            var finished = _a.finished;
            if (finished && nextValue === 0) {
                setIsDeckPickerRendered(false);
            }
        });
    }
    function toggleNewDeckForm() {
        var nextValue = showNewDeckForm ? 0 : 1;
        if (!showNewDeckForm) {
            setIsNewDeckFormRendered(true);
        }
        setShowNewDeckForm(!showNewDeckForm);
        react_native_1.Animated.timing(newDeckProgress, {
            toValue: nextValue,
            duration: design_1.MOTION.fast,
            easing: react_native_1.Easing.out(react_native_1.Easing.quad),
            useNativeDriver: false,
        }).start(function (_a) {
            var finished = _a.finished;
            if (finished && nextValue === 0) {
                setIsNewDeckFormRendered(false);
            }
        });
    }
    function toggleCreateSection() {
        setShowCreateDetails(function (current) { return !current; });
    }
    function createDeck() {
        var name = deckName.trim();
        /** Avoid creating empty decks from whitespace-only input. */
        if (!name) {
            return;
        }
        var deck = onCreateDeck(name);
        if (deck) {
            /** New decks become the active destination for card creation. */
            onSelectDeckId(deck.id);
            setDeckName('');
            showStatus("Deck created: ".concat(deck.name, " \u2713"));
            /** Collapse the new deck form after successful creation. */
            setShowNewDeckForm(false);
            react_native_1.Animated.timing(newDeckProgress, {
                toValue: 0,
                duration: design_1.MOTION.fast,
                easing: react_native_1.Easing.out(react_native_1.Easing.quad),
                useNativeDriver: false,
            }).start(function (_a) {
                var finished = _a.finished;
                if (finished) {
                    setIsNewDeckFormRendered(false);
                }
            });
            /** Show the deck picker so the user can see the deck they just created. */
            setShowDeckPicker(true);
            setIsDeckPickerRendered(true);
            react_native_1.Animated.timing(deckPickerProgress, {
                toValue: 1,
                duration: design_1.MOTION.fast,
                easing: react_native_1.Easing.out(react_native_1.Easing.quad),
                useNativeDriver: false,
            }).start();
        }
    }
    function createCard() {
        var nextFront = front.trim();
        var nextBack = back.trim();
        /** A card needs a target deck, a prompt, and an answer. */
        if (!selectedDeck || !nextFront || !nextBack) {
            return;
        }
        var card = onCreateCard({
            deckId: selectedDeck.id,
            front: nextFront,
            back: nextBack,
        });
        if (card) {
            /** Clear the card form so the user can quickly enter the next card. */
            setFront('');
            setBack('');
            showStatus("Added to ".concat(selectedDeck.name, " \u2713"));
        }
    }
    return (<>
      {showCreateDetails ? (<react_native_1.View style={[create_section_styles_1.styles.section, create_section_styles_1.styles.createSection]}>
          <react_native_1.Pressable accessibilityRole="button" onPress={toggleCreateSection} style={function (_a) {
            var pressed = _a.pressed;
            return [create_section_styles_1.styles.sectionHeader, pressed && create_section_styles_1.styles.pressed];
        }}>
            <react_native_1.Text style={create_section_styles_1.styles.sectionLabel}>create</react_native_1.Text>
            <react_native_1.Text style={create_section_styles_1.styles.sectionKicker}>Choose a deck or start a new one.</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.View style={create_section_styles_1.styles.createBody}>
            <react_native_1.View style={create_section_styles_1.styles.destinationRow}>
              <react_native_1.Text style={create_section_styles_1.styles.destinationLabel}>Deck</react_native_1.Text>
              <react_native_1.Text style={create_section_styles_1.styles.destinationValue}>{(_b = selectedDeck === null || selectedDeck === void 0 ? void 0 : selectedDeck.name) !== null && _b !== void 0 ? _b : 'No deck selected'}</react_native_1.Text>
            </react_native_1.View>

            <react_native_1.TextInput multiline placeholder="Front: prompt, term, or question" value={front} onChangeText={setFront} style={[create_section_styles_1.styles.input, create_section_styles_1.styles.frontInput]} placeholderTextColor={create_section_styles_1.COLORS.muted}/>

            <react_native_1.TextInput multiline placeholder="Back: answer, explanation, or clue" value={back} onChangeText={setBack} style={[create_section_styles_1.styles.input, create_section_styles_1.styles.backInput]} placeholderTextColor={create_section_styles_1.COLORS.muted}/>

            <react_native_1.View style={create_section_styles_1.styles.dropdownToggleRow}>
              <react_native_1.Pressable accessibilityRole="button" onPress={toggleNewDeckForm} style={function (_a) {
                var pressed = _a.pressed;
                return [
                    create_section_styles_1.styles.compactToggle,
                    create_section_styles_1.styles.compactToggleNarrow,
                    pressed && create_section_styles_1.styles.pressed,
                ];
            }}>
                <react_native_1.Text style={create_section_styles_1.styles.deckPickerToggleText}>New deck</react_native_1.Text>
                <react_native_1.Animated.Text style={[
                create_section_styles_1.styles.deckPickerToggleChevron,
                {
                    transform: [
                        {
                            rotate: newDeckProgress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '180deg'],
                            }),
                        },
                    ],
                },
            ]}>
                  v
                </react_native_1.Animated.Text>
              </react_native_1.Pressable>

              <react_native_1.Pressable accessibilityRole="button" onPress={toggleDeckPicker} style={function (_a) {
                var pressed = _a.pressed;
                return [
                    create_section_styles_1.styles.compactToggle,
                    create_section_styles_1.styles.compactToggleWide,
                    pressed && create_section_styles_1.styles.pressed,
                ];
            }}>
                <react_native_1.Text style={create_section_styles_1.styles.deckPickerToggleText}>Pick deck</react_native_1.Text>
                <react_native_1.Animated.Text style={[
                create_section_styles_1.styles.deckPickerToggleChevron,
                {
                    transform: [
                        {
                            rotate: deckPickerProgress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '180deg'],
                            }),
                        },
                    ],
                },
            ]}>
                  v
                </react_native_1.Animated.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {isNewDeckFormRendered ? (<react_native_1.Animated.View style={[
                    create_section_styles_1.styles.newDeckPanel,
                    {
                        height: newDeckProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 136],
                        }),
                        opacity: newDeckProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                        transform: [
                            {
                                translateY: newDeckProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-8, 0],
                                }),
                            },
                        ],
                    },
                ]}>
                <react_native_1.TextInput placeholder="New deck name" value={deckName} onChangeText={setDeckName} style={[create_section_styles_1.styles.input, create_section_styles_1.styles.deckNameInput]} placeholderTextColor={create_section_styles_1.COLORS.muted} returnKeyType="done" onSubmitEditing={createDeck}/>
                <react_native_1.Pressable accessibilityRole="button" onPress={createDeck} style={function (_a) {
                var pressed = _a.pressed;
                return [create_section_styles_1.styles.deckButton, pressed && create_section_styles_1.styles.pressed];
            }}>
                  <react_native_1.Text style={create_section_styles_1.styles.deckButtonText}>Create deck</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.Animated.View>) : null}

            {isDeckPickerRendered ? (<react_native_1.Animated.View style={[
                    create_section_styles_1.styles.deckPickerPanel,
                    {
                        height: deckPickerProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 188],
                        }),
                        opacity: deckPickerProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                        transform: [
                            {
                                translateY: deckPickerProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-8, 0],
                                }),
                            },
                        ],
                    },
                ]}>
                <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={create_section_styles_1.styles.deckPicker}>
                  {decks.map(function (deck) {
                    var active = deck.id === (selectedDeck === null || selectedDeck === void 0 ? void 0 : selectedDeck.id);
                    return (<react_native_1.Pressable key={deck.id} accessibilityRole="button" onPress={function () { return onSelectDeckId(deck.id); }} style={function (_a) {
                            var pressed = _a.pressed;
                            return [
                                create_section_styles_1.styles.deckChip,
                                active && create_section_styles_1.styles.deckChipActive,
                                pressed && create_section_styles_1.styles.pressed,
                            ];
                        }}>
                        <react_native_1.Text style={[create_section_styles_1.styles.deckChipText, active && create_section_styles_1.styles.deckChipTextActive]}>
                          {deck.name}
                        </react_native_1.Text>
                        <react_native_1.Text style={create_section_styles_1.styles.deckChipCount}>
                          {getDeckCardCount(deck.id, cards)} cards
                        </react_native_1.Text>
                      </react_native_1.Pressable>);
                })}
                </react_native_1.ScrollView>

                <react_native_1.Pressable accessibilityRole="button" accessibilityState={{ disabled: !selectedDeck }} disabled={!selectedDeck} onPress={createCard} style={function (_a) {
                    var pressed = _a.pressed;
                    return [
                        create_section_styles_1.styles.primaryButton,
                        !selectedDeck && create_section_styles_1.styles.primaryButtonDisabled,
                        pressed && selectedDeck && create_section_styles_1.styles.pressed,
                    ];
                }}>
                  <react_native_1.Text style={[
                    create_section_styles_1.styles.primaryButtonText,
                    !selectedDeck && create_section_styles_1.styles.primaryButtonTextDisabled,
                ]}>
                    {addCardButtonLabel}
                  </react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.Animated.View>) : null}

            {statusMessage ? <react_native_1.Text style={create_section_styles_1.styles.statusMessage}>{statusMessage}</react_native_1.Text> : null}

            <react_native_1.View style={create_section_styles_1.styles.deckSummary}>
              <react_native_1.Text style={create_section_styles_1.styles.metric}>{decks.length}</react_native_1.Text>
              <react_native_1.Text style={create_section_styles_1.styles.metricLabel}>decks</react_native_1.Text>
              <react_native_1.Text style={create_section_styles_1.styles.metric}>{cards.length}</react_native_1.Text>
              <react_native_1.Text style={create_section_styles_1.styles.metricLabel}>total cards</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>) : (<react_native_1.Pressable accessibilityRole="button" onPress={toggleCreateSection} style={function (_a) {
                var pressed = _a.pressed;
                return [
                    create_section_styles_1.styles.section,
                    create_section_styles_1.styles.createCollapsedSection,
                    pressed && create_section_styles_1.styles.pressed,
                ];
            }}>
          <react_native_1.Text style={[create_section_styles_1.styles.sectionLabel, create_section_styles_1.styles.createCollapsedLabel]}>create</react_native_1.Text>
          <react_native_1.Text style={create_section_styles_1.styles.createCollapsedText}>Choose a deck or start a new one.</react_native_1.Text>
        </react_native_1.Pressable>)}
    </>);
}
