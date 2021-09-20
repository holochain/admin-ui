import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, toDisplayString, createCommentVNode } from 'vue';
import { deserializeHash, serializeHash } from '@holochain-open-dev/core-types';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@material/mwc-button';
import '@authentic/mwc-card';
import '@material/mwc-circular-progress';

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
const _hoisted_6 = /*#__PURE__*/createElementVNode("span", { style: {"margin-bottom":"16px","font-size":"1.5em"} }, "Installed apps", -1 /* HOISTED */);
const _hoisted_7 = {
  key: 0,
  style: {"flex":"1","display":"flex","align-items":"center","justify-content":"center"}
};
const _hoisted_8 = /*#__PURE__*/createElementVNode("span", { style: {"margin-top":"160px"} }, "You don't have any apps installed yet", -1 /* HOISTED */);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = { style: {"width":"auto"} };
const _hoisted_11 = { style: {"display":"flex","flex-direction":"row","flex":"1","padding":"8px"} };
const _hoisted_12 = { style: {"flex":"1","display":"flex","flex-direction":"column"} };
const _hoisted_13 = { style: {"font-size":"1.6em"} };
const _hoisted_14 = { style: {"width":"350px","text-align":"left","margin-top":"8px"} };
const _hoisted_15 = /*#__PURE__*/createElementVNode("tr", null, [
  /*#__PURE__*/createElementVNode("th", null, "Cell Nick"),
  /*#__PURE__*/createElementVNode("th", null, "Dna Hash")
], -1 /* HOISTED */);
const _hoisted_16 = { style: {"opacity":"0.7","font-family":"monospace"} };
const _hoisted_17 = { style: {"display":"flex","flex-direction":"column","align-items":"flex-end"} };
const _hoisted_18 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center"} };
const _hoisted_19 = /*#__PURE__*/createElementVNode("span", { style: {"margin-right":"8px","opacity":"0.9"} }, "Your Public Key:", -1 /* HOISTED */);
const _hoisted_20 = { style: {"margin-right":"16px","opacity":"0.7","font-family":"monospace"} };
const _hoisted_21 = {
  key: 0,
  type: "success"
};
const _hoisted_22 = {
  key: 1,
  type: "warning"
};
const _hoisted_23 = {
  key: 2,
  type: "danger"
};
const _hoisted_24 = { style: {"flex":"1","margin-top":"12px"} };
const _hoisted_25 = {
  key: 0,
  style: {"max-width":"600px"}
};
const _hoisted_26 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center","margin-top":"8px","--mdc-theme-primary":"rgb(90, 90, 90)"} };
const _hoisted_27 = ["onClick"];
const _hoisted_28 = ["onClick"];
const _hoisted_29 = ["onClick"];
const _hoisted_30 = ["onClick"];
const _hoisted_31 = ["onClick"];

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
                  createElementVNode("mwc-card", _hoisted_10, [
                    createElementVNode("div", _hoisted_11, [
                      createElementVNode("div", _hoisted_12, [
                        createElementVNode("span", _hoisted_13, toDisplayString(app.installed_app_id), 1 /* TEXT */),
                        createElementVNode("table", _hoisted_14, [
                          _hoisted_15,
                          (openBlock(true), createElementBlock(Fragment, null, renderList(app.cell_data, (cellData) => {
                            return (openBlock(), createElementBlock("tr", {
                              style: {},
                              key: [...cellData.cell_id[0], ...cellData.cell_id[1]]
                            }, [
                              createElementVNode("td", null, [
                                createElementVNode("span", null, toDisplayString(cellData.cell_nick), 1 /* TEXT */)
                              ]),
                              createElementVNode("td", null, [
                                createElementVNode("span", _hoisted_16, toDisplayString(_ctx.serializeHash(cellData.cell_id[0]).substring(0, 12)) + "...", 1 /* TEXT */)
                              ])
                            ]))
                          }), 128 /* KEYED_FRAGMENT */))
                        ])
                      ]),
                      createElementVNode("div", _hoisted_17, [
                        createElementVNode("div", _hoisted_18, [
                          _hoisted_19,
                          createElementVNode("span", _hoisted_20, toDisplayString(_ctx.serializeHash(app.cell_data[0].cell_id[1]).substring(0, 12)) + "...", 1 /* TEXT */),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_21, "Running"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_22, "Paused"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_23, "Disabled"))
                            : createCommentVNode("v-if", true)
                        ]),
                        createElementVNode("div", _hoisted_24, [
                          (_ctx.getReason(app))
                            ? (openBlock(), createElementBlock("span", _hoisted_25, toDisplayString(_ctx.getReason(app)), 1 /* TEXT */))
                            : createCommentVNode("v-if", true)
                        ]),
                        createElementVNode("div", _hoisted_26, [
                          createElementVNode("mwc-button", {
                            onClick: $event => (_ctx.uninstallApp(app.installed_app_id)),
                            style: {"margin-left":"8px"},
                            label: "Uninstall",
                            icon: "delete"
                          }, null, 8 /* PROPS */, _hoisted_27),
                          (!_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 0,
                                onClick: $event => (_ctx.disableApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Disable",
                                icon: "archive"
                              }, null, 8 /* PROPS */, _hoisted_28))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 1,
                                onClick: $event => (_ctx.enableApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Enable",
                                icon: "unarchive"
                              }, null, 8 /* PROPS */, _hoisted_29))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 2,
                                onClick: $event => (_ctx.startApp(app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Start",
                                icon: "play_arrow"
                              }, null, 8 /* PROPS */, _hoisted_30))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 3,
                                onClick: $event => (_ctx.$emit('openApp', app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Open",
                                icon: "launch"
                              }, null, 8 /* PROPS */, _hoisted_31))
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

function hcAdminVuexModule(adminWebsocket, appWebsocket) {
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

var index = {
    ActionTypes: ActionTypes,
    ADMIN_UI_MODULE,
    install(app, options) {
        if (!options.adminWebsocket)
            throw new Error(`Failed to load the plugin: no "adminWebsocket" was provided in the plugin options`);
        if (!options.appWebsocket)
            throw new Error(`Failed to load the plugin: no "appWebsocket" was provided in the plugin options`);
        if (!options.store)
            throw new Error(`Failed to load the plugin: no Vuex "store" was provided in the plugin options`);
        options.store.registerModule(ADMIN_UI_MODULE, hcAdminVuexModule(options.adminWebsocket, options.appWebsocket));
        app.component("InstalledApps", script);
    },
};

export { index as default };
