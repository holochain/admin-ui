import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, toDisplayString, createCommentVNode, createTextVNode } from 'vue';
import { deserializeHash, serializeHash } from '@holochain-open-dev/core-types';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import '@material/mwc-circular-progress';
import { render as render$1 } from 'lit-html';
import { html } from 'lit-html/static.js';
import 'lit-html/directives/repeat.js';
import 'lit-html/directives/class-map.js';
import 'lit-html/directives/style-map.js';
import 'lit-html/directives/unsafe-html.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import litRender$1, { html as html$1, classMap, svg } from '@ui5/webcomponents-base/dist/renderer/LitRenderer.js';
import UI5Element$1 from '@ui5/webcomponents-base/dist/UI5Element.js';
import { getIconDataSync, getIconData } from '@ui5/webcomponents-base/dist/asset-registries/Icons.js';
import createStyleInHead$1 from '@ui5/webcomponents-base/dist/util/createStyleInHead.js';
import { getI18nBundle as getI18nBundle$1 } from '@ui5/webcomponents-base/dist/i18nBundle.js';
import { getI18nBundleData as getI18nBundleData$1, fetchI18nBundle as fetchI18nBundle$1 } from '@ui5/webcomponents-base/dist/asset-registries/i18n.js';
import { isEnter, isSpace } from '@ui5/webcomponents-base/dist/Keys.js';
import isLegacyBrowser$1 from '@ui5/webcomponents-base/dist/isLegacyBrowser.js';
import { registerThemePropertiesLoader } from '@ui5/webcomponents-base/dist/asset-registries/Themes.js';
import defaultThemeBase from '@ui5/webcomponents-theme-base/dist/generated/themes/sap_fiori_3/parameters-bundle.css.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const ActionTypes = {
    fetchInstalledApps: "fetchInstalledApps",
};

const ADMIN_UI_MODULE = "admin";

var script = defineComponent({
    name: "InstalledApps",
    data() {
        return {
            ADMIN_UI_MODULE,
            showInfoDialogForAppId: undefined,
        };
    },
    emits: ["openApp", "disableApp", "enableApp", "startApp", "uninstallApp"],
    created() {
        this.$store.dispatch(`${ADMIN_UI_MODULE}/${ActionTypes.fetchInstalledApps}`);
    },
    methods: {
        deserializeHash,
        serializeHash,
        isAppRunning(appInfo) {
            return Object.keys(appInfo.status).includes("running");
        },
        isAppDisabled(appInfo) {
            return Object.keys(appInfo.status).includes("disabled");
        },
        isAppPaused(appInfo) {
            return Object.keys(appInfo.status).includes("paused");
        },
        getReason(appInfo) {
            if (this.isAppRunning(appInfo))
                return undefined;
            if (this.isAppDisabled(appInfo)) {
                const reason = appInfo.status.disabled.reason;
                if (Object.keys(reason).includes("never_started")) {
                    return "App was never started";
                }
                else if (Object.keys(reason).includes("user")) {
                    return "App was disabled by the user";
                }
                else {
                    return `There was an error with this app: ${reason.error}`;
                }
            }
            else {
                return appInfo.status.paused.reason.error;
            }
        },
        enableApp(appId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.$emit("enableApp", appId);
            });
        },
        disableApp(appId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.$emit("disableApp", appId);
            });
        },
        startApp(appId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.$emit("startApp", appId);
            });
        },
        uninstallApp(appId) {
            return __awaiter(this, void 0, void 0, function* () {
                this.$emit("uninstallApp", appId);
            });
        },
    },
});

const _hoisted_1 = {
  key: 0,
  style: {"flex":"1","display":"flex","align-items":"center","justify-content":"center"}
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("mwc-circular-progress", { indeterminate: "" }, null, -1 /* HOISTED */);
const _hoisted_3 = [
  _hoisted_2
];
const _hoisted_4 = { key: 1 };
const _hoisted_5 = { style: {"display":"flex","flex":"1","flex-direction":"column"} };
const _hoisted_6 = /*#__PURE__*/createElementVNode("span", { style: {"margin-bottom":"16px","font-size":"1.5em"} }, "Installed Apps", -1 /* HOISTED */);
const _hoisted_7 = {
  key: 0,
  style: {"flex":"1","display":"flex","align-items":"center","justify-content":"center"}
};
const _hoisted_8 = /*#__PURE__*/createElementVNode("span", { style: {"margin-top":"160px"} }, "You don't have any apps installed yet", -1 /* HOISTED */);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = { style: {"width":"auto"} };
const _hoisted_11 = { style: {"display":"flex","flex-direction":"column","flex":"1","padding":"8px"} };
const _hoisted_12 = { style: {"display":"flex","flex-direction":"row"} };
const _hoisted_13 = { style: {"font-size":"1.6em"} };
const _hoisted_14 = /*#__PURE__*/createElementVNode("span", { style: {"flex":"1"} }, null, -1 /* HOISTED */);
const _hoisted_15 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center"} };
const _hoisted_16 = /*#__PURE__*/createElementVNode("span", { style: {"margin-right":"8px","opacity":"0.9"} }, "Your Public Key:", -1 /* HOISTED */);
const _hoisted_17 = { style: {"margin-right":"16px","opacity":"0.7","font-family":"monospace"} };
const _hoisted_18 = {
  key: 0,
  type: "success"
};
const _hoisted_19 = {
  key: 1,
  type: "warning"
};
const _hoisted_20 = {
  key: 2,
  type: "danger"
};
const _hoisted_21 = ["onClick"];
const _hoisted_22 = ["open", "heading"];
const _hoisted_23 = { style: {"display":"flex","flex-direction":"column"} };
const _hoisted_24 = /*#__PURE__*/createTextVNode("Status: ");
const _hoisted_25 = {
  key: 0,
  type: "success"
};
const _hoisted_26 = {
  key: 1,
  type: "warning"
};
const _hoisted_27 = {
  key: 2,
  type: "danger"
};
const _hoisted_28 = { style: {"margin-top":"8px"} };
const _hoisted_29 = /*#__PURE__*/createElementVNode("mwc-button", {
  label: "Ok",
  slot: "primaryAction",
  dialogAction: "close"
}, null, -1 /* HOISTED */);
const _hoisted_30 = { style: {"display":"flex","flex-direction":"row","align-items":"flex-end"} };
const _hoisted_31 = { style: {"flex":"1","text-align":"left","margin-top":"8px"} };
const _hoisted_32 = /*#__PURE__*/createElementVNode("tr", null, [
  /*#__PURE__*/createElementVNode("th", null, "Cell Role"),
  /*#__PURE__*/createElementVNode("th", null, "Dna Hash")
], -1 /* HOISTED */);
const _hoisted_33 = { style: {"opacity":"0.7","font-family":"monospace"} };
const _hoisted_34 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center","margin-top":"8px","--mdc-theme-primary":"rgb(90, 90, 90)"} };
const _hoisted_35 = ["onClick"];
const _hoisted_36 = ["onClick"];
const _hoisted_37 = ["onClick"];
const _hoisted_38 = ["onClick"];
const _hoisted_39 = ["onClick"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.$store.state.admin.installedApps.loading)
    ? (openBlock(), createElementBlock("div", _hoisted_1, _hoisted_3))
    : (openBlock(), createElementBlock("div", _hoisted_4, [
        createElementVNode("div", _hoisted_5, [
          _hoisted_6,
          (_ctx.$store.getters[`${_ctx.ADMIN_UI_MODULE}/allApps`].length === 0)
            ? (openBlock(), createElementBlock("div", _hoisted_7, _hoisted_9))
            : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(_ctx.$store.getters[`${_ctx.ADMIN_UI_MODULE}/allApps`], (app) => {
                return (openBlock(), createElementBlock("div", {
                  key: app.installed_app_id,
                  style: {"display":"flex","flex-direction":"column","margin-bottom":"16px"}
                }, [
                  createElementVNode("ui5-card", _hoisted_10, [
                    createElementVNode("div", _hoisted_11, [
                      createElementVNode("div", _hoisted_12, [
                        createElementVNode("span", _hoisted_13, toDisplayString(app.installed_app_id), 1 /* TEXT */),
                        _hoisted_14,
                        createElementVNode("div", _hoisted_15, [
                          _hoisted_16,
                          createElementVNode("span", _hoisted_17, toDisplayString(_ctx.serializeHash(app.cell_data[0].cell_id[1])), 1 /* TEXT */),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_18, "Running"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_19, "Paused"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_20, "Disabled"))
                            : createCommentVNode("v-if", true),
                          (_ctx.getReason(app))
                            ? (openBlock(), createElementBlock("mwc-icon-button", {
                                key: 3,
                                onClick: $event => (_ctx.showInfoDialogForAppId = app.installed_app_id),
                                style: {"margin-left":"8px"},
                                icon: "info"
                              }, null, 8 /* PROPS */, _hoisted_21))
                            : createCommentVNode("v-if", true),
                          createElementVNode("mwc-dialog", {
                            open: _ctx.showInfoDialogForAppId,
                            heading: _ctx.showInfoDialogForAppId,
                            onClosing: _cache[0] || (_cache[0] = $event => (_ctx.showInfoDialogForAppId = undefined))
                          }, [
                            createElementVNode("div", _hoisted_23, [
                              createElementVNode("span", null, [
                                _hoisted_24,
                                (_ctx.isAppRunning(app))
                                  ? (openBlock(), createElementBlock("sl-tag", _hoisted_25, "Running"))
                                  : createCommentVNode("v-if", true),
                                (_ctx.isAppPaused(app))
                                  ? (openBlock(), createElementBlock("sl-tag", _hoisted_26, "Paused"))
                                  : createCommentVNode("v-if", true),
                                (_ctx.isAppDisabled(app))
                                  ? (openBlock(), createElementBlock("sl-tag", _hoisted_27, "Disabled"))
                                  : createCommentVNode("v-if", true)
                              ]),
                              createElementVNode("span", _hoisted_28, toDisplayString(_ctx.getReason(app)), 1 /* TEXT */)
                            ]),
                            _hoisted_29
                          ], 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_22)
                        ])
                      ]),
                      createElementVNode("div", _hoisted_30, [
                        createElementVNode("table", _hoisted_31, [
                          _hoisted_32,
                          (openBlock(true), createElementBlock(Fragment, null, renderList(app.cell_data, (cellData) => {
                            return (openBlock(), createElementBlock("tr", {
                              style: {},
                              key: [...cellData.cell_id[0], ...cellData.cell_id[1]]
                            }, [
                              createElementVNode("td", null, [
                                createElementVNode("span", null, toDisplayString(cellData.role_id), 1 /* TEXT */)
                              ]),
                              createElementVNode("td", null, [
                                createElementVNode("span", _hoisted_33, toDisplayString(_ctx.serializeHash(cellData.cell_id[0])), 1 /* TEXT */)
                              ])
                            ]))
                          }), 128 /* KEYED_FRAGMENT */))
                        ]),
                        createElementVNode("div", _hoisted_34, [
                          createElementVNode("mwc-button", {
                            onClick: $event => (_ctx.uninstallApp(app.installed_app_id)),
                            style: {"margin-left":"8px"},
                            label: "Uninstall",
                            icon: "delete"
                          }, null, 8 /* PROPS */, _hoisted_35),
                          (!_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 0,
                                onClick: $event => (_ctx.disableApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Disable",
                                icon: "archive"
                              }, null, 8 /* PROPS */, _hoisted_36))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 1,
                                onClick: $event => (_ctx.enableApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Enable",
                                icon: "unarchive"
                              }, null, 8 /* PROPS */, _hoisted_37))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 2,
                                onClick: $event => (_ctx.startApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Start",
                                icon: "play_arrow"
                              }, null, 8 /* PROPS */, _hoisted_38))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 3,
                                onClick: $event => (_ctx.$emit('openApp', app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Open",
                                icon: "launch"
                              }, null, 8 /* PROPS */, _hoisted_39))
                            : createCommentVNode("v-if", true)
                        ])
                      ])
                    ])
                  ])
                ]))
              }), 128 /* KEYED_FRAGMENT */))
        ])
      ]))
}

script.render = render;
script.__file = "src/components/InstalledApps.vue";

function hcAdminVuexModule(adminWebsocket) {
    return {
        namespaced: true,
        state() {
            return {
                installedApps: {
                    loading: false,
                    appsInfo: [],
                },
            };
        },
        getters: {
            allApps(state) {
                // Sort apps alphabetically
                return state.installedApps.appsInfo.sort((app1, app2) => {
                    if (app1.installed_app_id < app2.installed_app_id) {
                        return -1;
                    }
                    if (app1.installed_app_id > app2.installed_app_id) {
                        return 1;
                    }
                    return 0;
                });
            },
        },
        mutations: {
            loadAppsInfo(state) {
                state.installedApps.loading = true;
            },
            setAppsInfo(state, activeApps) {
                state.installedApps.appsInfo = activeApps;
                state.installedApps.loading = false;
            },
        },
        actions: {
            fetchInstalledApps({ commit }) {
                return __awaiter(this, void 0, void 0, function* () {
                    commit("loadAppsInfo");
                    const appsInfos = yield adminWebsocket.listApps({});
                    commit("setAppsInfo", appsInfos);
                });
            },
        },
    };
}

var class2type = {};
var hasOwn = class2type.hasOwnProperty;
var toString = class2type.toString;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call(Object);
var fnIsPlainObject = function (obj) {
  var proto, Ctor;
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
};

