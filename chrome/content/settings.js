/*
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file,
You can obtain one at https://mozilla.org/MPL/2.0/.
*/

var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

//-----------------------------------------------------------------------------
function onOK() {
    var exteditor = document.getElementById('exteditor_leEditor').value;
    exteditor = exteditor.replace(/(^\s+)|(\s+$)/g, '');
    document.getElementById('exteditor_leEditor').value = exteditor;

    AFwriteObjPref('exteditor_leEditor');
    AFwriteObjPref('exteditor_cbEditorUnicode');
    AFwriteObjPref('exteditor_cbEditor83Filename');
    AFwriteObjPref('exteditor_cbEditHeaders');
    AFwriteObjPref('exteditor_cbEditHeaderSubject');
    AFwriteObjPref('exteditor_cbEditHeaderTo');
    AFwriteObjPref('exteditor_cbEditHeaderCc');
    AFwriteObjPref('exteditor_cbEditHeaderBcc');
    AFwriteObjPref('exteditor_cbEditHeaderReplyTo');
    AFwriteObjPref('exteditor_cbEditHeaderNewsgroup');

    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_leEditor'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditorUnicode'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditor83Filename'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaders'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderSubject'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderTo'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderCc'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderBcc'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderReplyTo'));
    observerService.notifyObservers(null, "extEditorSettingsObserver", AFgetPrefString('exteditor_cbEditHeaderNewsgroup'));
}

//-----------------------------------------------------------------------------
function onLoad() {
    AFreadObjPref('exteditor_leEditor', "...");
    AFreadObjPref('exteditor_cbEditorUnicode', true);
    AFreadObjPref('exteditor_cbEditor83Filename', false);
    AFreadObjPref('exteditor_cbEditHeaders', true);
    AFreadObjPref('exteditor_cbEditHeaderSubject', true);
    AFreadObjPref('exteditor_cbEditHeaderTo', true);
    AFreadObjPref('exteditor_cbEditHeaderCc', true);
    AFreadObjPref('exteditor_cbEditHeaderBcc', true);
    AFreadObjPref('exteditor_cbEditHeaderReplyTo', false);
    AFreadObjPref('exteditor_cbEditHeaderNewsgroup', false);
    activate('exteditor_cbEditHeaders', 'exteditor_brcstEditHeaders');

    // 8+3 filenames are only usefull for DOS programmes, so hide this
    // prof if OS is not Windows
    if (window.navigator.platform.toLowerCase().indexOf("win") == -1) {
        var cb83 = document.getElementById('exteditor_cbEditor83Filename');
        cb83.setAttribute("hidden", "true");
    }
}

//-----------------------------------------------------------------------------
function activate(cbId, broadcasterId) {
    var broadcaster = document.getElementById(broadcasterId);
    var checked = document.getElementById(cbId).checked;
    if (checked) {
        broadcaster.removeAttribute("disabled");
    } else {
        broadcaster.setAttribute("disabled", "true");
    }
}

//-----------------------------------------------------------------------------
function selectEditor() {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, getLocaleString("SelectYourTextEditor"), nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterApps);
    openFilePicker(fp, function (ret) {
        if (ret !== nsIFilePicker.returnOK) { return; }
        var filepath = fp.file.path;
        if (/\s/.test(filepath)) {
            filepath = '"' + filepath + '"';
        }
        document.getElementById('exteditor_leEditor').value = filepath;
    });
}

//-----------------------------------------------------------------------------
function openFilePicker(filePicker, callback) {
    if ("show" in filePicker) {
        callback(filePicker.show());
    } else {
        filePicker.open(callback);
    }
}
