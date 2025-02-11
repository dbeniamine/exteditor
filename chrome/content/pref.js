/*
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file,
You can obtain one at https://mozilla.org/MPL/2.0/.
*/

// This needs: chrome://global/content/nsUserSettings.js

// compat taken from http://qiita.com/sayamada/items/d6d26a3c2e9613854019
var nsPreferences;
nsPreferences = nsPreferences || ({
    mPrefService: Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch(""),
    copyUnicharPref: function (key, defaultVal) {
        if (defaultVal === undefined) {
            defaultVal = "";
        }
        var val = undefined;
        try {
            if ("getStringPref" in this.mPrefService) {
                val = this.mPrefService.getStringPref(key);
            } else {
                val = this.mPrefService.getComplexValue(key, Components.interfaces.nsISupportsString).data;
            }
        } catch (e) {
            console.log(e);
        }
        if (val !== undefined && val !== "") {
            return val;
        } else {
            return defaultVal;
        }
    },
    setUnicharPref: function (key, val) {
        if ("setStringPref" in this.mPrefService) {
            this.mPrefService.setStringPref(key, val);
        } else {
            var str = Components.classes["@mozilla.org/supports-string;1"]
                .createInstance(Components.interfaces.nsISupportsString);
            str.data = val;
            this.mPrefService.setComplexValue(key, Components.interfaces.nsISupportsString, str);
        }
    },
    getBoolPref: function (key, defaultVal) {
        try {
            var tmpVal = this.mPrefService.getBoolPref(key);
            if (tmpVal || tmpVal === "true") {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return defaultVal;
        }
    },
    setBoolPref: function (key, val) {
        if (val || val === "true") {
            this.mPrefService.setBoolPref(key, true);
        } else {
            this.mPrefService.setBoolPref(key, false);
        }
    },
    getIntPref: function (key, defaultVal) {
        try {
            return this.mPrefService.getIntPref(key);
        } catch (e) {
            return defaultVal;
        }
    },
    setIntPref: function (key, val) {
        this.mPrefService.setIntPref(key, val);
    }
});

//-----------------------------------------------------------------------------
var strbundle;
function getLocaleString(aName) {
    try {
        if (!strbundle) {
            var strBundleService = Services.strings;
            strbundle = strBundleService.createBundle("chrome://exteditor/locale/exteditor.properties");
        }

        if (strbundle)
            return strbundle.GetStringFromName(aName);
    }
    catch (e) {
        extEditorError("Cannot get the localized string bundle: " + e);
    }

    return null;
}

function extEditorError(msg) {
    msg = "ExtEditor: " + msg;
    alert(msg);
}

//-----------------------------------------------------------------------------
function AFgetPrefString(objId) {
    var obj = document.getElementById(objId);
    return obj.getAttribute("prefstring");
}

//-----------------------------------------------------------------------------
function AFreadPref(prefStr, defValue) {
    var typ = nsPreferences.mPrefService.getPrefType(prefStr);
    if (typ & 128) {
        return nsPreferences.getBoolPref(prefStr, defValue);
    } else if (typ & 64) {
        return nsPreferences.getIntPref(prefStr, defValue);
    } else if (typ & 32) {
        return nsPreferences.copyUnicharPref(prefStr, defValue);
    } else {
        alert(prefStr + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
    }
}

//-----------------------------------------------------------------------------
function AFreadObjPref(objId, defValue) {
    var obj = document.getElementById(objId);
    var atr = obj.getAttribute("prefattribute");

    if (atr == "") return;

    var val = AFgetObjPref(objId, defValue);
    obj[atr] = val;
}

//-----------------------------------------------------------------------------
function AFgetObjPref(objId, defValue) {
    var obj = document.getElementById(objId);
    var typ = obj.getAttribute("preftype");
    var atr = obj.getAttribute("prefattribute");
    var str = obj.getAttribute("prefstring");

    if ((typ == "") || (atr == "") || (str == "")) return;

    var val;
    if (typ == "bool") {
        val = nsPreferences.getBoolPref(str, defValue);
    } else if (typ == "int") {
        val = nsPreferences.getIntPref(str, defValue);
    } else if (typ == "string") {
        val = nsPreferences.copyUnicharPref(str, defValue);
    } else {
        alert(objId + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
        return;
    }
    return val;
}

//-----------------------------------------------------------------------------
function AFwriteObjPref(objId) {
    var obj = document.getElementById(objId);
    var typ = obj.getAttribute("preftype");
    var atr = obj.getAttribute("prefattribute");
    var str = obj.getAttribute("prefstring");

    if ((typ == "") || (atr == "") || (str == "")) return;

    var val = obj[atr];

    if (typ == "bool") {
        nsPreferences.setBoolPref(str, val);
    } else if (typ == "int") {
        nsPreferences.setIntPref(str, val);
    } else if (typ == "string") {
        nsPreferences.setUnicharPref(str, val);
    } else {
        alert(objId + ": " + getLocaleString("PrefTypeNotSupported") + ": " + typ);
        return;
    }
}