var oToken = Object.create(null);
var fnMerge$1 = function () {
    var src, copyIsArray, copy, name, options, clone, target = arguments[2] || {}, i = 3, length = arguments.length, deep = arguments[0] || false, skipToken = arguments[1] ? undefined : oToken;
    if (typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (name === '__proto__' || target === copy) {
                    continue;
                }
                if (deep && copy && (fnIsPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && fnIsPlainObject(src) ? src : {};
                    }
                    target[name] = fnMerge$1(deep, arguments[1], clone, copy);
                } else if (copy !== skipToken) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};

var fnMerge = function () {
    var args = [
        true,
        false
    ];
    args.push.apply(args, arguments);
    return fnMerge$1.apply(null, args);
};

class EventProvider {
	constructor() {
		this._eventRegistry = {};
	}

	attachEvent(eventName, fnFunction) {
		const eventRegistry = this._eventRegistry;
		let eventListeners = eventRegistry[eventName];

		if (!Array.isArray(eventListeners)) {
			eventRegistry[eventName] = [];
			eventListeners = eventRegistry[eventName];
		}

		eventListeners.push({
			"function": fnFunction,
		});
	}

	detachEvent(eventName, fnFunction) {
		const eventRegistry = this._eventRegistry;
		let eventListeners = eventRegistry[eventName];

		if (!eventListeners) {
			return;
		}

		eventListeners = eventListeners.filter(event => {
			return event["function"] !== fnFunction; // eslint-disable-line
		});

		if (eventListeners.length === 0) {
			delete eventRegistry[eventName];
		}
	}

	/**
	 * Fires an event and returns the results of all event listeners as an array.
	 *
	 * @param eventName the event to fire
	 * @param data optional data to pass to each event listener
	 * @returns {Array} an array with the results of all event listeners
	 */
	fireEvent(eventName, data) {
		const eventRegistry = this._eventRegistry;
		const eventListeners = eventRegistry[eventName];

		if (!eventListeners) {
			return [];
		}

		return eventListeners.map(event => {
			return event["function"].call(this, data); // eslint-disable-line
		});
	}

	/**
	 * Fires an event and returns a promise that will resolve once all listeners have resolved.
	 *
	 * @param eventName the event to fire
	 * @param data optional data to pass to each event listener
	 * @returns {Promise} a promise that will resolve when all listeners have resolved
	 */
	fireEventAsync(eventName, data) {
		return Promise.all(this.fireEvent(eventName, data));
	}

	isHandlerAttached(eventName, fnFunction) {
		const eventRegistry = this._eventRegistry;
		const eventListeners = eventRegistry[eventName];

		if (!eventListeners) {
			return false;
		}

		for (let i = 0; i < eventListeners.length; i++) {
			const event = eventListeners[i];
			if (event["function"] === fnFunction) { // eslint-disable-line
				return true;
			}
		}

		return false;
	}

	hasListeners(eventName) {
		return !!this._eventRegistry[eventName];
	}
}

const whenDOMReady = () => {
	return new Promise(resolve => {
		if (document.body) {
			resolve();
		} else {
			document.addEventListener("DOMContentLoaded", () => {
				resolve();
			});
		}
	});
};

/**
 * Creates a <style> tag in the <head> tag
 * @param cssText - the CSS
 * @param attributes - optional attributes to add to the tag
 * @returns {HTMLElement}
 */
const createStyleInHead = (cssText, attributes = {}) => {
	const style = document.createElement("style");
	style.type = "text/css";

	Object.entries(attributes).forEach(pair => style.setAttribute(...pair));

	style.textContent = cssText;
	document.head.appendChild(style);
	return style;
};

const features = new Map();

const getFeature = name => {
	return features.get(name);
};

/**
 * CSS font face used for the texts provided by SAP.
 */

/* CDN Locations */
const font72RegularWoff = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Regular.woff?ui5-webcomponents`;
const font72RegularWoff2 = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Regular.woff2?ui5-webcomponents`;

const font72RegularFullWoff = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Regular-full.woff?ui5-webcomponents`;
const font72RegularFullWoff2 = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Regular-full.woff2?ui5-webcomponents`;

const font72BoldWoff = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Bold.woff?ui5-webcomponents`;
const font72BoldWoff2 = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Bold.woff2?ui5-webcomponents`;

const font72BoldFullWoff = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Bold-full.woff?ui5-webcomponents`;
const font72BoldFullWoff2 = `https://ui5.sap.com/sdk/resources/sap/ui/core/themes/sap_fiori_3/fonts/72-Bold-full.woff2?ui5-webcomponents`;

const fontFaceCSS = `
	@font-face {
		font-family: "72";
		font-style: normal;
		font-weight: 400;
		src: local("72"),
			url(${font72RegularWoff2}) format("woff2"),
			url(${font72RegularWoff}) format("woff");
	}
	
	@font-face {
		font-family: "72full";
		font-style: normal;
		font-weight: 400;
		src: local('72-full'),
			url(${font72RegularFullWoff2}) format("woff2"),
			url(${font72RegularFullWoff}) format("woff");
		
	}
	
	@font-face {
		font-family: "72";
		font-style: normal;
		font-weight: 700;
		src: local('72-Bold'),
			url(${font72BoldWoff2}) format("woff2"),
			url(${font72BoldWoff}) format("woff");
	}
	
	@font-face {
		font-family: "72full";
		font-style: normal;
		font-weight: 700;
		src: local('72-Bold-full'),
			url(${font72BoldFullWoff2}) format("woff2"),
			url(${font72BoldFullWoff}) format("woff");
	}
`;

/**
 * Some diacritics are supported by the 72 font:
 *  * Grave
 *  * Acute
 *  * Circumflex
 *  * Tilde
 *
 * However, the following diacritics and the combination of multiple diacritics (including the supported ones) are not supported:
 *  * Breve
 *  * Horn
 *  * Dot below
 *  * Hook above
 *
 *
 * Override for the characters that aren't covered by the '72' font to other system fonts
 *
 * U+0102-0103: A and a with Breve
 * U+01A0-01A1: O and o with Horn
 * U+01AF-01B0: U and u with Horn
 * U+1EA0-1EB7: A and a with diacritics that are not supported by the font and combination of multiple diacritics
 * U+1EB8-1EC7: E and e with diacritics that are not supported by the font and combination of multiple diacritics
 * U+1EC8-1ECB: I and i with diacritics that are not supported by the font and combination of multiple diacritics
 * U+1ECC-1EE3: O and o with diacritics that are not supported by the font and combination of multiple diacritics
 * U+1EE4-1EF1: U and u with diacritics that are not supported by the font and combination of multiple diacritics
 * U+1EF4-1EF7: Y and y with diacritics that are not supported by the font and combination of multiple diacritics
 *
 */
const overrideFontFaceCSS = `
	@font-face {
		font-family: '72override';
		unicode-range: U+0102-0103, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EB7, U+1EB8-1EC7, U+1EC8-1ECB, U+1ECC-1EE3, U+1EE4-1EF1, U+1EF4-1EF7;
		src: local('Arial'), local('Helvetica'), local('sans-serif');
	}
`;

const insertFontFace = () => {
	const OpenUI5Support = getFeature("OpenUI5Support");

	// Only set the main font if there is no OpenUI5 support, or there is, but OpenUI5 is not loaded
	if (!OpenUI5Support || !OpenUI5Support.isLoaded()) {
		insertMainFontFace();
	}

	// Always set the override font - OpenUI5 in CSS Vars mode does not set it, unlike the main font
	insertOverrideFontFace();
};

const insertMainFontFace = () => {
	if (!document.querySelector(`head>style[data-ui5-font-face]`)) {
		createStyleInHead(fontFaceCSS, { "data-ui5-font-face": "" });
	}
};

const insertOverrideFontFace = () => {
	if (!document.querySelector(`head>style[data-ui5-font-face-override]`)) {
		createStyleInHead(overrideFontFaceCSS, { "data-ui5-font-face-override": "" });
	}
};

const systemCSSVars = `
	:root {
		--_ui5_content_density:cozy;
	}
	
	[data-ui5-compact-size],
	.ui5-content-density-compact,
	.sapUiSizeCompact {
		--_ui5_content_density:compact;
	}
	
	[dir="rtl"] {
		--_ui5_dir:rtl;
	}
	
	[dir="ltr"] {
		--_ui5_dir:ltr;
	}
`;

const insertSystemCSSVars = () => {
	if (document.querySelector(`head>style[data-ui5-system-css-vars]`)) {
		return;
	}

	createStyleInHead(systemCSSVars, { "data-ui5-system-css-vars": "" });
};

const assetParameters = {"themes":{"default":"sap_fiori_3","all":["sap_fiori_3","sap_fiori_3_dark","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_fiori_3_hcb","sap_fiori_3_hcw"]},"languages":{"default":"en","all":["ar","bg","ca","cs","cy","da","de","el","en","en_GB","en_US_sappsd","en_US_saprigi","en_US_saptrc","es","es_MX","et","fi","fr","fr_CA","hi","hr","hu","in","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt_PT","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh_CN","zh_TW"]},"locales":{"default":"en","all":["ar","ar_EG","ar_SA","bg","ca","cs","da","de","de_AT","de_CH","el","el_CY","en","en_AU","en_GB","en_HK","en_IE","en_IN","en_NZ","en_PG","en_SG","en_ZA","es","es_AR","es_BO","es_CL","es_CO","es_MX","es_PE","es_UY","es_VE","et","fa","fi","fr","fr_BE","fr_CA","fr_CH","fr_LU","he","hi","hr","hu","id","it","it_CH","ja","kk","ko","lt","lv","ms","nb","nl","nl_BE","pl","pt","pt_PT","ro","ru","ru_UA","sk","sl","sr","sv","th","tr","uk","vi","zh_CN","zh_HK","zh_SG","zh_TW"]}};

const DEFAULT_THEME = assetParameters.themes.default;
const DEFAULT_LANGUAGE = assetParameters.languages.default;
const DEFAULT_LOCALE = assetParameters.locales.default;

let initialized = false;

let initialConfig = {
	animationMode: "full",
	theme: DEFAULT_THEME,
	rtl: null,
	language: null,
	calendarType: null,
	noConflict: false, // no URL
	formatSettings: {},
	fetchDefaultLanguage: false,
	assetsPath: "",
};

const getTheme$1 = () => {
	initConfiguration();
	return initialConfig.theme;
};

const getRTL$1 = () => {
	initConfiguration();
	return initialConfig.rtl;
};

const getLanguage$1 = () => {
	initConfiguration();
	return initialConfig.language;
};

/**
 * Returns if the default language, that is inlined at build time,
 * should be fetched over the network instead.
 * @returns {Boolean}
 */
const getFetchDefaultLanguage$1 = () => {
	initConfiguration();
	return initialConfig.fetchDefaultLanguage;
};

const getNoConflict$1 = () => {
	initConfiguration();
	return initialConfig.noConflict;
};

const booleanMapping = new Map();
booleanMapping.set("true", true);
booleanMapping.set("false", false);

const parseConfigurationScript = () => {
	const configScript = document.querySelector("[data-ui5-config]") || document.querySelector("[data-id='sap-ui-config']"); // for backward compatibility

	let configJSON;

	if (configScript) {
		try {
			configJSON = JSON.parse(configScript.innerHTML);
		} catch (err) {
			console.warn("Incorrect data-sap-ui-config format. Please use JSON"); /* eslint-disable-line */
		}

		if (configJSON) {
			initialConfig = fnMerge(initialConfig, configJSON);
		}
	}
};

const parseURLParameters = () => {
	const params = new URLSearchParams(window.location.search);

	// Process "sap-*" params first
	params.forEach((value, key) => {
		const parts = key.split("sap-").length;
		if (parts === 0 || parts === key.split("sap-ui-").length) {
			return;
		}

		applyURLParam(key, value, "sap");
	});

	// Process "sap-ui-*" params
	params.forEach((value, key) => {
		if (!key.startsWith("sap-ui")) {
			return;
		}

		applyURLParam(key, value, "sap-ui");
	});
};

const applyURLParam = (key, value, paramType) => {
	const lowerCaseValue = value.toLowerCase();
	const param = key.split(`${paramType}-`)[1];

	if (booleanMapping.has(value)) {
		value = booleanMapping.get(lowerCaseValue);
	}
	initialConfig[param] = value;
};

const applyOpenUI5Configuration = () => {
	const OpenUI5Support = getFeature("OpenUI5Support");
	if (!OpenUI5Support || !OpenUI5Support.isLoaded()) {
		return;
	}

	const OpenUI5Config = OpenUI5Support.getConfigurationSettingsObject();
	initialConfig = fnMerge(initialConfig, OpenUI5Config);
};

const initConfiguration = () => {
	if (initialized) {
		return;
	}

	// 1. Lowest priority - configuration script
	parseConfigurationScript();

	// 2. URL parameters overwrite configuration script parameters
	parseURLParameters();

	// 3. If OpenUI5 is detected, it has the highest priority
	applyOpenUI5Configuration();

	initialized = true;
};

const themeStyles = new Map();
const loaders$1 = new Map();
const registeredPackages = new Set();
const registeredThemes = new Set();

const getThemeProperties = async (packageName, themeName) => {
	const style = themeStyles.get(`${packageName}_${themeName}`);
	if (style !== undefined) { // it's valid for style to be an empty string
		return style;
	}

	if (!registeredThemes.has(themeName)) {
		const regThemesStr = [...registeredThemes.values()].join(", ");
		console.warn(`You have requested a non-registered theme - falling back to ${DEFAULT_THEME}. Registered themes are: ${regThemesStr}`); /* eslint-disable-line */
		return themeStyles.get(`${packageName}_${DEFAULT_THEME}`);
	}

	const loader = loaders$1.get(`${packageName}/${themeName}`);
	if (!loader) {
		// no themes for package
		console.error(`Theme [${themeName}] not registered for package [${packageName}]`); /* eslint-disable-line */
		return;
	}
	let data;
	try {
		data = await loader(themeName);
	} catch (e) {
		console.error(packageName, e.message); /* eslint-disable-line */
		return;
	}
	const themeProps = data._ || data;

	themeStyles.set(`${packageName}_${themeName}`, themeProps);
	return themeProps;
};

const getRegisteredPackages = () => {
	return registeredPackages;
};

const isThemeRegistered = theme => {
	return registeredThemes.has(theme);
};

/**
 * Creates/updates a style element holding all CSS Custom Properties
 * @param cssText
 * @param packageName
 */
const createThemePropertiesStyleTag = (cssText, packageName) => {
	const styleElement = document.head.querySelector(`style[data-ui5-theme-properties="${packageName}"]`);
	if (styleElement) {
		styleElement.textContent = cssText || "";	// in case of undefined
	} else {
		const attributes = {
			"data-ui5-theme-properties": packageName,
		};
		createStyleInHead(cssText, attributes);
	}
};

const getThemeMetadata = () => {
	// Check if the class was already applied, most commonly to the link/style tag with the CSS Variables
	let el = document.querySelector(".sapThemeMetaData-Base-baseLib");
	if (el) {
		return getComputedStyle(el).backgroundImage;
	}

	el = document.createElement("span");
	el.style.display = "none";
	el.classList.add("sapThemeMetaData-Base-baseLib");
	document.body.appendChild(el);
	const metadata = getComputedStyle(el).backgroundImage;
	document.body.removeChild(el);

	return metadata;
};

const parseThemeMetadata = metadataString => {
	const params = /\(["']?data:text\/plain;utf-8,(.*?)['"]?\)$/i.exec(metadataString);
	if (params && params.length >= 2) {
		let paramsString = params[1];
		paramsString = paramsString.replace(/\\"/g, `"`);
		if (paramsString.charAt(0) !== "{" && paramsString.charAt(paramsString.length - 1) !== "}") {
			try {
				paramsString = decodeURIComponent(paramsString);
			} catch (ex) {
				console.warn("Malformed theme metadata string, unable to decodeURIComponent"); // eslint-disable-line
				return;
			}
		}
		try {
			return JSON.parse(paramsString);
		} catch (ex) {
			console.warn("Malformed theme metadata string, unable to parse JSON"); // eslint-disable-line
		}
	}
};

const processThemeMetadata = metadata => {
	let themeName;
	let baseThemeName;

	try {
		themeName = metadata.Path.match(/\.([^.]+)\.css_variables$/)[1];
		baseThemeName = metadata.Extends[0];
	} catch (ex) {
		console.warn("Malformed theme metadata Object", metadata); // eslint-disable-line
		return;
	}

	return {
		themeName,
		baseThemeName,
	};
};

const getThemeDesignerTheme = () => {
	const metadataString = getThemeMetadata();
	if (!metadataString || metadataString === "none") {
		return;
	}

	const metadata = parseThemeMetadata(metadataString);
	return processThemeMetadata(metadata);
};

const eventProvider$4 = new EventProvider();
const THEME_LOADED = "themeLoaded";

const fireThemeLoaded = theme => {
	return eventProvider$4.fireEvent(THEME_LOADED, theme);
};

const BASE_THEME_PACKAGE = "@ui5/webcomponents-theme-base";

const isThemeBaseRegistered = () => {
	const registeredPackages = getRegisteredPackages();
	return registeredPackages.has(BASE_THEME_PACKAGE);
};

const loadThemeBase = async theme => {
	if (!isThemeBaseRegistered()) {
		return;
	}

	const cssText = await getThemeProperties(BASE_THEME_PACKAGE, theme);
	createThemePropertiesStyleTag(cssText, BASE_THEME_PACKAGE);
};

const deleteThemeBase = () => {
	const styleElement = document.head.querySelector(`style[data-ui5-theme-properties="${BASE_THEME_PACKAGE}"]`);
	if (styleElement) {
		styleElement.parentElement.removeChild(styleElement);
	}
};

const loadComponentPackages = async theme => {
	const registeredPackages = getRegisteredPackages();
	registeredPackages.forEach(async packageName => {
		if (packageName === BASE_THEME_PACKAGE) {
			return;
		}

		const cssText = await getThemeProperties(packageName, theme);
		createThemePropertiesStyleTag(cssText, packageName);
	});
};

const detectExternalTheme = () => {
	// If theme designer theme is detected, use this
	const extTheme = getThemeDesignerTheme();
	if (extTheme) {
		return extTheme;
	}

	// If OpenUI5Support is enabled, try to find out if it loaded variables
	const OpenUI5Support = getFeature("OpenUI5Support");
	if (OpenUI5Support) {
		const varsLoaded = OpenUI5Support.cssVariablesLoaded();
		if (varsLoaded) {
			return {
				themeName: OpenUI5Support.getConfigurationSettingsObject().theme, // just themeName, baseThemeName is only relevant for custom themes
			};
		}
	}
};

const applyTheme = async theme => {
	const extTheme = detectExternalTheme();

	// Only load theme_base properties if there is no externally loaded theme, or there is, but it is not being loaded
	if (!extTheme || theme !== extTheme.themeName) {
		await loadThemeBase(theme);
	} else {
		deleteThemeBase();
	}

	// Always load component packages properties. For non-registered themes, try with the base theme, if any
	const packagesTheme = isThemeRegistered(theme) ? theme : extTheme && extTheme.baseThemeName;
	await loadComponentPackages(packagesTheme);

	fireThemeLoaded(theme);
};

let theme;

const getTheme = () => {
	if (theme === undefined) {
		theme = getTheme$1();
	}

	return theme;
};

let booted = false;
const eventProvider$3 = new EventProvider();

const boot = async () => {
	if (booted) {
		return;
	}

	const OpenUI5Support = getFeature("OpenUI5Support");
	if (OpenUI5Support) {
		await OpenUI5Support.init();
	}

	await whenDOMReady();
	await applyTheme(getTheme());
	OpenUI5Support && OpenUI5Support.attachListeners();
	insertFontFace();
	insertSystemCSSVars();
	await eventProvider$3.fireEventAsync("boot");
	booted = true;
};

/**
 * Base class for all data types.
 *
 * @class
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.base.types.DataType
 * @public
 */
class DataType {
	static isValid(value) {
	}

	static generateTypeAccessors(types) {
		Object.keys(types).forEach(type => {
			Object.defineProperty(this, type, {
				get() {
					return types[type];
				},
			});
		});
	}
}

const isDescendantOf = (klass, baseKlass, inclusive = false) => {
	if (typeof klass !== "function" || typeof baseKlass !== "function") {
		return false;
	}
	if (inclusive && klass === baseKlass) {
		return true;
	}
	let parent = klass;
	do {
		parent = Object.getPrototypeOf(parent);
	} while (parent !== null && parent !== baseKlass);
	return parent === baseKlass;
};

const kebabToCamelMap = new Map();
const camelToKebabMap = new Map();

const kebabToCamelCase = string => {
	if (!kebabToCamelMap.has(string)) {
		const result = toCamelCase(string.split("-"));
		kebabToCamelMap.set(string, result);
	}
	return kebabToCamelMap.get(string);
};

const camelToKebabCase = string => {
	if (!camelToKebabMap.has(string)) {
		const result = string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
		camelToKebabMap.set(string, result);
	}
	return camelToKebabMap.get(string);
};

const toCamelCase = parts => {
	return parts.map((string, index) => {
		return index === 0 ? string.toLowerCase() : string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}).join("");
};

/**
 * Determines the slot to which a node should be assigned
 * @param node Text node or HTML element
 * @returns {string}
 */
const getSlotName = node => {
	// Text nodes can only go to the default slot
	if (!(node instanceof HTMLElement)) {
		return "default";
	}

	// Discover the slot based on the real slot name (f.e. footer => footer, or content-32 => content)
	const slot = node.getAttribute("slot");
	if (slot) {
		const match = slot.match(/^(.+?)-\d+$/);
		return match ? match[1] : slot;
	}

	// Use default slot as a fallback
	return "default";
};

const isSlot = el => el && el instanceof HTMLElement && el.localName === "slot";

const getSlottedElements = el => {
	if (isSlot(el)) {
		return el.assignedNodes({ flatten: true }).filter(item => item instanceof HTMLElement);
	}

	return [el];
};

const getSlottedElementsList = elList => {
	const reducer = (acc, curr) => acc.concat(getSlottedElements(curr));
	return elList.reduce(reducer, []);
};

let suf;
let rulesObj = {
	include: [/^ui5-/],
	exclude: [],
};
const tagsCache = new Map(); // true/false means the tag should/should not be cached, undefined means not known yet.

/**
 * Returns the currently set scoping suffix, or undefined if not set.
 *
 * @public
 * @returns {String|undefined}
 */
const getCustomElementsScopingSuffix = () => {
	return suf;
};

/**
 * Determines whether custom elements with the given tag should be scoped or not.
 * The tag is first matched against the "include" rules and then against the "exclude" rules and the
 * result is cached until new rules are set.
 *
 * @public
 * @param tag
 */
const shouldScopeCustomElement = tag => {
	if (!tagsCache.has(tag)) {
		const result = rulesObj.include.some(rule => tag.match(rule)) && !rulesObj.exclude.some(rule => tag.match(rule));
		tagsCache.set(tag, result);
	}

	return tagsCache.get(tag);
};

/**
 * Returns the currently set scoping suffix, if any and if the tag should be scoped, or undefined otherwise.
 *
 * @public
 * @param tag
 * @returns {String}
 */
const getEffectiveScopingSuffixForTag = tag => {
	if (shouldScopeCustomElement(tag)) {
		return getCustomElementsScopingSuffix();
	}
};

/**
 *
 * @class
 * @public
 */
class UI5ElementMetadata {
	constructor(metadata) {
		this.metadata = metadata;
	}

	getInitialState() {
		if (Object.prototype.hasOwnProperty.call(this, "_initialState")) {
			return this._initialState;
		}

		const initialState = {};
		const slotsAreManaged = this.slotsAreManaged();

		// Initialize properties
		const props = this.getProperties();
		for (const propName in props) { // eslint-disable-line
			const propType = props[propName].type;
			const propDefaultValue = props[propName].defaultValue;

			if (propType === Boolean) {
				initialState[propName] = false;

				if (propDefaultValue !== undefined) {
					console.warn("The 'defaultValue' metadata key is ignored for all booleans properties, they would be initialized with 'false' by default"); // eslint-disable-line
				}
			} else if (props[propName].multiple) {
				initialState[propName] = [];
			} else if (propType === Object) {
				initialState[propName] = "defaultValue" in props[propName] ? props[propName].defaultValue : {};
			} else if (propType === String) {
				initialState[propName] = "defaultValue" in props[propName] ? props[propName].defaultValue : "";
			} else {
				initialState[propName] = propDefaultValue;
			}
		}

		// Initialize slots
		if (slotsAreManaged) {
			const slots = this.getSlots();
			for (const [slotName, slotData] of Object.entries(slots)) { // eslint-disable-line
				const propertyName = slotData.propertyName || slotName;
				initialState[propertyName] = [];
			}
		}

		this._initialState = initialState;
		return initialState;
	}

	/**
	 * Only intended for use by UI5Element.js
	 * @protected
	 */
	static validatePropertyValue(value, propData) {
		const isMultiple = propData.multiple;
		if (isMultiple) {
			return value.map(propValue => validateSingleProperty(propValue, propData));
		}
		return validateSingleProperty(value, propData);
	}

	/**
	 * Only intended for use by UI5Element.js
	 * @protected
	 */
	static validateSlotValue(value, slotData) {
		return validateSingleSlot(value, slotData);
	}

	/**
	 * Returns the tag of the UI5 Element without the scope
	 * @public
	 */
	getPureTag() {
		return this.metadata.tag;
	}

	/**
	 * Returns the tag of the UI5 Element
	 * @public
	 */
	getTag() {
		const pureTag = this.metadata.tag;
		const suffix = getEffectiveScopingSuffixForTag(pureTag);
		if (!suffix) {
			return pureTag;
		}

		return `${pureTag}-${suffix}`;
	}

	/**
	 * Used to get the tag we need to register for backwards compatibility
	 * @public
	 */
	getAltTag() {
		const pureAltTag = this.metadata.altTag;
		if (!pureAltTag) {
			return;
		}

		const suffix = getEffectiveScopingSuffixForTag(pureAltTag);
		if (!suffix) {
			return pureAltTag;
		}

		return `${pureAltTag}-${suffix}`;
	}

	/**
	 * Determines whether a property should have an attribute counterpart
	 * @public
	 * @param propName
	 * @returns {boolean}
	 */
	hasAttribute(propName) {
		const propData = this.getProperties()[propName];
		return propData.type !== Object && !propData.noAttribute;
	}

	/**
	 * Returns an array with the properties of the UI5 Element (in camelCase)
	 * @public
	 * @returns {string[]}
	 */
	getPropertiesList() {
		return Object.keys(this.getProperties());
	}

	/**
	 * Returns an array with the attributes of the UI5 Element (in kebab-case)
	 * @public
	 * @returns {string[]}
	 */
	getAttributesList() {
		return this.getPropertiesList().filter(this.hasAttribute, this).map(camelToKebabCase);
	}

	/**
	 * Returns an object with key-value pairs of slots and their metadata definitions
	 * @public
	 */
	getSlots() {
		return this.metadata.slots || {};
	}

	/**
	 * Determines whether this UI5 Element has a default slot of type Node, therefore can slot text
	 * @returns {boolean}
	 */
	canSlotText() {
		const defaultSlot = this.getSlots().default;
		return defaultSlot && defaultSlot.type === Node;
	}

	/**
	 * Determines whether this UI5 Element supports any slots
	 * @public
	 */
	hasSlots() {
		return !!Object.entries(this.getSlots()).length;
	}

	/**
	 * Determines whether this UI5 Element supports any slots with "individualSlots: true"
	 * @public
	 */
	hasIndividualSlots() {
		return this.slotsAreManaged() && Object.entries(this.getSlots()).some(([_slotName, slotData]) => slotData.individualSlots);
	}

	/**
	 * Determines whether this UI5 Element needs to invalidate if children are added/removed/changed
	 * @public
	 */
	slotsAreManaged() {
		return !!this.metadata.managedSlots;
	}

	/**
	 * Returns an object with key-value pairs of properties and their metadata definitions
	 * @public
	 */
	getProperties() {
		return this.metadata.properties || {};
	}

	/**
	 * Returns an object with key-value pairs of events and their metadata definitions
	 * @public
	 */
	getEvents() {
		return this.metadata.events || {};
	}

	/**
	 * Determines whether this UI5 Element has any translatable texts (needs to be invalidated upon language change)
	 * @returns {boolean}
	 */
	isLanguageAware() {
		return !!this.metadata.languageAware;
	}

	/**
	 * Matches a changed entity (property/slot) with the given name against the "invalidateOnChildChange" configuration
	 * and determines whether this should cause and invalidation
	 *
	 * @param slotName the name of the slot in which a child was changed
	 * @param type the type of change in the child: "property" or "slot"
	 * @param name the name of the property/slot that changed
	 * @returns {boolean}
	 */
	shouldInvalidateOnChildChange(slotName, type, name) {
		const config = this.getSlots()[slotName].invalidateOnChildChange;

		// invalidateOnChildChange was not set in the slot metadata - by default child changes do not affect the component
		if (config === undefined) {
			return false;
		}

		// The simple format was used: invalidateOnChildChange: true/false;
		if (typeof config === "boolean") {
			return config;
		}

		// The complex format was used: invalidateOnChildChange: { properties, slots }
		if (typeof config === "object") {
			// A property was changed
			if (type === "property") {
				// The config object does not have a properties field
				if (config.properties === undefined) {
					return false;
				}

				// The config object has the short format: properties: true/false
				if (typeof config.properties === "boolean") {
					return config.properties;
				}

				// The config object has the complex format: properties: [...]
				if (Array.isArray(config.properties)) {
					return config.properties.includes(name);
				}

				throw new Error("Wrong format for invalidateOnChildChange.properties: boolean or array is expected");
			}

			// A slot was changed
			if (type === "slot") {
				// The config object does not have a slots field
				if (config.slots === undefined) {
					return false;
				}

				// The config object has the short format: slots: true/false
				if (typeof config.slots === "boolean") {
					return config.slots;
				}

				// The config object has the complex format: slots: [...]
				if (Array.isArray(config.slots)) {
					return config.slots.includes(name);
				}

				throw new Error("Wrong format for invalidateOnChildChange.slots: boolean or array is expected");
			}
		}

		throw new Error("Wrong format for invalidateOnChildChange: boolean or object is expected");
	}
}

const validateSingleProperty = (value, propData) => {
	const propertyType = propData.type;

	if (propertyType === Boolean) {
		return typeof value === "boolean" ? value : false;
	}
	if (propertyType === String) {
		return (typeof value === "string" || typeof value === "undefined" || value === null) ? value : value.toString();
	}
	if (propertyType === Object) {
		return typeof value === "object" ? value : propData.defaultValue;
	}
	if (isDescendantOf(propertyType, DataType)) {
		return propertyType.isValid(value) ? value : propData.defaultValue;
	}
};

const validateSingleSlot = (value, slotData) => {
	value && getSlottedElements(value).forEach(el => {
		if (!(el instanceof slotData.type)) {
			throw new Error(`${el} is not of type ${slotData.type}`);
		}
	});

	return value;
};

const getSingletonElementInstance = (tag, parentElement = document.body) => {
	let el = document.querySelector(tag);

	if (el) {
		return el;
	}

	el = document.createElement(tag);

	return parentElement.insertBefore(el, parentElement.firstChild);
};

if (!customElements.get("ui5-static-area")) {
	customElements.define("ui5-static-area", class extends HTMLElement {});
}

/**
 * Runs a component's template with the component's current state, while also scoping HTML
 *
 * @param template - the template to execute
 * @param component - the component
 * @public
 * @returns {*}
 */
const executeTemplate = (template, component) => {
	const tagsToScope = component.constructor.getUniqueDependencies().map(dep => dep.getMetadata().getPureTag()).filter(shouldScopeCustomElement);
	const scope = getCustomElementsScopingSuffix();
	return template(component, tagsToScope, scope);
};

const MAX_PROCESS_COUNT = 10;

class RenderQueue {
	constructor() {
		this.list = []; // Used to store the web components in order
		this.lookup = new Set(); // Used for faster search
	}

	add(webComponent) {
		if (this.lookup.has(webComponent)) {
			return;
		}

		this.list.push(webComponent);
		this.lookup.add(webComponent);
	}

	remove(webComponent) {
		if (!this.lookup.has(webComponent)) {
			return;
		}

		this.list = this.list.filter(item => item !== webComponent);
		this.lookup.delete(webComponent);
	}

	shift() {
		const webComponent = this.list.shift();
		if (webComponent) {
			this.lookup.delete(webComponent);
			return webComponent;
		}
	}

	isEmpty() {
		return this.list.length === 0;
	}

	isAdded(webComponent) {
		return this.lookup.has(webComponent);
	}

	/**
	 * Processes the whole queue by executing the callback on each component,
	 * while also imposing restrictions on how many times a component may be processed.
	 *
	 * @param callback - function with one argument (the web component to be processed)
	 */
	process(callback) {
		let webComponent;
		const stats = new Map();

		webComponent = this.shift();
		while (webComponent) {
			const timesProcessed = stats.get(webComponent) || 0;
			if (timesProcessed > MAX_PROCESS_COUNT) {
				throw new Error(`Web component processed too many times this task, max allowed is: ${MAX_PROCESS_COUNT}`);
			}
			callback(webComponent);
			stats.set(webComponent, timesProcessed + 1);
			webComponent = this.shift();
		}
	}
}

// This is needed as IE11 doesn't have Set.prototype.keys/values/entries, so [...mySet.values()] is not an option
const setToArray = s => {
	const arr = [];
	s.forEach(item => {
		arr.push(item);
	});
	return arr;
};

const Definitions = new Set();
const Failures = new Set();
let failureTimeout;

const registerTag = tag => {
	Definitions.add(tag);
};

const isTagRegistered = tag => {
	return Definitions.has(tag);
};

const getAllRegisteredTags = () => {
	return setToArray(Definitions);
};

const recordTagRegistrationFailure = tag => {
	Failures.add(tag);
	if (!failureTimeout) {
		failureTimeout = setTimeout(() => {
			displayFailedRegistrations();
			failureTimeout = undefined;
		}, 1000);
	}
};

const displayFailedRegistrations = () => {
	console.warn(`The following tags have already been defined by a different UI5 Web Components version: ${setToArray(Failures).join(", ")}`); // eslint-disable-line
	Failures.clear();
};

const rtlAwareSet = new Set();

const markAsRtlAware = klass => {
	rtlAwareSet.add(klass);
};

const registeredElements = new Set();
const eventProvider$2 = new EventProvider();

const invalidatedWebComponents = new RenderQueue(); // Queue for invalidated web components

let renderTaskPromise,
	renderTaskPromiseResolve;

let mutationObserverTimer;

let queuePromise;

/**
 * Schedules a render task (if not already scheduled) to render the component
 *
 * @param webComponent
 * @returns {Promise}
 */
const renderDeferred = async webComponent => {
	// Enqueue the web component
	invalidatedWebComponents.add(webComponent);

	// Schedule a rendering task
	await scheduleRenderTask();
};

/**
 * Renders a component synchronously and adds it to the registry of rendered components
 *
 * @param webComponent
 */
const renderImmediately = webComponent => {
	eventProvider$2.fireEvent("beforeComponentRender", webComponent);
	registeredElements.add(webComponent);
	webComponent._render();
};

/**
 * Cancels the rendering of a component, if awaiting to be rendered, and removes it from the registry of rendered components
 *
 * @param webComponent
 */
const cancelRender = webComponent => {
	invalidatedWebComponents.remove(webComponent);
	registeredElements.delete(webComponent);
};

/**
 * Schedules a rendering task, if not scheduled already
 */
const scheduleRenderTask = async () => {
	if (!queuePromise) {
		queuePromise = new Promise(resolve => {
			window.requestAnimationFrame(() => {
				// Render all components in the queue

				// console.log(`--------------------RENDER TASK START------------------------------`); // eslint-disable-line
				invalidatedWebComponents.process(renderImmediately);
				// console.log(`--------------------RENDER TASK END------------------------------`); // eslint-disable-line

				// Resolve the promise so that callers of renderDeferred can continue
				queuePromise = null;
				resolve();

				// Wait for Mutation observer before the render task is considered finished
				if (!mutationObserverTimer) {
					mutationObserverTimer = setTimeout(() => {
						mutationObserverTimer = undefined;
						if (invalidatedWebComponents.isEmpty()) {
							_resolveTaskPromise();
						}
					}, 200);
				}
			});
		});
	}

	await queuePromise;
};

/**
 * return a promise that will be resolved once all invalidated web components are rendered
 */
const whenDOMUpdated = () => {
	if (renderTaskPromise) {
		return renderTaskPromise;
	}

	renderTaskPromise = new Promise(resolve => {
		renderTaskPromiseResolve = resolve;
		window.requestAnimationFrame(() => {
			if (invalidatedWebComponents.isEmpty()) {
				renderTaskPromise = undefined;
				resolve();
			}
		});
	});

	return renderTaskPromise;
};

const whenAllCustomElementsAreDefined = () => {
	const definedPromises = getAllRegisteredTags().map(tag => customElements.whenDefined(tag));
	return Promise.all(definedPromises);
};

const renderFinished = async () => {
	await whenAllCustomElementsAreDefined();
	await whenDOMUpdated();
};

const _resolveTaskPromise = () => {
	if (!invalidatedWebComponents.isEmpty()) {
		// More updates are pending. Resolve will be called again
		return;
	}

	if (renderTaskPromiseResolve) {
		renderTaskPromiseResolve();
		renderTaskPromiseResolve = undefined;
		renderTaskPromise = undefined;
	}
};

const eventProvider$1 = new EventProvider();
const CUSTOM_CSS_CHANGE = "CustomCSSChange";

const attachCustomCSSChange = listener => {
	eventProvider$1.attachEvent(CUSTOM_CSS_CHANGE, listener);
};

const customCSSFor = {};

const getCustomCSS = tag => {
	return customCSSFor[tag] ? customCSSFor[tag].join("") : "";
};

const getStylesString = styles => {
	if (Array.isArray(styles)) {
		return flatten(styles.filter(style => !!style)).join(" ");
	}

	return styles;
};

const flatten = arr => {
	return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
};

const effectiveStyleMap = new Map();

attachCustomCSSChange(tag => {
	effectiveStyleMap.delete(`${tag}_normal`); // there is custom CSS only for the component itself, not for its static area part
});

const getEffectiveStyle = (ElementClass, forStaticArea = false) => {
	const tag = ElementClass.getMetadata().getTag();
	const key = `${tag}_${forStaticArea ? "static" : "normal"}`;

	if (!effectiveStyleMap.has(key)) {
		let effectiveStyle;

		if (forStaticArea) {
			effectiveStyle = getStylesString(ElementClass.staticAreaStyles);
		} else {
			const customStyle = getCustomCSS(tag) || "";
			const builtInStyles = getStylesString(ElementClass.styles);
			effectiveStyle = `${builtInStyles} ${customStyle}`;
		}
		effectiveStyleMap.set(key, effectiveStyle);
	}

	return effectiveStyleMap.get(key);
};

const constructableStyleMap = new Map();

attachCustomCSSChange(tag => {
	constructableStyleMap.delete(`${tag}_normal`); // there is custom CSS only for the component itself, not for its static area part
});

/**
 * Returns (and caches) a constructable style sheet for a web component class
 * Note: Chrome
 * @param ElementClass
 * @returns {*}
 */
const getConstructableStyle = (ElementClass, forStaticArea = false) => {
	const tag = ElementClass.getMetadata().getTag();
	const key = `${tag}_${forStaticArea ? "static" : "normal"}`;

	if (!constructableStyleMap.has(key)) {
		const styleContent = getEffectiveStyle(ElementClass, forStaticArea);
		const style = new CSSStyleSheet();
		style.replaceSync(styleContent);
		constructableStyleMap.set(key, [style]);
	}

	return constructableStyleMap.get(key);
};

const isLegacyBrowser = () => !!window.ShadyDOM;

/**
 * Updates the shadow root of a UI5Element or its static area item
 * @param element
 * @param forStaticArea
 */
const updateShadowRoot = (element, forStaticArea = false) => {
	let styleToPrepend;
	const template = forStaticArea ? "staticAreaTemplate" : "template";
	const shadowRoot = forStaticArea ? element.staticAreaItem.shadowRoot : element.shadowRoot;
	const renderResult = executeTemplate(element.constructor[template], element);

	if (document.adoptedStyleSheets) { // Chrome
		shadowRoot.adoptedStyleSheets = getConstructableStyle(element.constructor, forStaticArea);
	} else if (!isLegacyBrowser()) { // FF, Safari
		styleToPrepend = getEffectiveStyle(element.constructor, forStaticArea);
	}

	element.constructor.render(renderResult, shadowRoot, styleToPrepend, { host: element });
};

const GLOBAL_CONTENT_DENSITY_CSS_VAR = "--_ui5_content_density";

const getEffectiveContentDensity = el => getComputedStyle(el).getPropertyValue(GLOBAL_CONTENT_DENSITY_CSS_VAR);

/**
 *
 * @class
 * @author SAP SE
 * @private
 */
class StaticAreaItem extends HTMLElement {
	constructor() {
		super();
		this._rendered = false;
		this.attachShadow({ mode: "open" });
	}

	/**
	 * @protected
	 * @param ownerElement The UI5Element instance that owns this static area item
	 */
	setOwnerElement(ownerElement) {
		this.ownerElement = ownerElement;
		this.classList.add(this.ownerElement._id); // used for getting the popover in the tests
	}

	/**
	 * Updates the shadow root of the static area item with the latest state, if rendered
	 * @protected
	 */
	update() {
		if (this._rendered) {
			this._updateContentDensity();
			updateShadowRoot(this.ownerElement, true);
		}
	}

	/**
	 * Sets the correct content density based on the owner element's state
	 * @private
	 */
	_updateContentDensity() {
		if (getEffectiveContentDensity(this.ownerElement) === "compact") {
			this.classList.add("sapUiSizeCompact");
			this.classList.add("ui5-content-density-compact");
		} else {
			this.classList.remove("sapUiSizeCompact");
			this.classList.remove("ui5-content-density-compact");
		}
	}

	/**
	 * @protected
	 * Returns reference to the DOM element where the current fragment is added.
	 */
	async getDomRef() {
		this._updateContentDensity();
		if (!this._rendered) {
			this._rendered = true;
			updateShadowRoot(this.ownerElement, true);
		}
		await renderFinished(); // Wait for the content of the ui5-static-area-item to be rendered
		return this.shadowRoot;
	}

	/**
	 * @protected
	 * @param refName
	 * @returns {Element}
	 */
	getStableDomRef(refName) {
		return this.shadowRoot.querySelector(`[data-ui5-stable=${refName}]`);
	}

	static getTag() {
		const pureTag = "ui5-static-area-item";
		const suffix = getEffectiveScopingSuffixForTag(pureTag);
		if (!suffix) {
			return pureTag;
		}

		return `${pureTag}-${suffix}`;
	}

	static createInstance() {
		if (!customElements.get(StaticAreaItem.getTag())) {
			customElements.define(StaticAreaItem.getTag(), StaticAreaItem);
		}

		return document.createElement(this.getTag());
	}
}

const observers = new WeakMap(); // We want just one observer per node, store them here -> DOM nodes are keys

/**
 * Default implementation with MutationObserver for browsers with native support
 */
let _createObserver = (node, callback, options) => {
	const observer = new MutationObserver(callback);
	observer.observe(node, options);
	return observer;
};

/**
 * Default implementation with MutationObserver for browsers with native support
 */
let _destroyObserver = observer => {
	observer.disconnect();
};

/**
 * @param node
 * @param callback
 * @param options
 */
const observeDOMNode = (node, callback, options) => {
	const observer = _createObserver(node, callback, options);
	observers.set(node, observer);
};

/**
 * @param node
 */
const unobserveDOMNode = node => {
	const observer = observers.get(node);
	if (observer) {
		_destroyObserver(observer);
		observers.delete(node);
	}
};

// Fire these events even with noConflict: true
const excludeList = [
	"value-changed",
];

const shouldFireOriginalEvent = eventName => {
	return excludeList.includes(eventName);
};

let noConflict;

const shouldNotFireOriginalEvent = eventName => {
	const nc = getNoConflict();
	return !(nc.events && nc.events.includes && nc.events.includes(eventName));
};

const getNoConflict = () => {
	if (noConflict === undefined) {
		noConflict = getNoConflict$1();
	}

	return noConflict;
};

const skipOriginalEvent = eventName => {
	const nc = getNoConflict();

	// Always fire these events
	if (shouldFireOriginalEvent(eventName)) {
		return false;
	}

	// Read from the configuration
	if (nc === true) {
		return true;
	}

	return !shouldNotFireOriginalEvent(eventName);
};

const eventProvider = new EventProvider();
const LANG_CHANGE = "languageChange";

const attachLanguageChange = listener => {
	eventProvider.attachEvent(LANG_CHANGE, listener);
};

let language;
let fetchDefaultLanguage;

/**
 * Returns the currently configured language, or the browser language as a fallback
 * @returns {String}
 */
const getLanguage = () => {
	if (language === undefined) {
		language = getLanguage$1();
	}
	return language;
};

/**
 * Defines if the default language, that is inlined, should be
 * fetched over the network instead of using the inlined one.
 * <b>Note:</b> By default the language will not be fetched.
 *
 * @param {Boolean} fetchDefaultLanguage
 */
const setFetchDefaultLanguage = fetchDefaultLang => {
	fetchDefaultLanguage = fetchDefaultLang;
};

/**
 * Returns if the default language, that is inlined, should be fetched over the network.
 * @returns {Boolean}
 */
const getFetchDefaultLanguage = () => {
	if (fetchDefaultLanguage === undefined) {
		setFetchDefaultLanguage(getFetchDefaultLanguage$1());
	}

	return fetchDefaultLanguage;
};

var getDesigntimePropertyAsArray = value => {
	const m = /\$([-a-z0-9A-Z._]+)(?::([^$]*))?\$/.exec(value);
	return m && m[2] ? m[2].split(/,/) : null;
};

var detectNavigatorLanguage = () => {
	const browserLanguages = navigator.languages;

	const navigatorLanguage = () => {
		return navigator.language;
	};

	const rawLocale = (browserLanguages && browserLanguages[0]) || navigatorLanguage() || navigator.userLanguage || navigator.browserLanguage;

	return rawLocale || DEFAULT_LANGUAGE;
};

const M_ISO639_OLD_TO_NEW = {
	"iw": "he",
	"ji": "yi",
	"in": "id",
	"sh": "sr",
};

const A_RTL_LOCALES = getDesigntimePropertyAsArray("$cldr-rtl-locales:ar,fa,he$") || [];

const impliesRTL = language => {
	language = (language && M_ISO639_OLD_TO_NEW[language]) || language;

	return A_RTL_LOCALES.indexOf(language) >= 0;
};

const getRTL = () => {
	const configurationRTL = getRTL$1();

	if (configurationRTL !== null) {
		return !!configurationRTL;
	}

	return impliesRTL(getLanguage() || detectNavigatorLanguage());
};

const GLOBAL_DIR_CSS_VAR = "--_ui5_dir";

const getEffectiveDir = element => {
	const doc = window.document;
	const dirValues = ["ltr", "rtl"]; // exclude "auto" and "" from all calculations
	const locallyAppliedDir = getComputedStyle(element).getPropertyValue(GLOBAL_DIR_CSS_VAR);

	// In that order, inspect the CSS Var (for modern browsers), the element itself, html and body (for IE fallback)
	if (dirValues.includes(locallyAppliedDir)) {
		return locallyAppliedDir;
	}
	if (dirValues.includes(element.dir)) {
		return element.dir;
	}
	if (dirValues.includes(doc.documentElement.dir)) {
		return doc.documentElement.dir;
	}
	if (dirValues.includes(doc.body.dir)) {
		return doc.body.dir;
	}

	// Finally, check the configuration for explicitly set RTL or language-implied RTL
	return getRTL() ? "rtl" : undefined;
};

class Integer extends DataType {
	static isValid(value) {
		return Number.isInteger(value);
	}
}

class Float extends DataType {
	static isValid(value) {
		// Assuming that integers are floats as well!
		return Number(value) === value;
	}
}

// Note: disabled is present in IE so we explicitly allow it here.
// Others, such as title/hidden, we explicitly override, so valid too
const allowList = [
	"disabled",
	"title",
	"hidden",
	"role",
	"draggable",
];

/**
 * Checks whether a property name is valid (does not collide with existing DOM API properties)
 *
 * @param name
 * @returns {boolean}
 */
const isValidPropertyName = name => {
	if (allowList.includes(name) || name.startsWith("aria")) {
		return true;
	}
	const classes = [
		HTMLElement,
		Element,
		Node,
	];
	return !classes.some(klass => klass.prototype.hasOwnProperty(name)); // eslint-disable-line
};

const arraysAreEqual = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
};

const getClassCopy = (klass, constructorCallback) => {
	return class classCopy extends klass {
		constructor() {
			super();
			constructorCallback && constructorCallback();
		}
	};
};

let autoId = 0;

const elementTimeouts = new Map();
const uniqueDependenciesCache = new Map();

/**
 * Triggers re-rendering of a UI5Element instance due to state change.
 *
 * @param  changeInfo An object with information about the change that caused invalidation.
 * @private
 */
function _invalidate(changeInfo) {
	// Invalidation should be suppressed: 1) before the component is rendered for the first time 2) and during the execution of onBeforeRendering
	// This is necessary not only as an optimization, but also to avoid infinite loops on invalidation between children and parents (when invalidateOnChildChange is used)
	if (this._suppressInvalidation) {
		return;
	}

	// Call the onInvalidation hook
	this.onInvalidation(changeInfo);

	this._changedState.push(changeInfo);
	renderDeferred(this);
	this._eventProvider.fireEvent("change", { ...changeInfo, target: this });
}

/**
 * Base class for all UI5 Web Components
 *
 * @class
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.base.UI5Element
 * @extends HTMLElement
 * @public
 */
class UI5Element extends HTMLElement {
	constructor() {
		super();

		this._changedState = []; // Filled on each invalidation, cleared on re-render (used for debugging)
		this._suppressInvalidation = true; // A flag telling whether all invalidations should be ignored. Initialized with "true" because a UI5Element can not be invalidated until it is rendered for the first time
		this._inDOM = false; // A flag telling whether the UI5Element is currently in the DOM tree of the document or not
		this._fullyConnected = false; // A flag telling whether the UI5Element's onEnterDOM hook was called (since it's possible to have the element removed from DOM before that)
		this._childChangeListeners = new Map(); // used to store lazy listeners per slot for the child change event of every child inside that slot
		this._slotChangeListeners = new Map(); // used to store lazy listeners per slot for the slotchange event of all slot children inside that slot
		this._eventProvider = new EventProvider(); // used by parent components for listening to changes to child components
		let deferredResolve;
		this._domRefReadyPromise = new Promise(resolve => {
			deferredResolve = resolve;
		});
		this._domRefReadyPromise._deferredResolve = deferredResolve;

		this._initializeState();
		this._upgradeAllProperties();

		if (this.constructor._needsShadowDOM()) {
			this.attachShadow({ mode: "open" });
		}
	}

	/**
	 * Returns a unique ID for this UI5 Element
	 *
	 * @deprecated - This property is not guaranteed in future releases
	 * @protected
	 */
	get _id() {
		if (!this.__id) {
			this.__id = `ui5wc_${++autoId}`;
		}

		return this.__id;
	}

	/**
	 * Do not call this method from derivatives of UI5Element, use "onEnterDOM" only
	 * @private
	 */
	async connectedCallback() {
		this.setAttribute(this.constructor.getMetadata().getPureTag(), "");

		const needsShadowDOM = this.constructor._needsShadowDOM();
		const slotsAreManaged = this.constructor.getMetadata().slotsAreManaged();

		this._inDOM = true;

		if (slotsAreManaged) {
			// always register the observer before yielding control to the main thread (await)
			this._startObservingDOMChildren();
			await this._processChildren();
		}

		if (needsShadowDOM && !this.shadowRoot) { // Workaround for Firefox74 bug
			await Promise.resolve();
		}

		if (!this._inDOM) { // Component removed from DOM while _processChildren was running
			return;
		}

		renderImmediately(this);
		this._domRefReadyPromise._deferredResolve();
		this._fullyConnected = true;
		if (typeof this.onEnterDOM === "function") {
			this.onEnterDOM();
		}
	}

	/**
	 * Do not call this method from derivatives of UI5Element, use "onExitDOM" only
	 * @private
	 */
	disconnectedCallback() {
		const needsShadowDOM = this.constructor._needsShadowDOM();
		const slotsAreManaged = this.constructor.getMetadata().slotsAreManaged();

		this._inDOM = false;

		if (slotsAreManaged) {
			this._stopObservingDOMChildren();
		}

		if (needsShadowDOM) {
			if (this._fullyConnected) {
				if (typeof this.onExitDOM === "function") {
					this.onExitDOM();
				}
				this._fullyConnected = false;
			}
		}

		if (this.staticAreaItem && this.staticAreaItem.parentElement) {
			this.staticAreaItem.parentElement.removeChild(this.staticAreaItem);
		}

		cancelRender(this);
	}

	/**
	 * @private
	 */
	_startObservingDOMChildren() {
		const shouldObserveChildren = this.constructor.getMetadata().hasSlots();
		if (!shouldObserveChildren) {
			return;
		}

		const canSlotText = this.constructor.getMetadata().canSlotText();
		const mutationObserverOptions = {
			childList: true,
			subtree: canSlotText,
			characterData: canSlotText,
		};
		observeDOMNode(this, this._processChildren.bind(this), mutationObserverOptions);
	}

	/**
	 * @private
	 */
	_stopObservingDOMChildren() {
		unobserveDOMNode(this);
	}

	/**
	 * Note: this method is also manually called by "compatibility/patchNodeValue.js"
	 * @private
	 */
	async _processChildren() {
		const hasSlots = this.constructor.getMetadata().hasSlots();
		if (hasSlots) {
			await this._updateSlots();
		}
	}

	/**
	 * @private
	 */
	async _updateSlots() {
		const slotsMap = this.constructor.getMetadata().getSlots();
		const canSlotText = this.constructor.getMetadata().canSlotText();
		const domChildren = Array.from(canSlotText ? this.childNodes : this.children);

		const slotsCachedContentMap = new Map(); // Store here the content of each slot before the mutation occurred
		const propertyNameToSlotMap = new Map(); // Used for reverse lookup to determine to which slot the property name corresponds

		// Init the _state object based on the supported slots and store the previous values
		for (const [slotName, slotData] of Object.entries(slotsMap)) { // eslint-disable-line
			const propertyName = slotData.propertyName || slotName;
			propertyNameToSlotMap.set(propertyName, slotName);
			slotsCachedContentMap.set(propertyName, [...this._state[propertyName]]);
			this._clearSlot(slotName, slotData);
		}

		const autoIncrementMap = new Map();
		const slottedChildrenMap = new Map();

		const allChildrenUpgraded = domChildren.map(async (child, idx) => {
			// Determine the type of the child (mainly by the slot attribute)
			const slotName = getSlotName(child);
			const slotData = slotsMap[slotName];

			// Check if the slotName is supported
			if (slotData === undefined) {
				const validValues = Object.keys(slotsMap).join(", ");
				console.warn(`Unknown slotName: ${slotName}, ignoring`, child, `Valid values are: ${validValues}`); // eslint-disable-line
				return;
			}

			// For children that need individual slots, calculate them
			if (slotData.individualSlots) {
				const nextIndex = (autoIncrementMap.get(slotName) || 0) + 1;
				autoIncrementMap.set(slotName, nextIndex);
				child._individualSlot = `${slotName}-${nextIndex}`;
			}

			// Await for not-yet-defined custom elements
			if (child instanceof HTMLElement) {
				const localName = child.localName;
				const isCustomElement = localName.includes("-");
				if (isCustomElement) {
					const isDefined = window.customElements.get(localName);
					if (!isDefined) {
						const whenDefinedPromise = window.customElements.whenDefined(localName); // Class registered, but instances not upgraded yet
						let timeoutPromise = elementTimeouts.get(localName);
						if (!timeoutPromise) {
							timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
							elementTimeouts.set(localName, timeoutPromise);
						}
						await Promise.race([whenDefinedPromise, timeoutPromise]);
					}
					window.customElements.upgrade(child);
				}
			}

			child = this.constructor.getMetadata().constructor.validateSlotValue(child, slotData);

			// Listen for any invalidation on the child if invalidateOnChildChange is true or an object (ignore when false or not set)
			if (child.isUI5Element && slotData.invalidateOnChildChange) {
				child._attachChange(this._getChildChangeListener(slotName));
			}

			// Listen for the slotchange event if the child is a slot itself
			if (isSlot(child)) {
				this._attachSlotChange(child, slotName);
			}

			const propertyName = slotData.propertyName || slotName;

			if (slottedChildrenMap.has(propertyName)) {
				slottedChildrenMap.get(propertyName).push({ child, idx });
			} else {
				slottedChildrenMap.set(propertyName, [{ child, idx }]);
			}
		});

		await Promise.all(allChildrenUpgraded);

		// Distribute the child in the _state object, keeping the Light DOM order,
		// not the order elements are defined.
		slottedChildrenMap.forEach((children, propertyName) => {
			this._state[propertyName] = children.sort((a, b) => a.idx - b.idx).map(_ => _.child);
		});

		// Compare the content of each slot with the cached values and invalidate for the ones that changed
		let invalidated = false;
		for (const [slotName, slotData] of Object.entries(slotsMap)) { // eslint-disable-line
			const propertyName = slotData.propertyName || slotName;
			if (!arraysAreEqual(slotsCachedContentMap.get(propertyName), this._state[propertyName])) {
				_invalidate.call(this, {
					type: "slot",
					name: propertyNameToSlotMap.get(propertyName),
					reason: "children",
				});
				invalidated = true;
			}
		}

		// If none of the slots had an invalidation due to changes to immediate children,
		// the change is considered to be text content of the default slot
		if (!invalidated) {
			_invalidate.call(this, {
				type: "slot",
				name: "default",
				reason: "textcontent",
			});
		}
	}

	/**
	 * Removes all children from the slot and detaches listeners, if any
	 * @private
	 */
	_clearSlot(slotName, slotData) {
		const propertyName = slotData.propertyName || slotName;
		const children = this._state[propertyName];

		children.forEach(child => {
			if (child && child.isUI5Element) {
				child._detachChange(this._getChildChangeListener(slotName));
			}

			if (isSlot(child)) {
				this._detachSlotChange(child, slotName);
			}
		});

		this._state[propertyName] = [];
	}

	/**
	 * Attach a callback that will be executed whenever the component is invalidated
	 *
	 * @param callback
	 * @protected
	 */
	_attachChange(callback) {
		this._eventProvider.attachEvent("change", callback);
	}

	/**
	 * Detach the callback that is executed whenever the component is invalidated
	 *
	 * @param callback
	 * @protected
	 */
	_detachChange(callback) {
		this._eventProvider.detachEvent("change", callback);
	}

	/**
	 * Callback that is executed whenever a monitored child changes its state
	 *
	 * @param slotName the slot in which a child was invalidated
	 * @param childChangeInfo the changeInfo object for the child in the given slot
	 * @private
	 */
	_onChildChange(slotName, childChangeInfo) {
		if (!this.constructor.getMetadata().shouldInvalidateOnChildChange(slotName, childChangeInfo.type, childChangeInfo.name)) {
			return;
		}

		// The component should be invalidated as this type of change on the child is listened for
		// However, no matter what changed on the child (property/slot), the invalidation is registered as "type=slot" for the component itself
		_invalidate.call(this, {
			type: "slot",
			name: slotName,
			reason: "childchange",
			child: childChangeInfo.target,
		});
	}

	/**
	 * Do not override this method in derivatives of UI5Element
	 * @private
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		const properties = this.constructor.getMetadata().getProperties();
		const realName = name.replace(/^ui5-/, "");
		const nameInCamelCase = kebabToCamelCase(realName);
		if (properties.hasOwnProperty(nameInCamelCase)) { // eslint-disable-line
			const propertyTypeClass = properties[nameInCamelCase].type;
			if (propertyTypeClass === Boolean) {
				newValue = newValue !== null;
			}
			if (propertyTypeClass === Integer) {
				newValue = parseInt(newValue);
			}
			if (propertyTypeClass === Float) {
				newValue = parseFloat(newValue);
			}
			this[nameInCamelCase] = newValue;
		}
	}

	/**
	 * @private
	 */
	_updateAttribute(name, newValue) {
		if (!this.constructor.getMetadata().hasAttribute(name)) {
			return;
		}

		if (typeof newValue === "object") {
			return;
		}

		const attrName = camelToKebabCase(name);
		const attrValue = this.getAttribute(attrName);
		if (typeof newValue === "boolean") {
			if (newValue === true && attrValue === null) {
				this.setAttribute(attrName, "");
			} else if (newValue === false && attrValue !== null) {
				this.removeAttribute(attrName);
			}
		} else if (attrValue !== newValue) {
			this.setAttribute(attrName, newValue);
		}
	}

	/**
	 * @private
	 */
	_upgradeProperty(prop) {
		if (this.hasOwnProperty(prop)) { // eslint-disable-line
			const value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	/**
	 * @private
	 */
	_upgradeAllProperties() {
		const allProps = this.constructor.getMetadata().getPropertiesList();
		allProps.forEach(this._upgradeProperty, this);
	}

	/**
	 * @private
	 */
	_initializeState() {
		this._state = { ...this.constructor.getMetadata().getInitialState() };
	}

	/**
	 * Returns a singleton event listener for the "change" event of a child in a given slot
	 *
	 * @param slotName the name of the slot, where the child is
	 * @returns {any}
	 * @private
	 */
	_getChildChangeListener(slotName) {
		if (!this._childChangeListeners.has(slotName)) {
			this._childChangeListeners.set(slotName, this._onChildChange.bind(this, slotName));
		}
		return this._childChangeListeners.get(slotName);
	}

	/**
	 * Returns a singleton slotchange event listener that invalidates the component due to changes in the given slot
	 *
	 * @param slotName the name of the slot, where the slot element (whose slotchange event we're listening to) is
	 * @returns {any}
	 * @private
	 */
	_getSlotChangeListener(slotName) {
		if (!this._slotChangeListeners.has(slotName)) {
			this._slotChangeListeners.set(slotName, this._onSlotChange.bind(this, slotName));
		}
		return this._slotChangeListeners.get(slotName);
	}

	/**
	 * @private
	 */
	_attachSlotChange(child, slotName) {
		child.addEventListener("slotchange", this._getSlotChangeListener(slotName));
	}

	/**
	 * @private
	 */
	_detachSlotChange(child, slotName) {
		child.removeEventListener("slotchange", this._getSlotChangeListener(slotName));
	}

	/**
	 * Whenever a slot element is slotted inside a UI5 Web Component, its slotchange event invalidates the component
	 *
	 * @param slotName the name of the slot, where the slot element (whose slotchange event we're listening to) is
	 * @private
	 */
	_onSlotChange(slotName) {
		_invalidate.call(this, {
			type: "slot",
			name: slotName,
			reason: "slotchange",
		});
	}

	/**
	 * A callback that is executed each time an already rendered component is invalidated (scheduled for re-rendering)
	 *
	 * @param  changeInfo An object with information about the change that caused invalidation.
	 * The object can have the following properties:
	 *  - type: (property|slot) tells what caused the invalidation
	 *   1) property: a property value was changed either directly or as a result of changing the corresponding attribute
	 *   2) slot: a slotted node(nodes) changed in one of several ways (see "reason")
	 *
	 *  - name: the name of the property or slot that caused the invalidation
	 *
	 *  - reason: (children|textcontent|childchange|slotchange) relevant only for type="slot" only and tells exactly what changed in the slot
	 *   1) children: immediate children (HTML elements or text nodes) were added, removed or reordered in the slot
	 *   2) textcontent: text nodes in the slot changed value (or nested text nodes were added or changed value). Can only trigger for slots of "type: Node"
	 *   3) slotchange: a slot element, slotted inside that slot had its "slotchange" event listener called. This practically means that transitively slotted children changed.
	 *      Can only trigger if the child of a slot is a slot element itself.
	 *   4) childchange: indicates that a UI5Element child in that slot was invalidated and in turn invalidated the component.
	 *      Can only trigger for slots with "invalidateOnChildChange" metadata descriptor
	 *
	 *  - newValue: the new value of the property (for type="property" only)
	 *
	 *  - oldValue: the old value of the property (for type="property" only)
	 *
	 *  - child the child that was changed (for type="slot" and reason="childchange" only)
	 *
	 * @public
	 */
	onInvalidation(changeInfo) {}

	/**
	 * Do not call this method directly, only intended to be called by js
	 * @protected
	 */
	_render() {
		const hasIndividualSlots = this.constructor.getMetadata().hasIndividualSlots();

		// suppress invalidation to prevent state changes scheduling another rendering
		this._suppressInvalidation = true;

		if (typeof this.onBeforeRendering === "function") {
			this.onBeforeRendering();
		}

		// Intended for framework usage only. Currently ItemNavigation updates tab indexes after the component has updated its state but before the template is rendered
		if (this._onComponentStateFinalized) {
			this._onComponentStateFinalized();
		}

		// resume normal invalidation handling
		this._suppressInvalidation = false;

		// Update the shadow root with the render result
		/*
		if (this._changedState.length) {
			let element = this.localName;
			if (this.id) {
				element = `${element}#${this.id}`;
			}
			console.log("Re-rendering:", element, this._changedState.map(x => { // eslint-disable-line
				let res = `${x.type}`;
				if (x.reason) {
					res = `${res}(${x.reason})`;
				}
				res = `${res}: ${x.name}`;
				if (x.type === "property") {
					res = `${res} ${x.oldValue} => ${x.newValue}`;
				}

				return res;
			}));
		}
		*/
		this._changedState = [];

		// Update shadow root and static area item
		if (this.constructor._needsShadowDOM()) {
			updateShadowRoot(this);
		}
		if (this.staticAreaItem) {
			this.staticAreaItem.update();
		}

		// Safari requires that children get the slot attribute only after the slot tags have been rendered in the shadow DOM
		if (hasIndividualSlots) {
			this._assignIndividualSlotsToChildren();
		}

		// Call the onAfterRendering hook
		if (typeof this.onAfterRendering === "function") {
			this.onAfterRendering();
		}
	}

	/**
	 * @private
	 */
	_assignIndividualSlotsToChildren() {
		const domChildren = Array.from(this.children);

		domChildren.forEach(child => {
			if (child._individualSlot) {
				child.setAttribute("slot", child._individualSlot);
			}
		});
	}

	/**
	 * @private
	 */
	_waitForDomRef() {
		return this._domRefReadyPromise;
	}

	/**
	 * Returns the DOM Element inside the Shadow Root that corresponds to the opening tag in the UI5 Web Component's template
	 * Use this method instead of "this.shadowRoot" to read the Shadow DOM, if ever necessary
	 * @public
	 */
	getDomRef() {
		if (!this.shadowRoot || this.shadowRoot.children.length === 0) {
			return;
		}

		this._assertShadowRootStructure();

		return this.shadowRoot.children.length === 1
			? this.shadowRoot.children[0] : this.shadowRoot.children[1];
	}

	_assertShadowRootStructure() {
		const expectedChildrenCount = document.adoptedStyleSheets || isLegacyBrowser() ? 1 : 2;
		if (this.shadowRoot.children.length !== expectedChildrenCount) {
			console.warn(`The shadow DOM for ${this.constructor.getMetadata().getTag()} does not have a top level element, the getDomRef() method might not work as expected`); // eslint-disable-line
		}
	}

	/**
	 * Returns the DOM Element marked with "data-sap-focus-ref" inside the template.
	 * This is the element that will receive the focus by default.
	 * @public
	 */
	getFocusDomRef() {
		const domRef = this.getDomRef();
		if (domRef) {
			const focusRef = domRef.querySelector("[data-sap-focus-ref]");
			return focusRef || domRef;
		}
	}

	/**
	 * Waits for dom ref and then returns the DOM Element marked with "data-sap-focus-ref" inside the template.
	 * This is the element that will receive the focus by default.
	 * @public
	 */
	async getFocusDomRefAsync() {
		await this._waitForDomRef();
		return this.getFocusDomRef();
	}

	/**
	 * Use this method in order to get a reference to an element in the shadow root of the web component or the static area item of the component
	 * @public
	 * @method
	 * @param {String} refName Defines the name of the stable DOM ref
	 */
	getStableDomRef(refName) {
		const staticAreaResult = this.staticAreaItem && this.staticAreaItem.getStableDomRef(refName);
		return staticAreaResult || this.getDomRef().querySelector(`[data-ui5-stable=${refName}]`);
	}

	/**
	 * Set the focus to the element, returned by "getFocusDomRef()" (marked by "data-sap-focus-ref")
	 * @public
	 */
	async focus() {
		await this._waitForDomRef();

		const focusDomRef = this.getFocusDomRef();

		if (focusDomRef && typeof focusDomRef.focus === "function") {
			focusDomRef.focus();
		}
	}

	/**
	 *
	 * @public
	 * @param name - name of the event
	 * @param data - additional data for the event
	 * @param cancelable - true, if the user can call preventDefault on the event object
	 * @param bubbles - true, if the event bubbles
	 * @returns {boolean} false, if the event was cancelled (preventDefault called), true otherwise
	 */
	fireEvent(name, data, cancelable = false, bubbles = true) {
		const eventResult = this._fireEvent(name, data, cancelable, bubbles);
		const camelCaseEventName = kebabToCamelCase(name);

		if (camelCaseEventName !== name) {
			return eventResult && this._fireEvent(camelCaseEventName, data, cancelable);
		}

		return eventResult;
	}

	_fireEvent(name, data, cancelable = false, bubbles = true) {
		const noConflictEvent = new CustomEvent(`ui5-${name}`, {
			detail: data,
			composed: false,
			bubbles,
			cancelable,
		});

		// This will be false if the no-conflict event is prevented
		const noConflictEventResult = this.dispatchEvent(noConflictEvent);

		if (skipOriginalEvent(name)) {
			return noConflictEventResult;
		}

		const normalEvent = new CustomEvent(name, {
			detail: data,
			composed: false,
			bubbles,
			cancelable,
		});

		// This will be false if the normal event is prevented
		const normalEventResult = this.dispatchEvent(normalEvent);

		// Return false if any of the two events was prevented (its result was false).
		return normalEventResult && noConflictEventResult;
	}

	/**
	 * Returns the actual children, associated with a slot.
	 * Useful when there are transitive slots in nested component scenarios and you don't want to get a list of the slots, but rather of their content.
	 * @public
	 */
	getSlottedNodes(slotName) {
		return getSlottedElementsList(this[slotName]);
	}

	/**
	 * Determines whether the component should be rendered in RTL mode or not.
	 * Returns: "rtl", "ltr" or undefined
	 *
	 * @public
	 * @returns {String|undefined}
	 */
	get effectiveDir() {
		markAsRtlAware(this.constructor); // if a UI5 Element calls this method, it's considered to be rtl-aware
		return getEffectiveDir(this);
	}

	/**
	 * Used to duck-type UI5 elements without using instanceof
	 * @returns {boolean}
	 * @public
	 */
	get isUI5Element() {
		return true;
	}

	/**
	 * Do not override this method in derivatives of UI5Element, use metadata properties instead
	 * @private
	 */
	static get observedAttributes() {
		return this.getMetadata().getAttributesList();
	}

	/**
	 * @private
	 */
	static _needsShadowDOM() {
		return !!this.template;
	}

	/**
	 * @private
	 */
	static _needsStaticArea() {
		return !!this.staticAreaTemplate;
	}

	/**
	 * @public
	 */
	getStaticAreaItemDomRef() {
		if (!this.constructor._needsStaticArea()) {
			throw new Error("This component does not use the static area");
		}

		if (!this.staticAreaItem) {
			this.staticAreaItem = StaticAreaItem.createInstance();
			this.staticAreaItem.setOwnerElement(this);
		}
		if (!this.staticAreaItem.parentElement) {
			getSingletonElementInstance("ui5-static-area").appendChild(this.staticAreaItem);
		}

		return this.staticAreaItem.getDomRef();
	}

	/**
	 * @private
	 */
	static _generateAccessors() {
		const proto = this.prototype;
		const slotsAreManaged = this.getMetadata().slotsAreManaged();

		// Properties
		const properties = this.getMetadata().getProperties();
		for (const [prop, propData] of Object.entries(properties)) { // eslint-disable-line
			if (!isValidPropertyName(prop)) {
				console.warn(`"${prop}" is not a valid property name. Use a name that does not collide with DOM APIs`); /* eslint-disable-line */
			}

			if (propData.type === Boolean && propData.defaultValue) {
				throw new Error(`Cannot set a default value for property "${prop}". All booleans are false by default.`);
			}

			if (propData.type === Array) {
				throw new Error(`Wrong type for property "${prop}". Properties cannot be of type Array - use "multiple: true" and set "type" to the single value type, such as "String", "Object", etc...`);
			}

			if (propData.type === Object && propData.defaultValue) {
				throw new Error(`Cannot set a default value for property "${prop}". All properties of type "Object" are empty objects by default.`);
			}

			if (propData.multiple && propData.defaultValue) {
				throw new Error(`Cannot set a default value for property "${prop}". All multiple properties are empty arrays by default.`);
			}

			Object.defineProperty(proto, prop, {
				get() {
					if (this._state[prop] !== undefined) {
						return this._state[prop];
					}

					const propDefaultValue = propData.defaultValue;

					if (propData.type === Boolean) {
						return false;
					} else if (propData.type === String) {  // eslint-disable-line
						return propDefaultValue;
					} else if (propData.multiple) { // eslint-disable-line
						return [];
					} else {
						return propDefaultValue;
					}
				},
				set(value) {
					let isDifferent;
					value = this.constructor.getMetadata().constructor.validatePropertyValue(value, propData);

					const oldState = this._state[prop];
					if (propData.multiple && propData.compareValues) {
						isDifferent = !arraysAreEqual(oldState, value);
					} else {
						isDifferent = oldState !== value;
					}

					if (isDifferent) {
						this._state[prop] = value;
						_invalidate.call(this, {
							type: "property",
							name: prop,
							newValue: value,
							oldValue: oldState,
						});
						this._updateAttribute(prop, value);
					}
				},
			});
		}

		// Slots
		if (slotsAreManaged) {
			const slots = this.getMetadata().getSlots();
			for (const [slotName, slotData] of Object.entries(slots)) { // eslint-disable-line
				if (!isValidPropertyName(slotName)) {
					console.warn(`"${slotName}" is not a valid property name. Use a name that does not collide with DOM APIs`); /* eslint-disable-line */
				}

				const propertyName = slotData.propertyName || slotName;
				Object.defineProperty(proto, propertyName, {
					get() {
						if (this._state[propertyName] !== undefined) {
							return this._state[propertyName];
						}
						return [];
					},
					set() {
						throw new Error("Cannot set slot content directly, use the DOM APIs (appendChild, removeChild, etc...)");
					},
				});
			}
		}
	}

	/**
	 * Returns the metadata object for this UI5 Web Component Class
	 * @protected
	 */
	static get metadata() {
		return {};
	}

	/**
	 * Returns the CSS for this UI5 Web Component Class
	 * @protected
	 */
	static get styles() {
		return "";
	}

	/**
	 * Returns the Static Area CSS for this UI5 Web Component Class
	 * @protected
	 */
	static get staticAreaStyles() {
		return "";
	}

	/**
	 * Returns an array with the dependencies for this UI5 Web Component, which could be:
	 *  - composed components (used in its shadow root or static area item)
	 *  - slotted components that the component may need to communicate with
	 *
	 * @protected
	 */
	static get dependencies() {
		return [];
	}

	/**
	 * Returns a list of the unique dependencies for this UI5 Web Component
	 *
	 * @public
	 */
	static getUniqueDependencies() {
		if (!uniqueDependenciesCache.has(this)) {
			const filtered = this.dependencies.filter((dep, index, deps) => deps.indexOf(dep) === index);
			uniqueDependenciesCache.set(this, filtered);
		}

		return uniqueDependenciesCache.get(this);
	}

	/**
	 * Returns a promise that resolves whenever all dependencies for this UI5 Web Component have resolved
	 *
	 * @returns {Promise<any[]>}
	 */
	static whenDependenciesDefined() {
		return Promise.all(this.getUniqueDependencies().map(dep => dep.define()));
	}

	/**
	 * Hook that will be called upon custom element definition
	 *
	 * @protected
	 * @returns {Promise<void>}
	 */
	static async onDefine() {
		return Promise.resolve();
	}

	/**
	 * Registers a UI5 Web Component in the browser window object
	 * @public
	 * @returns {Promise<UI5Element>}
	 */
	static async define() {
		await boot();

		await Promise.all([
			this.whenDependenciesDefined(),
			this.onDefine(),
		]);

		const tag = this.getMetadata().getTag();
		const altTag = this.getMetadata().getAltTag();

		const definedLocally = isTagRegistered(tag);
		const definedGlobally = customElements.get(tag);

		if (definedGlobally && !definedLocally) {
			recordTagRegistrationFailure(tag);
		} else if (!definedGlobally) {
			this._generateAccessors();
			registerTag(tag);
			window.customElements.define(tag, this);

			if (altTag && !customElements.get(altTag)) {
				registerTag(altTag);
				window.customElements.define(altTag, getClassCopy(this, () => {
					console.log(`The ${altTag} tag is deprecated and will be removed in the next release, please use ${tag} instead.`); // eslint-disable-line
				}));
			}
		}
		return this;
	}

	/**
	 * Returns an instance of UI5ElementMetadata.js representing this UI5 Web Component's full metadata (its and its parents')
	 * Note: not to be confused with the "get metadata()" method, which returns an object for this class's metadata only
	 * @public
	 * @returns {UI5ElementMetadata}
	 */
	static getMetadata() {
		if (this.hasOwnProperty("_metadata")) { // eslint-disable-line
			return this._metadata;
		}

		const metadataObjects = [this.metadata];
		let klass = this; // eslint-disable-line
		while (klass !== UI5Element) {
			klass = Object.getPrototypeOf(klass);
			metadataObjects.unshift(klass.metadata);
		}
		const mergedMetadata = fnMerge({}, ...metadataObjects);

		this._metadata = new UI5ElementMetadata(mergedMetadata);
		return this._metadata;
	}
}

