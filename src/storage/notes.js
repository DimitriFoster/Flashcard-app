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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
exports.getNotebooks = getNotebooks;
exports.saveNote = saveNote;
exports.deleteNote = deleteNote;
exports.renameNotebook = renameNotebook;
exports.moveNoteOutOfNotebook = moveNoteOutOfNotebook;
exports.deleteNotebook = deleteNotebook;
exports.moveNoteToNotebook = moveNoteToNotebook;
exports.groupNotesIntoNotebook = groupNotesIntoNotebook;
/**
 * Local note storage helpers.
 *
 * Screens should use these helpers instead of reading/writing MMKV directly.
 * The notes feature is separate from flashcards so the app can support quick,
 * freeform capture without forcing every thought into a card immediately.
 */
var react_native_1 = require("react-native");
var mmkv_1 = require("./mmkv");
var NOTES_KEY = 'notes';
var NOTEBOOKS_KEY = 'note-notebooks';
function parseJsonArray(value) {
    if (!value) {
        return [];
    }
    try {
        var parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (_a) {
        return [];
    }
}
function canUseStorage() {
    return react_native_1.Platform.OS !== 'web' || typeof window !== 'undefined';
}
function createId(prefix) {
    return "".concat(prefix, "-").concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 10));
}
function createTitle(body) {
    var firstMeaningfulLine = body
        .split('\n')
        .map(function (line) { return line.trim(); })
        .find(Boolean);
    if (!firstMeaningfulLine) {
        return 'Untitled note';
    }
    return firstMeaningfulLine.length > 42
        ? "".concat(firstMeaningfulLine.slice(0, 41), "\u2026")
        : firstMeaningfulLine;
}
function normalizeNote(note) {
    var _a, _b, _c, _d, _e;
    var now = new Date().toISOString();
    var body = (_a = note.body) !== null && _a !== void 0 ? _a : '';
    return {
        id: (_b = note.id) !== null && _b !== void 0 ? _b : createId('note'),
        title: ((_c = note.title) === null || _c === void 0 ? void 0 : _c.trim()) || createTitle(body),
        body: body,
        createdAt: (_d = note.createdAt) !== null && _d !== void 0 ? _d : now,
        updatedAt: (_e = note.updatedAt) !== null && _e !== void 0 ? _e : now,
        notebookId: note.notebookId,
    };
}
function normalizeNotebook(notebook) {
    var _a, _b, _c, _d;
    var now = new Date().toISOString();
    return {
        id: (_a = notebook.id) !== null && _a !== void 0 ? _a : createId('notebook'),
        name: ((_b = notebook.name) === null || _b === void 0 ? void 0 : _b.trim()) || 'Notebook',
        createdAt: (_c = notebook.createdAt) !== null && _c !== void 0 ? _c : now,
        updatedAt: (_d = notebook.updatedAt) !== null && _d !== void 0 ? _d : now,
    };
}
function saveNotes(notes) {
    mmkv_1.storage.set(NOTES_KEY, JSON.stringify(notes));
}
function saveNotebooks(notebooks) {
    mmkv_1.storage.set(NOTEBOOKS_KEY, JSON.stringify(notebooks));
}
function getNotes() {
    if (!canUseStorage()) {
        return [];
    }
    var rawNotes = parseJsonArray(mmkv_1.storage.getString(NOTES_KEY));
    var notes = rawNotes.map(normalizeNote);
    var sortedNotes = __spreadArray([], notes, true).sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); });
    var needsMigration = rawNotes.some(function (note, index) {
        return note.id !== notes[index].id ||
            note.title !== notes[index].title ||
            note.body !== notes[index].body ||
            note.createdAt !== notes[index].createdAt ||
            note.updatedAt !== notes[index].updatedAt ||
            note.notebookId !== notes[index].notebookId;
    });
    if (needsMigration) {
        saveNotes(sortedNotes);
    }
    return sortedNotes;
}
function getNotebooks() {
    if (!canUseStorage()) {
        return [];
    }
    var rawNotebooks = parseJsonArray(mmkv_1.storage.getString(NOTEBOOKS_KEY));
    var notebooks = rawNotebooks.map(normalizeNotebook);
    var knownNotebookIds = new Set(notebooks.map(function (notebook) { return notebook.id; }));
    /**
     * If notes reference notebook IDs that do not exist yet, recover small
     * placeholder notebooks so grouped notes remain reachable.
     */
    var recoveredNotebooks = getNotes()
        .map(function (note) { return note.notebookId; })
        .filter(function (notebookId) { return Boolean(notebookId); })
        .filter(function (notebookId) { return !knownNotebookIds.has(notebookId); })
        .map(function (notebookId) {
        return normalizeNotebook({
            id: notebookId,
            name: 'Recovered notebook',
        });
    });
    var nextNotebooks = __spreadArray(__spreadArray([], notebooks, true), recoveredNotebooks, true).sort(function (a, b) {
        return b.updatedAt.localeCompare(a.updatedAt);
    });
    if (recoveredNotebooks.length > 0 || rawNotebooks.length !== nextNotebooks.length) {
        saveNotebooks(nextNotebooks);
    }
    return nextNotebooks;
}
function saveNote(input) {
    var _a, _b, _c, _d;
    if (!canUseStorage()) {
        throw new Error('Note storage is only available on the client.');
    }
    var body = input.body;
    var now = new Date().toISOString();
    var notes = getNotes();
    var existingNote = input.id ? notes.find(function (note) { return note.id === input.id; }) : undefined;
    var nextNote = {
        id: (_b = (_a = existingNote === null || existingNote === void 0 ? void 0 : existingNote.id) !== null && _a !== void 0 ? _a : input.id) !== null && _b !== void 0 ? _b : createId('note'),
        title: createTitle(body),
        body: body,
        createdAt: (_c = existingNote === null || existingNote === void 0 ? void 0 : existingNote.createdAt) !== null && _c !== void 0 ? _c : now,
        updatedAt: now,
        notebookId: (_d = input.notebookId) !== null && _d !== void 0 ? _d : existingNote === null || existingNote === void 0 ? void 0 : existingNote.notebookId,
    };
    var nextNotes = existingNote
        ? notes.map(function (note) { return (note.id === existingNote.id ? nextNote : note); })
        : __spreadArray([nextNote], notes, true);
    saveNotes(__spreadArray([], nextNotes, true).sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    return nextNote;
}
function deleteNote(id) {
    if (!canUseStorage()) {
        return false;
    }
    var notes = getNotes();
    var noteToDelete = notes.find(function (note) { return note.id === id; });
    var nextNotes = notes.filter(function (note) { return note.id !== id; });
    if (!noteToDelete || nextNotes.length === notes.length) {
        return false;
    }
    saveNotes(nextNotes);
    /**
     * Remove empty notebooks so the sidebar does not collect dead groups.
     */
    if (noteToDelete.notebookId) {
        var hasRemainingNotes = nextNotes.some(function (note) { return note.notebookId === noteToDelete.notebookId; });
        if (!hasRemainingNotes) {
            saveNotebooks(getNotebooks().filter(function (notebook) { return notebook.id !== noteToDelete.notebookId; }));
        }
    }
    return true;
}
function renameNotebook(id, name) {
    if (!canUseStorage()) {
        return undefined;
    }
    var trimmedName = name.trim() || 'Notebook';
    var now = new Date().toISOString();
    var renamedNotebook;
    var notebooks = getNotebooks().map(function (notebook) {
        if (notebook.id !== id) {
            return notebook;
        }
        renamedNotebook = __assign(__assign({}, notebook), { name: trimmedName, updatedAt: now });
        return renamedNotebook;
    });
    if (renamedNotebook) {
        saveNotebooks(notebooks);
    }
    return renamedNotebook;
}
function moveNoteOutOfNotebook(noteId) {
    if (!canUseStorage()) {
        return undefined;
    }
    var now = new Date().toISOString();
    var movedNote;
    var nextNotes = getNotes().map(function (note) {
        if (note.id !== noteId) {
            return note;
        }
        movedNote = __assign(__assign({}, note), { notebookId: undefined, updatedAt: now });
        return movedNote;
    });
    if (!movedNote) {
        return undefined;
    }
    var remainingNotebookIds = new Set(nextNotes
        .map(function (note) { return note.notebookId; })
        .filter(function (notebookId) { return Boolean(notebookId); }));
    var nextNotebooks = getNotebooks().filter(function (notebook) { return remainingNotebookIds.has(notebook.id); });
    saveNotes(nextNotes.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    saveNotebooks(nextNotebooks.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    return {
        notes: getNotes(),
        notebooks: getNotebooks(),
        note: movedNote,
    };
}
function deleteNotebook(id) {
    if (!canUseStorage()) {
        return undefined;
    }
    var notebooks = getNotebooks();
    var notebookToDelete = notebooks.find(function (notebook) { return notebook.id === id; });
    if (!notebookToDelete) {
        return undefined;
    }
    var now = new Date().toISOString();
    var nextNotes = getNotes().map(function (note) {
        return note.notebookId === id
            ? __assign(__assign({}, note), { notebookId: undefined, updatedAt: now }) : note;
    });
    var nextNotebooks = notebooks.filter(function (notebook) { return notebook.id !== id; });
    saveNotes(nextNotes.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    saveNotebooks(nextNotebooks.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    return {
        notebook: notebookToDelete,
        notes: getNotes(),
        notebooks: getNotebooks(),
    };
}
function moveNoteToNotebook(noteId, notebookId) {
    if (!canUseStorage()) {
        return undefined;
    }
    var now = new Date().toISOString();
    var notebooks = getNotebooks();
    var targetNotebook = notebooks.find(function (notebook) { return notebook.id === notebookId; });
    if (!targetNotebook) {
        return undefined;
    }
    var movedNote;
    var nextNotes = getNotes().map(function (note) {
        if (note.id !== noteId) {
            return note;
        }
        movedNote = __assign(__assign({}, note), { notebookId: notebookId, updatedAt: now });
        return movedNote;
    });
    if (!movedNote) {
        return undefined;
    }
    var nextNotebooks = notebooks.map(function (notebook) {
        return notebook.id === notebookId ? __assign(__assign({}, notebook), { updatedAt: now }) : notebook;
    });
    saveNotes(nextNotes.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    saveNotebooks(nextNotebooks.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    return {
        notes: getNotes(),
        notebooks: getNotebooks(),
        note: movedNote,
    };
}
/**
 * Group notes by dropping one note onto another note.
 *
 * Rules:
 * - If neither note is in a notebook, create a new notebook containing both.
 * - If one note is already in a notebook, move the other into that notebook.
 * - If both notes are in different notebooks, merge the source notebook into the target notebook.
 */
function groupNotesIntoNotebook(sourceNoteId, targetNoteId) {
    var _a, _b, _c;
    if (!canUseStorage() || sourceNoteId === targetNoteId) {
        return undefined;
    }
    var notes = getNotes();
    var notebooks = getNotebooks();
    var sourceNote = notes.find(function (note) { return note.id === sourceNoteId; });
    var targetNote = notes.find(function (note) { return note.id === targetNoteId; });
    if (!sourceNote || !targetNote) {
        return undefined;
    }
    var now = new Date().toISOString();
    var targetNotebook = targetNote.notebookId
        ? notebooks.find(function (notebook) { return notebook.id === targetNote.notebookId; })
        : undefined;
    /**
     * Important drag rule:
     * If a note is dragged out of a notebook onto a loose note, create a new
     * notebook for just those two notes. Do not pull the target note back into the
     * source note's old notebook.
     */
    var notebookId = (_a = targetNotebook === null || targetNotebook === void 0 ? void 0 : targetNotebook.id) !== null && _a !== void 0 ? _a : createId('notebook');
    var notebookName = (_b = targetNotebook === null || targetNotebook === void 0 ? void 0 : targetNotebook.name) !== null && _b !== void 0 ? _b : 'Notebook';
    var notebookCreatedAt = (_c = targetNotebook === null || targetNotebook === void 0 ? void 0 : targetNotebook.createdAt) !== null && _c !== void 0 ? _c : now;
    var nextNotes = notes.map(function (note) {
        var shouldMove = note.id === sourceNoteId || note.id === targetNoteId;
        return shouldMove
            ? __assign(__assign({}, note), { notebookId: notebookId, updatedAt: now }) : note;
    });
    var nextNotebook = {
        id: notebookId,
        name: notebookName,
        createdAt: notebookCreatedAt,
        updatedAt: now,
    };
    var occupiedNotebookIds = new Set(nextNotes
        .map(function (note) { return note.notebookId; })
        .filter(function (id) { return Boolean(id); }));
    var nextNotebooks = __spreadArray([
        nextNotebook
    ], notebooks.filter(function (notebook) { return notebook.id !== notebookId && occupiedNotebookIds.has(notebook.id); }), true);
    saveNotes(nextNotes.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    saveNotebooks(nextNotebooks.sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }));
    return {
        notes: getNotes(),
        notebooks: getNotebooks(),
        notebook: nextNotebook,
    };
}
