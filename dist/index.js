import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, toDisplayString, createCommentVNode } from 'vue';
import { deserializeHash, serializeHash } from '@holochain-open-dev/core-types';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@material/mwc-button';
import '@authentic/mwc-card';
import '@material/mwc-circular-progress';
import '@material/mwc-snackbar';
import { LitElement, html, css } from 'lit';
import { property, query } from 'lit/decorators.js';
import '@material/mwc-icon-button';

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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

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
                    return "This app was never started";
                }
                else if (Object.keys(reason).includes("user")) {
                    return "This app was disabled by the user";
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
const _hoisted_8 = /*#__PURE__*/createElementVNode("span", null, "You don't have any apps installed yet", -1 /* HOISTED */);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = { style: {"width":"auto"} };
const _hoisted_11 = { style: {"display":"flex","flex-direction":"row","flex":"1","padding":"8px"} };
const _hoisted_12 = { style: {"flex":"1","display":"flex","flex-direction":"column"} };
const _hoisted_13 = { style: {"font-size":"1.3em"} };
const _hoisted_14 = /*#__PURE__*/createElementVNode("span", { style: {"opacity":"0.7","margin-left":"8px"} }, "Dna Hash:", -1 /* HOISTED */);
const _hoisted_15 = ["hash"];
const _hoisted_16 = { style: {"display":"flex","flex-direction":"column","align-items":"flex-end"} };
const _hoisted_17 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center"} };
const _hoisted_18 = /*#__PURE__*/createElementVNode("span", { style: {"margin-right":"8px","opacity":"0.7"} }, "Public Key:", -1 /* HOISTED */);
const _hoisted_19 = ["hash"];
const _hoisted_20 = {
  key: 0,
  type: "success"
};
const _hoisted_21 = {
  key: 1,
  type: "warning"
};
const _hoisted_22 = {
  key: 2,
  type: "danger"
};
const _hoisted_23 = {
  key: 0,
  style: {"margin-top":"8px","max-width":"600px"}
};
const _hoisted_24 = { style: {"display":"flex","flex-direction":"row","align-items":"center","justify-content":"center","margin-top":"8px"} };
const _hoisted_25 = ["onClick"];
const _hoisted_26 = ["onClick"];
const _hoisted_27 = ["onClick"];
const _hoisted_28 = ["onClick"];
const _hoisted_29 = ["onClick"];

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
                        (openBlock(true), createElementBlock(Fragment, null, renderList(app.cell_data, (cellData) => {
                          return (openBlock(), createElementBlock("div", {
                            style: {"margin-top":"8px","display":"flex","flex-direction":"row","align-items":"center"},
                            key: [...cellData.cell_id[0], ...cellData.cell_id[1]]
                          }, [
                            createElementVNode("span", null, toDisplayString(cellData.cell_nick), 1 /* TEXT */),
                            _hoisted_14,
                            createElementVNode("copyable-hash", {
                              style: {"margin-left":"8px"},
                              hash: _ctx.serializeHash(cellData.cell_id[0])
                            }, null, 8 /* PROPS */, _hoisted_15)
                          ]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]),
                      createElementVNode("div", _hoisted_16, [
                        createElementVNode("div", _hoisted_17, [
                          _hoisted_18,
                          createElementVNode("copyable-hash", {
                            hash: _ctx.serializeHash(app.cell_data[0].cell_id[1]),
                            style: {"margin-right":"16px"}
                          }, null, 8 /* PROPS */, _hoisted_19),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_20, "Running"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_21, "Paused"))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("sl-tag", _hoisted_22, "Disabled"))
                            : createCommentVNode("v-if", true)
                        ]),
                        (_ctx.getReason(app))
                          ? (openBlock(), createElementBlock("span", _hoisted_23, toDisplayString(_ctx.getReason(app)), 1 /* TEXT */))
                          : createCommentVNode("v-if", true),
                        createElementVNode("div", _hoisted_24, [
                          createElementVNode("mwc-button", {
                            onClick: $event => (_ctx.uninstallApp(app.installed_app_id)),
                            style: {"margin-left":"8px","--mdc-theme-primary":"#fc0303"},
                            label: "Uninstall",
                            raised: "",
                            icon: "delete"
                          }, null, 8 /* PROPS */, _hoisted_25),
                          (!_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 0,
                                onClick: $event => (_ctx.disableApp(app.installed_app_id)),
                                style: {"margin-left":"8px","--mdc-theme-primary":"#fcf403"},
                                label: "Disable",
                                raised: "",
                                icon: "archive"
                              }, null, 8 /* PROPS */, _hoisted_26))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppDisabled(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 1,
                                onClick: $event => (_ctx.enableApp(app.installed_app_id)),
                                style: {"margin-left":"8px","--mdc-theme-primary":"#3dfc03"},
                                label: "Enable",
                                raised: "",
                                icon: "unarchive"
                              }, null, 8 /* PROPS */, _hoisted_27))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppPaused(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 2,
                                onClick: $event => (_ctx.startApp(app.installed_app_id)),
                                style: {"margin-left":"8px","--mdc-theme-primary":"#3dfc03"},
                                label: "Start",
                                raised: "",
                                icon: "play_arrow"
                              }, null, 8 /* PROPS */, _hoisted_28))
                            : createCommentVNode("v-if", true),
                          (_ctx.isAppRunning(app))
                            ? (openBlock(), createElementBlock("mwc-button", {
                                key: 3,
                                onClick: $event => (_ctx.$emit('openApp', app.installed_app_id)),
                                style: {"margin-left":"8px"},
                                label: "Open",
                                raised: "",
                                icon: "launch"
                              }, null, 8 /* PROPS */, _hoisted_29))
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
                return state.installedApps.appsInfo;
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

class CopyableHash extends LitElement {
    constructor() {
        super(...arguments);
        this.sliceLength = 8;
    }
    copyHash() {
        return __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(this.hash);
            this._copyNotification.show();
        });
    }
    render() {
        return html `
      <mwc-snackbar
        id="copy-notification"
        labelText="Hash copied to clipboard"
      ></mwc-snackbar>
      <div class="row center-content">
        <span style="font-family: monospace;"
          >${this.hash.substring(0, this.sliceLength)}...</span
        >
        <mwc-icon-button
          style="--mdc-icon-button-size	: 24px; --mdc-icon-size: 20px;"
          icon="content_copy"
          @click=${() => this.copyHash()}
        ></mwc-icon-button>
      </div>
    `;
    }
    static get styles() {
        return css `
      .row {
        display: flex;
        flex-direction: row;
      }
      .column {
        display: flex;
        flex-direction: column;
      }
      .fill {
        flex: 1;
      }
      .center-content {
        align-items: center;
        justify-content: center;
        display: flex;
      }
    `;
    }
}
__decorate([
    property({ type: String })
], CopyableHash.prototype, "hash", void 0);
__decorate([
    property({ type: Number })
], CopyableHash.prototype, "sliceLength", void 0);
__decorate([
    query("#copy-notification")
], CopyableHash.prototype, "_copyNotification", void 0);

var index = {
    ActionTypes: ActionTypes,
    ADMIN_UI_MODULE,
    install(app, options) {
        customElements.define("copyable-hash", CopyableHash);
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