const litRender = (templateResult, domNode, styles, { host } = {}) => {
	if (styles) {
		templateResult = html`<style>${styles}</style>${templateResult}`;
	}
	render$1(templateResult, domNode, { host });
};

const rLocale = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?((?:-[0-9A-Z]{5,8}|-[0-9][0-9A-Z]{3})*)((?:-[0-9A-WYZ](?:-[0-9A-Z]{2,8})+)*)(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i;

class Locale {
	constructor(sLocaleId) {
		const aResult = rLocale.exec(sLocaleId.replace(/_/g, "-"));
		if (aResult === null) {
			throw new Error(`The given language ${sLocaleId} does not adhere to BCP-47.`);
		}
		this.sLocaleId = sLocaleId;
		this.sLanguage = aResult[1] || null;
		this.sScript = aResult[2] || null;
		this.sRegion = aResult[3] || null;
		this.sVariant = (aResult[4] && aResult[4].slice(1)) || null;
		this.sExtension = (aResult[5] && aResult[5].slice(1)) || null;
		this.sPrivateUse = aResult[6] || null;
		if (this.sLanguage) {
			this.sLanguage = this.sLanguage.toLowerCase();
		}
		if (this.sScript) {
			this.sScript = this.sScript.toLowerCase().replace(/^[a-z]/, s => {
				return s.toUpperCase();
			});
		}
		if (this.sRegion) {
			this.sRegion = this.sRegion.toUpperCase();
		}
	}

	getLanguage() {
		return this.sLanguage;
	}

	getScript() {
		return this.sScript;
	}

	getRegion() {
		return this.sRegion;
	}

	getVariant() {
		return this.sVariant;
	}

	getVariantSubtags() {
		return this.sVariant ? this.sVariant.split("-") : [];
	}

	getExtension() {
		return this.sExtension;
	}

	getExtensionSubtags() {
		return this.sExtension ? this.sExtension.slice(2).split("-") : [];
	}

	getPrivateUse() {
		return this.sPrivateUse;
	}

	getPrivateUseSubtags() {
		return this.sPrivateUse ? this.sPrivateUse.slice(2).split("-") : [];
	}

	hasPrivateUseSubtag(sSubtag) {
		return this.getPrivateUseSubtags().indexOf(sSubtag) >= 0;
	}

	toString() {
		const r = [this.sLanguage];

		if (this.sScript) {
			r.push(this.sScript);
		}
		if (this.sRegion) {
			r.push(this.sRegion);
		}
		if (this.sVariant) {
			r.push(this.sVariant);
		}
		if (this.sExtension) {
			r.push(this.sExtension);
		}
		if (this.sPrivateUse) {
			r.push(this.sPrivateUse);
		}
		return r.join("-");
	}
}

const cache = new Map();

const getLocaleInstance = lang => {
	if (!cache.has(lang)) {
		cache.set(lang, new Locale(lang));
	}

	return cache.get(lang);
};

const convertToLocaleOrNull = lang => {
	try {
		if (lang && typeof lang === "string") {
			return getLocaleInstance(lang);
		}
	} catch (e) {
		// ignore
	}
};

/**
 * Returns the locale based on the parameter or configured language Configuration#getLanguage
 * If no language has been configured - a new locale based on browser language is returned
 */
const getLocale = lang => {
	if (lang) {
		return convertToLocaleOrNull(lang);
	}

	if (getLanguage()) {
		return getLocaleInstance(getLanguage());
	}

	return convertToLocaleOrNull(detectNavigatorLanguage());
};

const localeRegEX = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?((?:-[0-9A-Z]{5,8}|-[0-9][0-9A-Z]{3})*)((?:-[0-9A-WYZ](?:-[0-9A-Z]{2,8})+)*)(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i;
const SAPSupportabilityLocales = /(?:^|-)(saptrc|sappsd)(?:-|$)/i;

/* Map for old language names for a few ISO639 codes. */
const M_ISO639_NEW_TO_OLD = {
	"he": "iw",
	"yi": "ji",
	"id": "in",
	"sr": "sh",
};

/**
 * Normalizes the given locale in BCP-47 syntax.
 * @param {string} locale locale to normalize
 * @returns {string} Normalized locale, "undefined" if the locale can't be normalized or the default locale, if no locale provided.
 */
const normalizeLocale = locale => {
	let m;

	if (!locale) {
		return DEFAULT_LOCALE;
	}

	if (typeof locale === "string" && (m = localeRegEX.exec(locale.replace(/_/g, "-")))) {/* eslint-disable-line */
		let language = m[1].toLowerCase();
		let region = m[3] ? m[3].toUpperCase() : undefined;
		const script = m[2] ? m[2].toLowerCase() : undefined;
		const variants = m[4] ? m[4].slice(1) : undefined;
		const isPrivate = m[6];

		language = M_ISO639_NEW_TO_OLD[language] || language;

		// recognize and convert special SAP supportability locales (overwrites m[]!)
		if ((isPrivate && (m = SAPSupportabilityLocales.exec(isPrivate))) /* eslint-disable-line */ ||
			(variants && (m = SAPSupportabilityLocales.exec(variants)))) {/* eslint-disable-line */
			return `en_US_${m[1].toLowerCase()}`; // for now enforce en_US (agreed with SAP SLS)
		}

		// Chinese: when no region but a script is specified, use default region for each script
		if (language === "zh" && !region) {
			if (script === "hans") {
				region = "CN";
			} else if (script === "hant") {
				region = "TW";
			}
		}

		return language + (region ? "_" + region + (variants ? "_" + variants.replace("-", "_") : "") : ""); /* eslint-disable-line */
	}
};

/**
 * Calculates the next fallback locale for the given locale.
 *
 * @param {string} locale Locale string in Java format (underscores) or null
 * @returns {string} Next fallback Locale or "en" if no fallbacks found.
 */
const nextFallbackLocale = locale => {
	if (!locale) {
		return DEFAULT_LOCALE;
	}

	if (locale === "zh_HK") {
		return "zh_TW";
	}

	// if there are multiple segments (separated by underscores), remove the last one
	const p = locale.lastIndexOf("_");
	if (p >= 0) {
		return locale.slice(0, p);
	}

	// for any language but the default, fallback to the default first before falling back to the 'raw' language (empty string)
	return locale !== DEFAULT_LOCALE ? DEFAULT_LOCALE : "";
};

// contains package names for which the warning has been shown
const warningShown = new Set();
const reportedErrors = new Set();

const bundleData = new Map();
const bundlePromises = new Map();
const loaders = new Map();

const _setI18nBundleData = (packageName, data) => {
	bundleData.set(packageName, data);
};

const getI18nBundleData = packageName => {
	return bundleData.get(packageName);
};

const _hasLoader = (packageName, localeId) => {
	const bundleKey = `${packageName}/${localeId}`;
	return loaders.has(bundleKey);
};

// load bundle over the network once
const _loadMessageBundleOnce = (packageName, localeId) => {
	const bundleKey = `${packageName}/${localeId}`;
	const loadMessageBundle = loaders.get(bundleKey);

	if (!bundlePromises.get(bundleKey)) {
		bundlePromises.set(bundleKey, loadMessageBundle(localeId));
	}

	return bundlePromises.get(bundleKey);
};

const _showAssetsWarningOnce = packageName => {
	if (!warningShown.has(packageName)) {
		console.warn(`[${packageName}]: Message bundle assets are not configured. Falling back to English texts.`, /* eslint-disable-line */
		` Add \`import "${packageName}/dist/Assets.js"\` in your bundle and make sure your build tool supports dynamic imports and JSON imports. See section "Assets" in the documentation for more information.`); /* eslint-disable-line */
		warningShown.add(packageName);
	}
};

/**
 * This method preforms the asynchronous task of fetching the actual text resources. It will fetch
 * each text resource over the network once (even for multiple calls to the same method).
 * It should be fully finished before the i18nBundle class is created in the webcomponents.
 * This method uses the bundle URLs that are populated by the <code>registerI18nBundle</code> method.
 * To simplify the usage, the synchronization of both methods happens internally for the same <code>bundleId</code>
 * @param {packageName} packageName the NPM package name
 * @public
 */
const fetchI18nBundle = async packageName => {
	const language = getLocale().getLanguage();
	const region = getLocale().getRegion();
	let localeId = normalizeLocale(language + (region ? `-${region}` : ``));

	while (localeId !== DEFAULT_LANGUAGE && !_hasLoader(packageName, localeId)) {
		localeId = nextFallbackLocale(localeId);
	}

	// use default language unless configured to always fetch it from the network
	const fetchDefaultLanguage = getFetchDefaultLanguage();
	if (localeId === DEFAULT_LANGUAGE && !fetchDefaultLanguage) {
		_setI18nBundleData(packageName, null); // reset for the default language (if data was set for a previous language)
		return;
	}

	if (!_hasLoader(packageName, localeId)) {
		_showAssetsWarningOnce(packageName);
		return;
	}

	try {
		const data = await _loadMessageBundleOnce(packageName, localeId);
		_setI18nBundleData(packageName, data);
	} catch (e) {
		if (!reportedErrors.has(e.message)) {
			reportedErrors.add(e.message);
			console.error(e.message); /* eslint-disable-line */
		}
	}
};

// When the language changes dynamically (the user calls setLanguage), re-fetch all previously fetched bundles
attachLanguageChange(() => {
	const allPackages = [...bundleData.keys()];
	return Promise.all(allPackages.map(fetchI18nBundle));
});

const messageFormatRegEX = /('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g;

const formatMessage = (text, values) => {
	values = values || [];

	return text.replace(messageFormatRegEX, ($0, $1, $2, $3, offset) => {
		if ($1) {
			return '\''; /* eslint-disable-line */
		}

		if ($2) {
			return $2.replace(/''/g, '\''); /* eslint-disable-line */
		}

		if ($3) {
			return String(values[parseInt($3)]);
		}

		throw new Error(`[i18n]: pattern syntax error at pos ${offset}`);
	});
};

const I18nBundleInstances = new Map();

/**
 * @class
 * @public
 */
class I18nBundle {
	constructor(packageName) {
		this.packageName = packageName;
	}

	/**
	 * Returns a text in the currently loaded language
	 *
	 * @param {Object|String} textObj key/defaultText pair or just the key
	 * @param params Values for the placeholders
	 * @returns {*}
	 */
	getText(textObj, ...params) {
		if (typeof textObj === "string") {
			textObj = { key: textObj, defaultText: textObj };
		}

		if (!textObj || !textObj.key) {
			return "";
		}

		const bundle = getI18nBundleData(this.packageName);
		if (bundle && !bundle[textObj.key]) {
			console.warn(`Key ${textObj.key} not found in the i18n bundle, the default text will be used`); // eslint-disable-line
		}
		const messageText = bundle && bundle[textObj.key] ? bundle[textObj.key] : (textObj.defaultText || textObj.key);

		return formatMessage(messageText, params);
	}
}

const getI18nBundle = packageName => {
	if (I18nBundleInstances.has(packageName)) {
		return I18nBundleInstances.get(packageName);
	}

	const i18nBundle = new I18nBundle(packageName);
	I18nBundleInstances.set(packageName, i18nBundle);
	return i18nBundle;
};

const main$1 = (context, tags, suffix) => {
	const block0 = (context) => { return html$1`<div class="${classMap(context.classes)}" dir="${ifDefined(context.effectiveDir)}" role="region" aria-labelledby="${ifDefined(context.ariaLabelledByCard)}">${ context.hasHeader ? block1() : undefined }<div role="group" aria-label="${ifDefined(context.ariaCardContentLabel)}"><slot></slot></div><span id="${ifDefined(context._id)}-desc" class="ui5-hidden-text">${ifDefined(context.ariaCardRoleDescription)}</span></div>`; };
const block1 = (context) => { return html$1`<div class="ui5-card-header-root"><slot name="header"></slot></div>`; };


	return block0(context);
};

const main = (context, tags, suffix) => {
	const block0 = (context) => { return html$1`<svg class="ui5-icon-root" tabindex="${ifDefined(context.tabIndex)}" dir="${ifDefined(context._dir)}" viewBox="0 0 512 512" role="${ifDefined(context.effectiveAccessibleRole)}" focusable="false" preserveAspectRatio="xMidYMid meet" aria-label="${ifDefined(context.effectiveAccessibleName)}" aria-hidden=${ifDefined(context.effectiveAriaHidden)} xmlns="http://www.w3.org/2000/svg" @focusin=${context._onfocusin} @focusout=${context._onfocusout} @keydown=${context._onkeydown} @keyup=${context._onkeyup} @click=${context._onclick}>${blockSVG1(context)}</svg>`; };
const block1 = (context) => { return svg`<title id="${ifDefined(context._id)}-tooltip">${ifDefined(context.effectiveAccessibleName)}</title>`; };

const blockSVG1 = (context) => {return svg`${ context.hasIconTooltip ? block1(context) : undefined }<g role="presentation"><path d="${ifDefined(context.pathData)}"/></g>`};

	return block0(context);
};

var defaultTheme = ":root{--_ui5_calendar_height:24.5rem;--_ui5_calendar_width:20.5rem;--_ui5_calendar_padding:0.75rem;--_ui5_calendar_header_height:3rem;--_ui5_calendar_header_arrow_button_width:2.5rem;--_ui5_calendar_header_padding:0.25rem 0;--_ui5_checkbox_root_side_padding:.6875rem;--_ui5_checkbox_icon_size:1rem;--_ui5_checkbox_partially_icon_size:.75rem;--_ui5_custom_list_item_height:3rem;--_ui5_custom_list_item_rb_min_width:2.75rem;--_ui5_day_picker_item_width:2.25rem;--_ui5_day_picker_item_height:2.875rem;--_ui5_day_picker_empty_height:3rem;--_ui5_datetime_picker_width:40.0625rem;--_ui5_datetime_picker_height:25rem;--_ui5_datetime_timeview_phonemode_width:19.5rem;--_ui5_datetime_timeview_padding:1rem;--_ui5_dialog_content_min_height:2.75rem;--_ui5_input_inner_padding:0 0.625rem;--_ui5_input_inner_padding_with_icon:0 0.25rem 0 0.625rem;--_ui5_input_value_state_icon_padding:var(--_ui5-input-icon-padding);--_ui5_list_no_data_height:3rem;--_ui5_list_item_cb_margin_right:0;--_ui5_list_item_title_size:var(--sapFontLargeSize);--_ui5_list_item_img_size:3rem;--_ui5_list_item_img_margin:0.5rem 0.75rem 0.5rem 0rem;--_ui5_list_item_base_height:2.75rem;--_ui5_list_item_icon_size:1.125rem;--_ui5_group_header_list_item_height:2.75rem;--_ui5_list_busy_row_height:3rem;--_ui5_month_picker_item_height:3rem;--_ui5_popup_default_header_height:2.75rem;--_ui5_year_picker_item_height:3rem;--_ui5_tokenizer_root_padding:0.1875rem;--_ui5_token_height:1.625rem;--_ui5_token_icon_padding:0.25rem 0.5rem;--_ui5_token_wrapper_right_padding:0.3125rem;--_ui5_tl_bubble_padding:1rem;--_ui5_tl_indicator_before_bottom:-1.625rem;--_ui5_tl_padding:1rem 1rem 1rem .5rem;--_ui5_tl_li_margin_bottom:1.625rem;--_ui5_switch_text_on_left:calc(-100% + 1.9125rem);--_ui5_switch_slide_transform:translateX(100%) translateX(-1.875rem);--_ui5_switch_rtl_transform:translateX(1.875rem) translateX(-100%);--_ui5_switch_text_right:calc(-100% + 1.9125rem);--_ui5_tc_item_text:3rem;--_ui5_tc_item_text_text_only:3rem;--_ui5_tc_item_text_line_height:normal;--_ui5_tc_item_icon_size:1.5rem;--_ui5_tc_item_add_text_margin_top:0.625rem;--_ui5_textarea_padding:0.5625rem 0.6875rem;--_ui5_radio_button_height:2.75rem;--_ui5_radio_button_label_side_padding:.875rem;--_ui5_radio_button_focus_dist:.5rem;--_ui5_radio_button_inner_size:2.75rem;--_ui5_radio_button_svg_size:1.375rem;--_ui5_radio_button_label_width:calc(100% - 2.75rem);--_ui5_radio_button_rtl_focus_right:0.5rem;--_ui5-responsive_popover_header_height:2.75rem;--_ui5_shellbar_logo_outline_offset:-0.0625rem;--ui5_side_navigation_item_height:2.75rem;--_ui5_load_more_text_height:2.75rem;--_ui5_load_more_text_font_size:var(--sapFontMediumSize);--_ui5_load_more_desc_padding:0.375rem 2rem 0.875rem 2rem;--_ui5-tree-indent-step:1.5rem;--_ui5-tree-toggle-box-width:2.75rem;--_ui5-tree-toggle-box-height:2.25rem;--_ui5-tree-toggle-icon-size:1.0625rem;--_ui5_segmented_btn_border_radius:0.375rem}.sapUiSizeCompact,.ui5-content-density-compact,:root,[data-ui5-compact-size]{--_ui5_datetime_timeview_width:17rem;--_ui5_list_item_selection_btn_margin_top:calc(var(--_ui5_checkbox_wrapper_padding)*-1);--_ui5_token_icon_size:.75rem;--_ui5_token_wrapper_left_padding:0}.sapUiSizeCompact,.ui5-content-density-compact,[data-ui5-compact-size]{--_ui5_button_base_height:1.625rem;--_ui5_button_base_padding:0.4375rem;--_ui5_button_base_min_width:2rem;--_ui5_button_icon_font_size:1rem;--_ui5_calendar_height:18rem;--_ui5_calendar_width:17.75rem;--_ui5_calendar_padding:0.5rem;--_ui5_calendar_header_height:2rem;--_ui5_calendar_header_arrow_button_width:2rem;--_ui5_calendar_header_padding:0;--_ui5_checkbox_root_side_padding:var(--_ui5_checkbox_wrapped_focus_padding);--_ui5_checkbox_wrapped_content_margin_top:var(--_ui5_checkbox_compact_wrapped_label_margin_top);--_ui5_checkbox_wrapped_focus_left_top_bottom_position:var(--_ui5_checkbox_compact_focus_position);--_ui5_checkbox_width_height:var(--_ui5_checkbox_compact_width_height);--_ui5_checkbox_wrapper_padding:var(--_ui5_checkbox_compact_wrapper_padding);--_ui5_checkbox_focus_position:var(--_ui5_checkbox_compact_focus_position);--_ui5_checkbox_inner_width_height:var(--_ui5_checkbox_compact_inner_size);--_ui5_checkbox_icon_size:.75rem;--_ui5_checkbox_partially_icon_size:.5rem;--_ui5_color-palette-item-height:1.25rem;--_ui5_color-palette-item-focus-height:1rem;--_ui5_color-palette-item-container-sides-padding:0.1875rem;--_ui5_color-palette-item-container-rows-padding:0.8125rem;--_ui5_color-palette-item-hover-height:1.65rem;--_ui5_color-palette-item-hover-margin:0.3125rem;--_ui5_color-palette-row-width:12rem;--_ui5_color-palette-row-height:7.5rem;--_ui5_custom_list_item_height:2rem;--_ui5_custom_list_item_rb_min_width:2rem;--_ui5_daypicker_weeknumbers_container_padding_top:2rem;--_ui5_day_picker_item_width:2rem;--_ui5_day_picker_item_height:2rem;--_ui5_day_picker_empty_height:2.125rem;--_ui5_datetime_picker_height:17rem;--_ui5_datetime_picker_width:34.0625rem;--_ui5_datetime_timeview_phonemode_width:18.5rem;--_ui5_datetime_timeview_padding:0.5rem;--_ui5_dialog_content_min_height:2.5rem;--_ui5_input_height:var(--_ui5_input_compact_height);--_ui5_input_inner_padding:0 0.5rem;--_ui5_input_icon_min_width:var(--_ui5_input_compact_min_width);--_ui5_input_icon_padding:.25rem .5rem;--_ui5_input_value_state_icon_padding:.1875rem .5rem;--_ui5_popup_default_header_height:2.5rem;--_ui5_textarea_padding:.1875rem .5rem;--_ui5_list_no_data_height:2rem;--_ui5_list_item_cb_margin_right:.5rem;--_ui5_list_item_title_size:var(--sapFontSize);--_ui5_list_item_img_margin:0.55rem 0.75rem 0.5rem 0rem;--_ui5_list_item_base_height:2rem;--_ui5_list_item_icon_size:1rem;--_ui5_list_busy_row_height:2rem;--_ui5_month_picker_item_height:2rem;--_ui5_panel_header_height:2rem;--_ui5_year_picker_item_height:2rem;--_ui5_tokenizer_root_padding:0.125rem;--_ui5_token_height:1.125rem;--_ui5_token_icon_padding:0.1rem 0.25rem;--_ui5_token_wrapper_right_padding:0.25rem;--_ui5_tl_bubble_padding:.5rem;--_ui5_tl_indicator_before_bottom:-.5rem;--_ui5_tl_padding:.5rem;--_ui5_tl_li_margin_bottom:.5rem;--_ui5_wheelslider_item_width:64px;--_ui5_wheelslider_item_height:32px;--_ui5_wheelslider_height:224px;--_ui5_wheelslider_selection_frame_margin_top:calc(var(--_ui5_wheelslider_item_height)*2);--_ui5_wheelslider_arrows_visibility:visible;--_ui5_wheelslider_mobile_selection_frame_margin_top:128px;--_ui5_switch_height:var(--_ui5_switch_compact_height);--_ui5_switch_width:var(--_ui5_switch_compact_width);--_ui5_switch_handle_height:var(--_ui5_switch_handle_compact_height);--_ui5_switch_handle_width:var(--_ui5_switch_handle_compact_width);--_ui5_switch_text_on_left:calc(-100% + 1.5625rem);--_ui5_switch_slide_transform:translateX(100%) translateX(-1.5rem);--_ui5_switch_no_label_width:var(--_ui5_switch_compact_no_label_width);--_ui5_switch_track_no_label_height:var(--_ui5_switch_track_compact_no_label_height);--_ui5_switch_rtl_transform:translateX(-100%) translateX(1.5rem);--_ui5_switch_text_right:calc(-100% + 1.5625rem);--_ui5_tc_item_text:2rem;--_ui5_tc_item_text_line_height:1.325rem;--_ui5_tc_item_icon_size:1rem;--_ui5_tc_item_add_text_margin_top:0.3125rem;--_ui5_tc_header_height:var(--_ui5_tc_header_height_compact);--_ui5_radio_button_min_width:var(--_ui5_radio_button_min_width_compact);--_ui5_radio_button_height:2rem;--_ui5_radio_button_label_side_padding:.5rem;--_ui5_radio_button_focus_dist:.375rem;--_ui5_radio_button_inner_size:2rem;--_ui5_radio_button_svg_size:1rem;--_ui5_radio_button_label_width:calc(100% - 2rem + 1px);--_ui5_radio_button_rtl_focus_right:0.375rem;--_ui5-responsive_popover_header_height:2.5rem;--ui5_side_navigation_item_height:2rem;--_ui5_slider_handle_height:1.25rem;--_ui5_slider_handle_width:1.25rem;--_ui5_slider_handle_top:-0.6425rem;--_ui5_slider_handle_margin_left:-0.7825rem;--_ui5_slider_tooltip_height:1rem;--_ui5_slider_tooltip_padding:0.25rem;--_ui5_slider_tooltip_bottom:1.825rem;--_ui5_slider_progress_outline_offset:-0.625rem;--_ui5_slider_outer_height:1.3125rem;--_ui5_load_more_text_height:2.625rem;--_ui5_load_more_text_font_size:var(--sapFontSize);--_ui5_load_more_desc_padding:0 2rem 0.875rem 2rem;--_ui5-tree-indent-step:0.5rem;--_ui5-tree-toggle-box-width:2rem;--_ui5-tree-toggle-box-height:1.5rem;--_ui5-tree-toggle-icon-size:0.8125rem}:root{--ui5-avatar-initials-color:var(--sapContent_ImagePlaceholderForegroundColor);--ui5-avatar-initials-border:none;--ui5-avatar-accent1:var(--sapAccentColor1);--ui5-avatar-accent2:var(--sapAccentColor2);--ui5-avatar-accent3:var(--sapAccentColor3);--ui5-avatar-accent4:var(--sapAccentColor4);--ui5-avatar-accent5:var(--sapAccentColor5);--ui5-avatar-accent6:var(--sapAccentColor6);--ui5-avatar-accent7:var(--sapAccentColor7);--ui5-avatar-accent8:var(--sapAccentColor8);--ui5-avatar-accent9:var(--sapAccentColor9);--ui5-avatar-accent10:var(--sapAccentColor10);--ui5-avatar-placeholder:var(--sapContent_ImagePlaceholderBackground);--_ui5_avatar_outline:1px dotted var(--sapContent_FocusColor);--_ui5_avatar_focus_offset:1px;--_ui5_avatar_focus_width:1px;--_ui5_avatar_focus_color:var(--sapContent_FocusColor);--ui5-badge-font-size:0.75em;--ui5-badge-color-scheme-1-background:var(--sapLegendBackgroundColor1);--ui5-badge-color-scheme-1-border:var(--sapAccentColor1);--ui5-badge-color-scheme-1-color:var(--sapAccentColor1);--ui5-badge-color-scheme-2-background:var(--sapLegendBackgroundColor2);--ui5-badge-color-scheme-2-border:var(--sapAccentColor2);--ui5-badge-color-scheme-2-color:var(--sapAccentColor2);--ui5-badge-color-scheme-3-background:var(--sapLegendBackgroundColor3);--ui5-badge-color-scheme-3-border:var(--sapAccentColor3);--ui5-badge-color-scheme-3-color:var(--sapAccentColor3);--ui5-badge-color-scheme-4-background:var(--sapLegendBackgroundColor5);--ui5-badge-color-scheme-4-border:var(--sapAccentColor4);--ui5-badge-color-scheme-4-color:var(--sapAccentColor4);--ui5-badge-color-scheme-5-background:var(--sapLegendBackgroundColor20);--ui5-badge-color-scheme-5-border:var(--sapAccentColor5);--ui5-badge-color-scheme-5-color:var(--sapAccentColor5);--ui5-badge-color-scheme-6-background:var(--sapLegendBackgroundColor6);--ui5-badge-color-scheme-6-border:var(--sapAccentColor6);--ui5-badge-color-scheme-6-color:var(--sapAccentColor6);--ui5-badge-color-scheme-7-background:var(--sapLegendBackgroundColor7);--ui5-badge-color-scheme-7-border:var(--sapAccentColor7);--ui5-badge-color-scheme-7-color:var(--sapAccentColor7);--ui5-badge-color-scheme-8-background:var(--sapLegendBackgroundColor8);--ui5-badge-color-scheme-8-border:var(--sapAccentColor8);--ui5-badge-color-scheme-8-color:var(--sapAccentColor8);--ui5-badge-color-scheme-9-background:var(--sapLegendBackgroundColor10);--ui5-badge-color-scheme-9-border:var(--sapAccentColor10);--ui5-badge-color-scheme-9-color:var(--sapAccentColor10);--ui5-badge-color-scheme-10-background:var(--sapLegendBackgroundColor9);--ui5-badge-color-scheme-10-border:var(--sapAccentColor9);--ui5-badge-color-scheme-10-color:var(--sapAccentColor9);--_ui5_button_base_min_width:2.5rem;--_ui5_button_base_min_compact_width:2rem;--_ui5_button_base_height:2.5rem;--_ui5_button_compact_height:1.625rem;--_ui5_button_border_radius:var(--sapButton_BorderCornerRadius);--_ui5_button_base_padding:0.6875rem;--_ui5_button_compact_padding:0.4375rem;--_ui5_button_base_icon_margin:0.563rem;--_ui5_button_icon_font_size:1.375rem;--_ui5_button_outline:1px dotted var(--sapContent_FocusColor);--_ui5_button_outline_offset:-0.1875rem;--_ui5_button_emphasized_font_weight:normal;--_ui5_button_text_shadow:var(--sapContent_TextShadow);--_ui5_button_focus_offset:1px;--_ui5_button_focus_width:1px;--_ui5_button_focus_color:var(--sapContent_FocusColor);--_ui5_button_positive_border_focus_hover_color:var(--sapContent_FocusColor);--_ui5_button_positive_focus_border_color:var(--sapButton_Accept_BorderColor);--_ui5_button_negative_focus_border_color:var(--sapButton_Reject_BorderColor);--_ui5_button_emphasized_focused_border_color:var(--sapButton_Emphasized_BorderColor);--_ui5_button_base_min_width:2.25rem;--_ui5_button_base_height:2.25rem;--_ui5_button_base_padding:0.5625rem;--_ui5_button_base_icon_only_padding:0.5625rem;--_ui5_button_base_icon_margin:0.375rem;--_ui5_button_icon_font_size:1rem;--_ui5_button_emphasized_font_weight:bold;--_ui5_button_text_shadow:none;--_ui5_card_box_shadow:var(--sapContent_Shadow0);--_ui5_card_border_color:var(--sapTile_BorderColor);--_ui5_card_content_padding:1rem;--_ui5_card_header_hover_bg:var(--sapList_Hover_Background);--_ui5_card_header_active_bg:var(--_ui5_card_header_hover_bg);--_ui5_card_header_border_color:var(--sapTile_SeparatorColor);--_ui5_card_header_focus_border:1px dotted var(--sapContent_FocusColor);--ui5_carousel_button_size:2.5rem;--ui5_carousel_height:0.25rem;--ui5_carousel_width:0.25rem;--ui5_carousel_margin:0 0.375rem;--ui5_carousel_border:1px solid var(--sapContent_ForegroundBorderColor);--ui5_carousel_dot_border:none;--ui5_carousel_dot_background:var(--sapContent_NonInteractiveIconColor);--_ui5_checkbox_wrapper_padding:.8125rem;--_ui5_checkbox_width_height:3rem;--_ui5_checkbox_hover_background:var(--sapField_Hover_Background);--_ui5_checkbox_inner_width_height:1.375rem;--_ui5_checkbox_inner_border:solid .125rem var(--sapField_BorderColor);--_ui5_checkbox_inner_border_radius:0;--_ui5_checkbox_inner_error_border:0.125rem solid var(--sapField_InvalidColor);--_ui5_checkbox_inner_warning_border:0.125rem solid var(--sapField_WarningColor);--_ui5_checkbox_inner_information_border:0.125rem solid var(--sapField_InformationColor);--_ui5_checkbox_inner_success_border:var(--sapField_BorderWidth) solid var(--sapField_SuccessColor);--_ui5_checkbox_inner_readonly_border:0.125rem solid var(--sapField_ReadOnly_BorderColor);--_ui5_checkbox_checkmark_warning_color:var(--sapField_TextColor);--_ui5_checkbox_checkmark_color:var(--sapSelectedColor);--_ui5_checkbox_wrapped_focus_padding:.375rem;--_ui5_checkbox_wrapped_content_margin_top:.125rem;--_ui5_checkbox_wrapped_focus_left_top_bottom_position:.5625rem;--_ui5_checkbox_focus_position:.6875rem;--_ui5_checkbox_focus_outline:1px dotted var(--sapContent_FocusColor);--_ui5_checkbox_compact_wrapper_padding:.5rem;--_ui5_checkbox_compact_width_height:2rem;--_ui5_checkbox_compact_inner_size:1rem;--_ui5_checkbox_compact_focus_position:.375rem;--_ui5_checkbox_compact_wrapped_label_margin_top:-1px;--_ui5_checkbox_wrapper_padding:.6875rem;--_ui5_checkbox_width_height:2.75rem;--_ui5_checkbox_inner_border:.0625rem solid var(--sapField_BorderColor);--_ui5_checkbox_focus_position:0.5625rem;--_ui5_checkbox_inner_border_radius:.125rem;--_ui5_checkbox_wrapped_content_margin_top:0;--_ui5_checkbox_wrapped_focus_padding:.5rem;--_ui5_checkbox_inner_readonly_border:1px solid var(--sapField_ReadOnly_BorderColor);--_ui5_checkbox_compact_wrapped_label_margin_top:-0.125rem;--_ui5_color-palette-item-height:1.75rem;--_ui5_color-palette-item-container-sides-padding:0.3125rem;--_ui5_color-palette-item-container-rows-padding:0.6875rem;--_ui5_color-palette-item-focus-height:1.5rem;--_ui5_color-palette-item-container-padding:var(--_ui5_color-palette-item-container-sides-padding) var(--_ui5_color-palette-item-container-rows-padding);--_ui5_color-palette-item-hover-height:2.25rem;--_ui5_color-palette-item-margin:calc(var(--_ui5_color-palette-item-hover-height) - var(--_ui5_color-palette-item-height));--_ui5_color-palette-item-hover-margin:calc(var(--_ui5_color-palette-item-margin)/2);--_ui5_color-palette-row-width:14.5rem;--_ui5_color-palette-row-height:9.5rem;--_ui5_datepicker_icon_border:none;--_ui5_daypicker_item_margin:2px;--_ui5_daypicker_item_border:none;--_ui5_daypicker_item_selected_border_color:var(--sapList_Background);--_ui5_daypicker_item_outline_width:1px;--_ui5_daypicker_item_outline_offset:1px;--_ui5_daypicker_daynames_container_height:2rem;--_ui5_daypicker_weeknumbers_container_padding_top:2rem;--_ui5_daypicker_item_selected_hover_background_color:var(--sapContent_Selected_Background);--_ui5_daypicker_item_othermonth_background_color:var(--sapList_Background);--_ui5_daypicker_item_othermonth_color:var(--sapContent_LabelColor);--_ui5_daypicker_item_othermonth_hover_color:var(--sapContent_LabelColor);--_ui5_daypicker_item_border_radius:0;--_ui5_daypicker_item_now_inner_border_radius:0;--_ui5_daypicker_dayname_color:var(--sapContent_LabelColor);--_ui5_daypicker_weekname_color:var(--sapContent_LabelColor);--_ui5_daypicker_item_now_selected_focus_after_width:calc(100% - 0.125rem);--_ui5_daypicker_item_now_selected_focus_after_height:calc(100% - 0.125rem);--_ui5_daypicker_item_selected_hover_background_color:var(--sapActiveColor_Lighten3);--_ui5_daypicker_item_border_radius:0.25rem;--_ui5_daypicker_item_now_inner_border_radius:0.125rem;--_ui5_dialog_resize_handle_color:var(--sapButton_Lite_TextColor);--_ui5_dialog_header_focus_width:0.0625rem;--_ui5_dialog_header_focus_offset:-0.1875rem;--ui5-group-header-listitem-background-color:var(--sapList_GroupHeaderBackground);--_ui5_input_width:13.125rem;--_ui5_input_height:2.5rem;--_ui5_input_compact_height:1.625rem;--_ui5_input_state_border_width:0.125rem;--_ui5-input-information_border_width:0.125rem;--_ui5_input_error_font_weight:normal;--_ui5_input_focus_border_width:1px;--_ui5_input_error_warning_border_style:solid;--_ui5_input_error_warning_font_style:inherit;--_ui5_input_disabled_color:var(--sapContent_DisabledTextColor);--_ui5_input_disabled_font_weight:normal;--_ui5_input_disabled_border_color:var(--sapField_BorderColor);--_ui5_input_disabled_background:var(--sapField_Background);--_ui5_input_icon_padding:0.625rem .6875rem;--_ui5_input_disabled_opacity:0.5;--_ui5_input_icon_min_width:2.375rem;--_ui5_input_compact_min_width:2rem;--_ui5_input_height:2.25rem;--_ui5_input_disabled_opacity:0.4;--_ui5_input_icon_padding:.5625rem .6875rem;--_ui5_link_opacity:0.5;--_ui5_link_opacity:0.4;--_ui5_link_text_decoration:none;--_ui5_link_hover_text_decoration:underline;--ui5_list_footer_text_color:var(--sapPageFooter_TextColor);--ui5_list_footer_text_color:var(--sapTextColor);--ui5-listitem-background-color:var(--sapList_Background);--ui5-listitem-border-bottom:1px solid var(--sapList_BorderColor);--ui5-listitem-selected-border-bottom:1px solid var(--sapList_SelectionBorderColor);--_ui5_listitembase_focus_width:1px;--_ui5-listitembase_disabled_opacity:0.5;--_ui5_product_switch_item_border:none;--_ui5_monthpicker_item_border_radius:0;--_ui5_monthpicker_item_border:none;--_ui5_monthpicker_item_margin:1px;--_ui5_monthpicker_item_focus_after_width:calc(100% - 0.375rem);--_ui5_monthpicker_item_focus_after_height:calc(100% - 0.375rem);--_ui5_monthpicker_item_focus_after_border:1px dotted var(--sapContent_FocusColor);--_ui5_monthpicker_item_focus_after_offset:2px;--_ui5_monthpicker_item_border_radius:0.25rem;--_ui5_messagestrip_icon_width:2.5rem;--_ui5_messagestrip_border_radius:0.1875rem;--_ui5_messagestrip_button_border_width:0;--_ui5_messagestrip_button_border_style:none;--_ui5_messagestrip_button_border_color:transparent;--_ui5_messagestrip_button_border_radius:0;--_ui5_messagestrip_padding:0.4375rem 2.5rem 0.4375rem 2.5rem;--_ui5_messagestrip_padding_no_icon:0.4375rem 2.5rem 0.4375rem 1rem;--_ui5_messagestrip_button_height:1.625rem;--_ui5_messagestrip_border_width:1px;--_ui5_messagestrip_close_button_border:none;--_ui5_messagestrip_close_button_size:1.625rem;--_ui5_messagestrip_icon_top:0.4375rem;--_ui5_messagestrip_focus_width:1px;--_ui5_messagestrip_focus_offset:-2px;--_ui5_panel_focus_border:1px dotted var(--sapContent_FocusColor);--_ui5_panel_header_height:3rem;--_ui5_panel_button_root_width:3rem;--_ui5_panel_header_height:2.75rem;--_ui5_panel_button_root_width:2.75rem;--_ui5_popup_content_padding:.4375em;--_ui5_progress_indicator_value_state_none:var(--sapNeutralElementColor);--_ui5_progress_indicator_value_state_error:var(--sapNegativeElementColor);--_ui5_progress_indicator_value_state_warning:var(--sapCriticalElementColor);--_ui5_progress_indicator_value_state_success:var(--sapPositiveElementColor);--_ui5_progress_indicator_value_state_information:var(--sapInformativeElementColor);--_ui5_progress_indicator_color:var(--sapTextColor);--_ui5_progress_indicator_bar_color:var(--sapContent_ContrastTextColor);--_ui5_progress_indicator_border:0.0625rem solid var(--sapField_BorderColor);--_ui5_progress_indicator_bar_border_max:none;--_ui5_progress_indicator_icon_visibility:none;--_ui5_radio_button_min_width:2.75rem;--_ui5_radio_button_min_width_compact:2rem;--_ui5_radio_button_hover_fill:var(--sapField_Hover_Background);--_ui5_radio_button_border_width:1px;--_ui5_radio_button_checked_fill:var(--sapSelectedColor);--_ui5_radio_button_checked_error_fill:var(--sapField_InvalidColor);--_ui5_radio_button_checked_warning_fill:var(--sapField_TextColor);--_ui5_radio_button_warning_error_border_dash:0;--_ui5_select_disabled_background:var(--sapField_Background);--_ui5_select_disabled_border_color:var(--sapField_BorderColor);--_ui5_select_state_error_warning_border_style:solid;--_ui5_select_state_error_warning_border_width:0.125rem;--_ui5_select_hover_icon_left_border:1px solid transparent;--_ui5_select_rtl_hover_icon_left_border:none;--_ui5_select_rtl_hover_icon_right_border:none;--_ui5_select_focus_width:1px;--_ui5_switch_height:2.75rem;--_ui5_switch_width:3.875rem;--_ui5_switch_no_label_width:3.25rem;--_ui5_switch_outline:1px;--_ui5_switch_compact_height:2rem;--_ui5_switch_compact_width:3.5rem;--_ui5_switch_compact_no_label_width:2.5rem;--_ui5_switch_track_height:1.375rem;--_ui5_switch_track_no_label_height:1.25rem;--_ui5_switch_track_compact_no_label_height:1rem;--_ui5_switch_track_hover_border_color:var(--_ui5_switch_track_checked_border_color);--_ui5_switch_track_hover_background_color:var(--sapButton_Track_Background);--_ui5_switch_track_hover_checked_background_color:var(--sapButton_Track_Selected_Background);--_ui5_switch_track_border_radius:0.75rem;--_ui5_switch_track_disabled_checked_bg:var(--_ui5_switch_track_checked_bg);--_ui5_switch_track_disabled_border_color:var(--sapContent_ForegroundBorderColor);--_ui5_switch_track_disabled_semantic_checked_bg:var(--sapSuccessBackground);--_ui5_switch_track_disabled_semantic_checked_border_color:var(--sapSuccessBorderColor);--_ui5_switch_track_disabled_semantic_bg:var(--sapErrorBackground);--_ui5_switch_track_disabled_semantic_border_color:var(--sapErrorBorderColor);--_ui5_switch_handle_width:2rem;--_ui5_switch_handle_height:2rem;--_ui5_switch_handle_border_width:1px;--_ui5_switch_handle_border_radius:1rem;--_ui5_switch_handle_bg:var(--sapButton_TokenBackground);--_ui5_switch_handle_checked_bg:var(--sapButton_Selected_Background);--_ui5_switch_handle_checked_border_color:var(--sapButton_Selected_BorderColor);--_ui5_switch_handle_semantic_hover_bg:var(--sapErrorBackground);--_ui5_switch_handle_semantic_checked_hover_bg:var(--sapSuccessBackground);--_ui5_switch_handle_semantic_hover_border_color:var(--sapErrorBorderColor);--_ui5_switch_handle_semantic_checked_hover_border_color:var(--sapSuccessBorderColor);--_ui5_switch_handle_compact_width:1.625rem;--_ui5_switch_handle_compact_height:1.625rem;--_ui5_switch_handle_disabled_bg:var(--_ui5_switch_handle_bg);--_ui5_switch_handle_disabled_checked_bg:var(--_ui5_switch_handle_checked_bg);--_ui5_switch_handle_disabled_border_color:var(--sapContent_ForegroundBorderColor);--_ui5_switch_handle_disabled_semantic_checked_bg:var(--sapButton_Background);--_ui5_switch_handle_disabled_semantic_checked_border_color:var(--sapSuccessBorderColor);--_ui5_switch_handle_disabled_semantic_border_color:var(--sapErrorBorderColor);--_ui5_switch_text_on_semantic_color:var(--sapPositiveElementColor);--_ui5_switch_text_off_semantic_color:var(--sapNegativeElementColor);--_ui5_switch_text_disabled_color:var(--sapTextColor);--_ui5_tc_header_height:4.6875rem;--_ui5_tc_header_height_compact:3.6875rem;--_ui5_tc_header_height_text_only:3rem;--_ui5_tc_header_height_text_only_compact:2rem;--_ui5_tc_header_box_shadow:inset 0 -0.25rem 0 -0.125rem var(--sapObjectHeader_BorderColor);--_ui5_tc_header_border_bottom:0.125rem solid var(--sapObjectHeader_Background);--_ui5_tc_headerItem_color:var(--sapGroup_TitleTextColor);--_ui5_tc_headeritem_text_selected_color:var(--sapSelectedColor);--_ui5_tc_headerItem_neutral_color:var(--sapNeutralColor);--_ui5_tc_headerItem_positive_color:var(--sapPositiveColor);--_ui5_tc_headerItem_negative_color:var(--sapNegativeColor);--_ui5_tc_headerItem_critical_color:var(--sapCriticalColor);--_ui5_tc_headerItem_neutral_border_color:var(--_ui5_tc_headerItem_neutral_color);--_ui5_tc_headerItem_positive_border_color:var(--_ui5_tc_headerItem_positive_color);--_ui5_tc_headerItem_negative_border_color:var(--_ui5_tc_headerItem_negative_color);--_ui5_tc_headerItem_critical_border_color:var(--_ui5_tc_headerItem_critical_color);--_ui5_tc_headerItem_neutral_selected_border_color:var(--_ui5_tc_headerItem_neutral_color);--_ui5_tc_headerItem_positive_selected_border_color:var(--_ui5_tc_headerItem_positive_color);--_ui5_tc_headerItem_negative_selected_border_color:var(--_ui5_tc_headerItem_negative_color);--_ui5_tc_headerItem_critical_selected_border_color:var(--_ui5_tc_headerItem_critical_color);--_ui5_tc_headerItemContent_border_bottom:0.125rem solid var(--sapSelectedColor);--_ui5_tc_headerItem_focus_border:1px dotted var(--sapContent_FocusColor);--_ui5_tc_headerItemSemanticIcon_display:none;--_ui5_tc_overflowItem_neutral_color:var(--sapNeutralColor);--_ui5_tc_overflowItem_positive_color:var(--sapPositiveColor);--_ui5_tc_overflowItem_negative_color:var(--sapNegativeColor);--_ui5_tc_overflowItem_critical_color:var(--sapCriticalColor);--_ui5_tc_headerItemIcon_border:1px solid var(--sapHighlightColor);--_ui5_tc_headerItemIcon_color:var(--sapHighlightColor);--_ui5_tc_headerItemIcon_selected_background:var(--sapHighlightColor);--_ui5_tc_headerItemIcon_selected_color:var(--sapGroup_ContentBackground);--_ui5_tc_headerItemIcon_positive_selected_background:var(--sapPositiveColor);--_ui5_tc_headerItemIcon_negative_selected_background:var(--sapNegativeColor);--_ui5_tc_headerItemIcon_critical_selected_background:var(--sapCriticalColor);--_ui5_tc_headerItemIcon_neutral_selected_background:var(--sapNeutralColor);--_ui5_tc_headerItemIcon_semantic_selected_color:var(--sapGroup_ContentBackground);--_ui5_tc_content_border_bottom:0.125rem solid var(--sapObjectHeader_BorderColor);--_ui5_tc_header_box_shadow:var(--sapContent_HeaderShadow);--_ui5_tc_header_border_bottom:0.0625rem solid var(--sapObjectHeader_Background);--_ui5_tc_headerItem_color:var(--sapContent_LabelColor);--_ui5_tc_headerItemContent_border_bottom:0.188rem solid var(--sapSelectedColor);--_ui5_tc_overflowItem_default_color:var(--sapHighlightColor);--_ui5_tc_overflowItem_current_color:CurrentColor;--_ui5_tc_content_border_bottom:0.0625rem solid var(--sapObjectHeader_BorderColor);--_ui5_textarea_focus_after_width:1px;--_ui5_textarea_warning_border_style:solid;--_ui5_textarea_state_border_width:0.125rem;--_ui5_time_picker_border:0.0625rem solid transparent;--_ui5_toast_vertical_offset:3rem;--_ui5_toast_horizontal_offset:2rem;--_ui5_toast_background:var(--sapList_Background);--_ui5_toast_shadow:var(--sapContent_Shadow2);--_ui5_wheelslider_item_text_size:var(--sapFontSize);--_ui5_wheelslider_selected_item_hover_background_color:var(--sapList_BorderColor);--_ui5_wheelslider_label_text_size:var(--sapFontSmallSize);--_ui5_wheelslider_selection_frame_margin_top:calc(var(--_ui5_wheelslider_item_height)*2);--_ui5_wheelslider_mobile_selection_frame_margin_top:calc(var(--_ui5_wheelslider_item_height)*4);--_ui5_wheelslider_label_text_color:var(--sapContent_LabelColor);--_ui5_wheelslider_height:240px;--_ui5_wheelslider_mobile_height:432px;--_ui5_wheelslider_item_width:48px;--_ui5_wheelslider_item_height:46px;--_ui5_wheelslider_arrows_visibility:hidden;--_ui5_wheelslider_item_background_color:var(--sapLegend_WorkingBackground);--_ui5_wheelslider_item_text_color:var(--sapTextColor);--_ui_wheelslider_item_hover_color:var(--sapButton_Emphasized_Hover_BorderColor);--_ui5_wheelslider_item_border_color:var(--sapList_Background);--_ui5_wheelslider_item_hovered_border_color:var(--sapList_Background);--_ui5_wheelslider_collapsed_item_text_color:var(--_ui5_wheelslider_item_border_color);--_ui5_wheelslider_selected_item_background_color:var(--sapContent_Selected_Background);--_ui5_wheelslider_selected_item_hover_background_color:var(--sapButton_Emphasized_Hover_BorderColor);--_ui5_wheelslider_active_item_background_color:var(--sapContent_Selected_Background);--_ui5_wheelslider_active_item_text_color:var(--sapContent_Selected_TextColor);--_ui5_wheelslider_selection_frame_color:var(--sapList_SelectionBorderColor);--_ui_wheelslider_item_border_radius:var(--_ui5_button_border_radius);--_ui5_toggle_button_pressed_focussed:var(--sapButton_Selected_BorderColor);--_ui5_toggle_button_pressed_focussed_hovered:var(--sapButton_Selected_BorderColor);--_ui5_yearpicker_item_selected_focus:var(--sapContent_Selected_Background);--_ui5_yearpicker_item_border:none;--_ui5_yearpicker_item_border_radius:0;--_ui5_yearpicker_item_margin:1px;--_ui5_yearpicker_item_focus_after_width:calc(100% - 0.375rem);--_ui5_yearpicker_item_focus_after_height:calc(100% - 0.375rem);--_ui5_yearpicker_item_focus_after_border:1px dotted var(--sapContent_FocusColor);--_ui5_yearpicker_item_focus_after_offset:2px;--_ui5_yearpicker_item_border_radius:0.25rem;--_ui5_calendar_header_arrow_button_border:none;--_ui5_calendar_header_arrow_button_border_radius:0.25rem;--_ui5_calendar_header_middle_button_width:6.25rem;--_ui5_calendar_header_middle_button_flex:1 1 auto;--_ui5_calendar_header_middle_button_focus_border_radius:0.25rem;--_ui5_calendar_header_middle_button_focus_border:none;--_ui5_calendar_header_middle_button_focus_after_display:block;--_ui5_calendar_header_middle_button_focus_after_width:calc(100% - 0.25rem);--_ui5_calendar_header_middle_button_focus_after_height:calc(100% - 0.25rem);--_ui5_calendar_header_middle_button_focus_after_top_offset:1px;--_ui5_calendar_header_middle_button_focus_after_left_offset:1px;--_ui5_calendar_header_middle_button_focus_after_width:calc(100% - 0.375rem);--_ui5_calendar_header_middle_button_focus_after_height:calc(100% - 0.375rem);--_ui5_calendar_header_middle_button_focus_after_top_offset:0.125rem;--_ui5_calendar_header_middle_button_focus_after_left_offset:0.125rem;--ui5_table_header_row_outline_width:1px;--ui5_table_multiselect_column_width:2.75rem;--ui5_table_row_outline_width:1px;--_ui5_load_more_padding:0;--_ui5_load_more_border:1px top solid transparent;--_ui5_load_more_border_radius:none;--_ui5_load_more_outline_width:1px;--ui5_title_level_1Size:1.625rem;--ui5_title_level_2Size:1.375rem;--ui5_title_level_3Size:1.250rem;--ui5_title_level_4Size:1.125rem;--ui5_title_level_5Size:1rem;--ui5_title_level_6Size:0.875rem;--_ui5_token_background:var(--sapButton_Background);--_ui5_token_border_radius:0.125rem;--_ui5_token_text_color:var(--sapButton_TextColor);--_ui5_token_background:var(--sapButton_TokenBackground);--_ui5_token_border_radius:0.25rem;--_ui5_token_focus_outline_width:0.0625rem;--_ui5_token_text_color:var(--sapTextColor);--_ui5_token_icon_color:var(--sapContent_IconColor);--_ui5_value_state_message_border:none;--_ui5-multi_combobox_token_margin_top:3px;--_ui5-multi_combobox_token_margin_top:1px;--_ui5_slider_progress_container_background:var(--sapField_BorderColor);--_ui5_slider_progress_border:none;--_ui5_slider_inner_height:0.25rem;--_ui5_slider_outer_height:1.6875rem;--_ui5_slider_progress_border_radius:0.25rem;--_ui5_slider_progress_background:var(--sapActiveColor);--_ui5_slider_handle_height:1.625rem;--_ui5_slider_handle_width:1.625rem;--_ui5_slider_handle_border:solid 0.125rem var(--sapField_BorderColor);--_ui5_slider_handle_background:var(--sapButton_Background);--_ui5_range_slider_handle_background:hsla(0,0%,100%,0.25);--_ui5_slider_handle_top:-0.825rem;--_ui5_slider_handle_margin_left:-0.9725rem;--_ui5_slider_handle_hover_background:var(--sapButton_Hover_Background);--_ui5_slider_handle_hover_border:var(--sapButton_Hover_BorderColor);--_ui5_slider_handle_outline:1px dotted var(--sapContent_FocusColor);--_ui5_slider_handle_outline_offset:0.075rem;--_ui5_range_slider_handle_hover_background:hsla(0,0%,100%,0.25);--_ui5_slider_progress_outline:0.0625rem dotted var(--sapContent_FocusColor);--_ui5_slider_progress_outline_offset:-0.8125rem;--_ui5_slider_tickmark_color:#89919a;--_ui5_slider_tickmark_top:-0.375rem;--_ui5_slider_disabled_opacity:0.4;--_ui5_slider_tooltip_fontsize:var(--sapFontSmallSize);--_ui5_slider_tooltip_color:var(--sapContent_LabelColor);--_ui5_slider_tooltip_background:var(--sapField_Background);--_ui5_slider_tooltip_border_radius:var(--sapElement_BorderCornerRadius);--_ui5_slider_tooltip_border_color:var(--sapField_BorderColor);--_ui5_slider_tooltip_padding:0.4125rem;--_ui5_slider_tooltip_height:1rem;--_ui5_slider_tooltip_box_shadow:none;--_ui5_slider_tooltip_min_width:2rem;--_ui5_slider_tooltip_bottom:2rem;--_ui5_slider_label_fontsize:var(--sapFontSmallSize);--_ui5_slider_label_color:var(--sapContent_LabelColor);--_ui5_slider_inner_min_width:4rem}";

registerThemePropertiesLoader("@ui5/webcomponents-theme-base", "sap_fiori_3", () => defaultThemeBase);
registerThemePropertiesLoader("@ui5/webcomponents", "sap_fiori_3", () => defaultTheme);
var iconCss = ":host([hidden]){display:none}:host([invalid]){display:none}:host(:not([hidden]).ui5_hovered){opacity:.7}:host{display:inline-block;width:1rem;height:1rem;color:var(--sapContent_NonInteractiveIconColor);fill:currentColor;outline:none}:host([interactive][focused]) .ui5-icon-root{outline:1px dotted var(--sapContent_FocusColor)}.ui5-icon-root{display:flex;outline:none;vertical-align:top}:host(:not([dir=ltr])) .ui5-icon-root[dir=rtl]{transform:scaleX(-1);transform-origin:center}";

const ICON_NOT_FOUND = "ICON_NOT_FOUND";

/**
 * @public
 */
const metadata$1 = {
	tag: "ui5-icon",
	languageAware: true,
	properties: /** @lends sap.ui.webcomponents.main.Icon.prototype */ {
		/**
		 * Defines if the icon is interactive (focusable and pressable)
		 * @type {boolean}
		 * @defaultvalue false
		 * @public
		 * @since 1.0.0-rc.8
		 */
		interactive: {
			type: Boolean,
		},

		/**
		 * Defines the unique identifier (icon name) of the component.
		 * <br>
		 *
		 * To browse all available icons, see the
		 * <ui5-link target="_blank" href="https://openui5.hana.ondemand.com/test-resources/sap/m/demokit/iconExplorer/webapp/index.html" class="api-table-content-cell-link">Icon Explorer</ui5-link>.
		 * <br>
		 *
		 * Example:
		 * <br>
		 * <code>name='add'</code>, <code>name='delete'</code>, <code>name='employee'</code>.
		 * <br><br>
		 *
		 * <b>Note:</b> To use the SAP Fiori Tools icons,
		 * you need to set the <code>tnt</code> prefix in front of the icon's name.
		 * <br>
		 *
		 * Example:
		 * <br>
		 * <code>name='tnt/antenna'</code>, <code>name='tnt/actor'</code>, <code>name='tnt/api'</code>.
		 * @type {string}
		 * @defaultvalue ""
		 * @public
		*/
		name: {
			type: String,
		},

		/**
		 * Defines the text alternative of the component.
		 * If not provided a default text alternative will be set, if present.
		 * <br><br>
		 * <b>Note:</b> Every icon should have a text alternative in order to
		 * calculate its accessible name.
		 *
		 * @type {string}
		 * @defaultvalue ""
		 * @public
		 */
		accessibleName: {
			type: String,
		},

		/**
		 * Defines whether the component should have a tooltip.
		 *
		 * @type {boolean}
		 * @defaultvalue false
		 * @public
		 */
		showTooltip: {
			type: Boolean,
		},

		/**
		 * Defines the accessibility role of the component.
		 * @defaultvalue ""
		 * @private
		 * @since 1.0.0-rc.15
		 */
		role: {
			type: String,
		},

		/**
		 * Defines the aria hidden state of the component.
		 * @private
		 * @since 1.0.0-rc.15
		 */
		ariaHidden: {
			type: String,
		},

		/**
		 * @private
		 */
		pathData: {
			type: String,
			noAttribute: true,
		},

		/**
		 * @private
		 */
		accData: {
			type: Object,
			noAttribute: true,
		},

		/**
		 * @private
		 */
		focused: {
			type: Boolean,
		},

		/**
		* @private
		*/
		invalid: {
			type: Boolean,
		},

		/**
		 * @private
		 */
		effectiveAccessibleName: {
			type: String,
			defaultValue: undefined,
			noAttribute: true,
		},
	},
	events: /** @lends sap.ui.webcomponents.main.Icon.prototype */ {
		/**
		 * Fired on mouseup, space and enter if icon is interactive
		 * @private
		 * @since 1.0.0-rc.8
		 */
		click: {},
	},
};

/**
 * @class
 * <h3 class="comment-api-title">Overview</h3>
 *
 * The <code>ui5-icon</code> component represents an SVG icon.
 * There are two main scenarios how the <code>ui5-icon</code> component is used:
 * as a purely decorative element; or as a visually appealing clickable area in the form of an icon button.
 * <br><br>
 * A large set of built-in icons is available
 * and they can be used by setting the <code>name</code> property on the <code>ui5-icon</code>.
 * But before using an icon, you need to import the desired icon.
 * <br>
 *
 * For the standard icon collection, you have to import an icon from the <code>@ui5/webcomponents-icons</code> package:
 * <br>
 * <code>import "@ui5/webcomponents-icons/dist/employee.js";</code>
 * <br>
 *
 * For the SAP Fiori Tools icon collection (supported since 1.0.0-rc.10), you have to import an icon from the <code>@ui5/webcomponents-icons-tnt</code> package:
 * <br>
 * <code>import "@ui5/webcomponents-icons-tnt/dist/antenna.js";</code>
 *
 * <br><br>
 * <h3>Keyboard Handling</h3>
 *
 * <ul>
 * <li>[SPACE, ENTER, RETURN] - Fires the <code>click</code> event if the <code>interactive</code> property is set to true.</li>
 * <li>[SHIFT] - If [SPACE] or [ENTER],[RETURN] is pressed, pressing [SHIFT] releases the ui5-icon without triggering the click event.</li>
 * </ul>
 * <br><br>
 *
 * <h3>ES6 Module Import</h3>
 *
 * <code>import "@ui5/webcomponents/dist/Icon.js";</code>
 *
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.main.Icon
 * @extends sap.ui.webcomponents.base.UI5Element
 * @tagname ui5-icon
 * @implements sap.ui.webcomponents.main.IIcon
 * @public
 */
class Icon extends UI5Element$1 {
	static get metadata() {
		return metadata$1;
	}

	static get render() {
		return litRender$1;
	}

	static get template() {
		return main;
	}

	static get styles() {
		return iconCss;
	}

	static async onDefine() {
		this.createGlobalStyle(); // hide all icons until the first icon has rendered (and added the Icon.css)
	}

	_onfocusin(event) {
		if (this.interactive) {
			this.focused = true;
		}
	}

	_onfocusout(event) {
		this.focused = false;
	}

	_onkeydown(event) {
		if (!this.interactive) {
			return;
		}

		if (isEnter(event)) {
			this.fireEvent("click");
		}

		if (isSpace(event)) {
			event.preventDefault(); // prevent scrolling
		}
	}

	_onkeyup(event) {
		if (this.interactive && isSpace(event)) {
			this.fireEvent("click");
		}
	}

	_onclick(event) {
		if (this.interactive) {
			// prevent the native event and fire custom event to ensure the noConfict "ui5-click" is fired
			event.stopPropagation();
			this.fireEvent("click");
		}
	}

	get _dir() {
		if (!this.effectiveDir) {
			return;
		}

		if (this.ltr) {
			return "ltr";
		}

		return this.effectiveDir;
	}

	get effectiveAriaHidden() {
		if (this.ariaHidden === "") {
			return;
		}

		return this.ariaHidden;
	}

	get tabIndex() {
		return this.interactive ? "0" : "-1";
	}

	get effectiveAccessibleRole() {
		if (this.role) {
			return this.role;
		}

		if (this.interactive) {
			return "button";
		}

		return this.effectiveAccessibleName ? "img" : "presentation";
	}

	static createGlobalStyle() {
		if (isLegacyBrowser$1()) {
			const styleElement = document.head.querySelector(`style[data-ui5-icon-global]`);
			if (!styleElement) {
				createStyleInHead$1(`ui5-icon { display: none !important; }`, { "data-ui5-icon-global": "" });
			}
		}
	}

	static removeGlobalStyle() {
		if (isLegacyBrowser$1()) {
			const styleElement = document.head.querySelector(`style[data-ui5-icon-global]`);
			if (styleElement) {
				document.head.removeChild(styleElement);
			}
		}
	}

	async onBeforeRendering() {
		const name = this.name;
		if (!name) {
			/* eslint-disable-next-line */
			return console.warn("Icon name property is required", this);
		}
		let iconData = getIconDataSync(name);
		if (!iconData) {
			iconData = await getIconData(name);
		}

		if (iconData === ICON_NOT_FOUND) {
			this.invalid = true;
			/* eslint-disable-next-line */
			return console.warn(`Required icon is not registered. You can either import the icon as a module in order to use it e.g. "@ui5/webcomponents-icons/dist/${name.replace("sap-icon://", "")}.js", or setup a JSON build step and import "@ui5/webcomponents-icons/dist/AllIcons.js".`);
		}

		if (!iconData) {
			this.invalid = true;
			/* eslint-disable-next-line */
			return console.warn(`Required icon is not registered. Invalid icon name: ${this.name}`);
		}

		// in case a new valid name is set, show the icon
		this.invalid = false;
		this.pathData = iconData.pathData;
		this.accData = iconData.accData;
		this.ltr = iconData.ltr;
		this.packageName = iconData.packageName;

		if (this.accessibleName) {
			this.effectiveAccessibleName = this.accessibleName;
		} else if (this.accData) {
			if (!getI18nBundleData$1(this.packageName)) {
				await fetchI18nBundle$1(this.packageName);
			}
			const i18nBundle = getI18nBundle$1(this.packageName);
			this.effectiveAccessibleName = i18nBundle.getText(this.accData) || undefined;
		}
	}

	get hasIconTooltip() {
		return this.showTooltip && this.effectiveAccessibleName;
	}

	async onEnterDOM() {
		setTimeout(() => {
			this.constructor.removeGlobalStyle(); // remove the global style as Icon.css is already in place
		}, 0);
	}
}

Icon.define();

const ARIA_LABEL_CARD_CONTENT = {key: "ARIA_LABEL_CARD_CONTENT", defaultText: "Card Content"};const ARIA_ROLEDESCRIPTION_CARD = {key: "ARIA_ROLEDESCRIPTION_CARD", defaultText: "Card"};

registerThemePropertiesLoader("@ui5/webcomponents-theme-base", "sap_fiori_3", () => defaultThemeBase);
registerThemePropertiesLoader("@ui5/webcomponents", "sap_fiori_3", () => defaultTheme);
var cardCss = ".ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none}:host(:not([hidden])){display:inline-block;width:100%}.ui5-card-root{width:100%;height:100%;color:var(--sapGroup_TitleTextColor);background:var(--sapTile_Background);box-shadow:var(--_ui5_card_box_shadow);border-radius:.25rem;border:1px solid var(--_ui5_card_border_color);overflow:hidden;font-family:\"72override\",var(--sapFontFamily);font-size:var(--sapFontSize);box-sizing:border-box}.ui5-card-root.ui5-card--nocontent{height:auto}.ui5-card-root.ui5-card--nocontent .ui5-card-header-root{border-bottom:none}.ui5-card-root .ui5-card-header-root{display:block;border-bottom:1px solid var(--_ui5_card_header_border_color)}";

/**
 * @public
 */
const metadata = {
	tag: "ui5-card",
	languageAware: true,
	managedSlots: true,
	slots: /** @lends sap.ui.webcomponents.main.Card.prototype */ {

		/**
		 * Defines the content of the component.
		 * @type {HTMLElement[]}
		 * @slot content
		 * @public
		 */
		"default": {
			propertyName: "content",
			type: HTMLElement,
		},

		/**
		 * Defines the header of the component.
		 * <br><br>
		 * <b>Note:</b> Use <code>ui5-card-header</code> for the intended design.
		 * @type {HTMLElement[]}
         * @since 1.0.0-rc.15
		 * @slot content
		 * @public
		 */
		header: {
			type: HTMLElement,
		},
	},
	properties: /** @lends sap.ui.webcomponents.main.Card.prototype */ {

	},
	events: /** @lends sap.ui.webcomponents.main.Card.prototype */ {

	},
};

/**
 * @class
 * <h3 class="comment-api-title">Overview</h3>
 *
 * The <code>ui5-card</code> is a component that represents information in the form of a
 * tile with separate header and content areas.
 * The content area of a <code>ui5-card</code> can be arbitrary HTML content.
 * The header can be used through slot <code>header</code>. For which there is a <code>ui5-card-header</code> component to achieve the card look and fill.
 *
 * Note: We recommend the usage of <code>ui5-card-header</code> for the header slot, so advantage can be taken for keyboard handling, styling and accessibility.
 *
 * <h3>CSS Shadow Parts</h3>
 *
 * <ui5-link target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/::part">CSS Shadow Parts</ui5-link> allow developers to style elements inside the Shadow DOM.
 *
 * <h3>ES6 Module Import</h3>
 *
 * <code>import "@ui5/webcomponents/dist/Card";</code>
 * <br>
 * <code>import "@ui5/webcomponents/dist/CardHeader.js";</code> (for <code>ui5-card-header</code>)
 *
 * @constructor
 * @author SAP SE
 * @alias sap.ui.webcomponents.main.Card
 * @extends sap.ui.webcomponents.base.UI5Element
 * @tagname ui5-card
 * @public
 */
class Card extends UI5Element {
	constructor() {
		super();

		this.i18nBundle = getI18nBundle("@ui5/webcomponents");
	}

	static get metadata() {
		return metadata;
	}

	static get render() {
		return litRender;
	}

	static get template() {
		return main$1;
	}

	static get styles() {
		return cardCss;
	}

	get classes() {
		return {
			"ui5-card-root": true,
			"ui5-card--nocontent": !this.content.length,
		};
	}

	get hasHeader() {
		return !!this.header.length;
	}

	get ariaCardRoleDescription() {
		return this.i18nBundle.getText(ARIA_ROLEDESCRIPTION_CARD);
	}

	get ariaCardContentLabel() {
		return this.i18nBundle.getText(ARIA_LABEL_CARD_CONTENT);
	}

	get ariaLabelledByCard() {
		let labels;
		if (this.hasHeader) {
			labels = this.header[0].hasAttribute("title-text") ? `${this._id}--header-title ${this._id}-desc` : `${this._id}-desc`;
		} else {
			labels = `${this._id}-desc`;
		}
		return labels;
	}

	static get dependencies() {
		return [Icon];
	}

	static async onDefine() {
		await fetchI18nBundle("@ui5/webcomponents");
	}
}

Card.define();

var index = {
    ActionTypes: ActionTypes,
    ADMIN_UI_MODULE,
    install(app, options) {
        if (!options.adminWebsocket)
            throw new Error(`Failed to load the plugin: no "adminWebsocket" was provided in the plugin options`);
        if (!options.store)
            throw new Error(`Failed to load the plugin: no Vuex "store" was provided in the plugin options`);
        options.store.registerModule(ADMIN_UI_MODULE, hcAdminVuexModule(options.adminWebsocket));
        app.component("InstalledApps", script);
    },
};

export { index as default };
