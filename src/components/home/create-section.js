"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeCreateSection = HomeCreateSection;
var react_1 = require("react");
var react_native_1 = require("react-native");
var home_panel_fill_1 = require("@/components/home/home-panel-fill");
var create_section_styles_1 = require("./create-section.styles");
var createPanelSwatch = require('../../../assets/folio-ui/home-page/open-create/open_create_panel_swatch.png');
var createCirclePencil = require('../../../assets/folio-ui/home-page/open-create/create_circle_pencil.png');
var createArrowRight = require('../../../assets/folio-ui/home-page/open-create/create_arrow_right.png');
var createCaretDown = require('../../../assets/folio-ui/home-page/open-create/create_caret_down.png');
var createNewDeckIcon = require('../../../assets/folio-ui/home-page/open-create/create_new_deck_icon.png');
var createImportDeckIcon = require('../../../assets/folio-ui/home-page/open-create/create_import_deck_icon.png');
var createUseTemplateIcon = require('../../../assets/folio-ui/home-page/open-create/create_use_template_icon.png');
var createSmallPencil = require('../../../assets/folio-ui/home-page/open-create/create_small_pencil.png');
var createMagicWand = require('../../../assets/folio-ui/home-page/open-create/create_magic_wand.png');
function HomeCreateSection(_a) {
    var onCreateDeck = _a.onCreateDeck, onSelectDeckId = _a.onSelectDeckId;
    var _b = (0, react_1.useState)(true), showCreateDetails = _b[0], setShowCreateDetails = _b[1];
    var _c = (0, react_1.useState)('new'), selectedOption = _c[0], setSelectedOption = _c[1];
    var _d = (0, react_1.useState)(''), deckName = _d[0], setDeckName = _d[1];
    var _e = (0, react_1.useState)(''), statusMessage = _e[0], setStatusMessage = _e[1];
    var statusTimeoutRef = (0, react_1.useRef)(null);
    function showStatus(message) {
        setStatusMessage(message);
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }
        statusTimeoutRef.current = setTimeout(function () { return setStatusMessage(''); }, 1800);
    }
    function toggleCreateSection() {
        setShowCreateDetails(function (current) { return !current; });
    }
    function createDeck() {
        if (selectedOption !== 'new') {
            showStatus(selectedOption === 'import' ? 'Import deck panel coming next' : 'Template panel coming next');
            return;
        }
        var name = deckName.trim();
        if (!name) {
            showStatus('Enter a deck title first');
            return;
        }
        var deck = onCreateDeck(name);
        if (!deck) {
            showStatus('Could not create deck');
            return;
        }
        onSelectDeckId(deck.id);
        setDeckName('');
        showStatus("Deck created: ".concat(deck.name, " \u2713"));
    }
    var options = [
        {
            id: 'new',
            title: 'New deck',
            subtitle: 'Start a blank deck\nfrom scratch.',
            icon: createNewDeckIcon,
        },
        {
            id: 'import',
            title: 'Import deck',
            subtitle: 'Add cards from a\nfile or other app.',
            icon: createImportDeckIcon,
        },
        {
            id: 'template',
            title: 'Use template',
            subtitle: 'Choose a template\nto get started.',
            icon: createUseTemplateIcon,
        },
    ];
    if (!showCreateDetails) {
        return (<react_native_1.Pressable accessibilityRole="button" onPress={toggleCreateSection} style={function (_a) {
            var pressed = _a.pressed;
            return [create_section_styles_1.styles.collapsedSection, pressed && create_section_styles_1.styles.pressed];
        }}>
        <home_panel_fill_1.HomePanelFill source={createPanelSwatch} opacity={1}/>

        <react_native_1.View style={create_section_styles_1.styles.topRow}>
          <react_native_1.View style={create_section_styles_1.styles.topIconWrap}>
            <react_native_1.Image source={createCirclePencil} style={create_section_styles_1.styles.topIcon} resizeMode="contain"/>
          </react_native_1.View>

          <react_native_1.View style={create_section_styles_1.styles.topTextWrap}>
            <react_native_1.Text style={create_section_styles_1.styles.topTitle}>create</react_native_1.Text>
            <react_native_1.Text style={create_section_styles_1.styles.topSubtitle}>Choose a deck or start{"\n"}a new one.</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.Image source={createArrowRight} style={create_section_styles_1.styles.topArrow} resizeMode="contain"/>
        </react_native_1.View>
      </react_native_1.Pressable>);
    }
    return (<react_native_1.View style={create_section_styles_1.styles.panelShell}>
      <home_panel_fill_1.HomePanelFill source={createPanelSwatch} opacity={1}/>

      <react_native_1.Pressable accessibilityRole="button" onPress={toggleCreateSection} style={function (_a) {
        var pressed = _a.pressed;
        return [create_section_styles_1.styles.headerPressable, pressed && create_section_styles_1.styles.pressed];
    }}>
        <react_native_1.View style={create_section_styles_1.styles.topRow}>
          <react_native_1.View style={create_section_styles_1.styles.topIconWrap}>
            <react_native_1.Image source={createCirclePencil} style={create_section_styles_1.styles.topIcon} resizeMode="contain"/>
          </react_native_1.View>

          <react_native_1.View style={create_section_styles_1.styles.topTextWrap}>
            <react_native_1.Text style={create_section_styles_1.styles.topTitle}>create</react_native_1.Text>
            <react_native_1.Text style={create_section_styles_1.styles.topSubtitle}>Choose a deck or start{"\n"}a new one.</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.Image source={createArrowRight} style={create_section_styles_1.styles.topArrow} resizeMode="contain"/>
        </react_native_1.View>
      </react_native_1.Pressable>

      <react_native_1.View style={create_section_styles_1.styles.divider}/>
      <react_native_1.View style={create_section_styles_1.styles.caretWrap}>
        <react_native_1.Image source={createCaretDown} style={create_section_styles_1.styles.caretIcon} resizeMode="contain"/>
      </react_native_1.View>

      <react_native_1.View style={create_section_styles_1.styles.body}>
        <react_native_1.Text style={create_section_styles_1.styles.sectionHeading}>CREATE A NEW DECK</react_native_1.Text>
        <react_native_1.Text style={create_section_styles_1.styles.sectionIntro}>Start from scratch, import, or use a template.</react_native_1.Text>

        <react_native_1.View style={create_section_styles_1.styles.optionRow}>
          {options.map(function (option) {
            var active = option.id === selectedOption;
            return (<react_native_1.Pressable key={option.id} accessibilityRole="button" onPress={function () { return setSelectedOption(option.id); }} style={function (_a) {
                var pressed = _a.pressed;
                return [create_section_styles_1.styles.optionCard, active && create_section_styles_1.styles.optionCardActive, pressed && create_section_styles_1.styles.pressed];
            }}>
                <react_native_1.Image source={option.icon} style={create_section_styles_1.styles.optionIcon} resizeMode="contain"/>
                <react_native_1.Text style={create_section_styles_1.styles.optionTitle}>{option.title}</react_native_1.Text>
                <react_native_1.Text style={create_section_styles_1.styles.optionSubtitle}>{option.subtitle}</react_native_1.Text>
              </react_native_1.Pressable>);
        })}
        </react_native_1.View>

        <react_native_1.View style={create_section_styles_1.styles.bodyDivider}/>

        <react_native_1.Text style={create_section_styles_1.styles.fieldLabel}>Deck title</react_native_1.Text>

        <react_native_1.View style={create_section_styles_1.styles.inputWrap}>
          <react_native_1.TextInput placeholder="e.g., Biology Chapter 1" placeholderTextColor="#8A8E84" value={deckName} onChangeText={setDeckName} style={create_section_styles_1.styles.input} returnKeyType="done" onSubmitEditing={createDeck}/>
          <react_native_1.Image source={createSmallPencil} style={create_section_styles_1.styles.inputIcon} resizeMode="contain"/>
        </react_native_1.View>

        <react_native_1.Text style={create_section_styles_1.styles.helperText}>You can always change this later.</react_native_1.Text>

        <react_native_1.View style={create_section_styles_1.styles.actionRow}>
          <react_native_1.Pressable accessibilityRole="button" onPress={createDeck} style={function (_a) {
        var pressed = _a.pressed;
        return [create_section_styles_1.styles.createButton, pressed && create_section_styles_1.styles.pressed];
    }}>
            <react_native_1.Text style={create_section_styles_1.styles.createButtonText}>Create deck</react_native_1.Text>
            <react_native_1.Image source={createMagicWand} style={create_section_styles_1.styles.createButtonIcon} resizeMode="contain"/>
          </react_native_1.Pressable>
        </react_native_1.View>

        {statusMessage ? (<react_native_1.View style={create_section_styles_1.styles.statusMessage}>
            <react_native_1.Text style={create_section_styles_1.styles.statusMessageText}>{statusMessage}</react_native_1.Text>
          </react_native_1.View>) : null}
      </react_native_1.View>
    </react_native_1.View>);
}
