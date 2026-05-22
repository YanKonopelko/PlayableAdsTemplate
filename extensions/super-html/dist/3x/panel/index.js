"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cache_1 = __importDefault(require("../../platform/cocos/cache"));
const cocos_main_1 = __importDefault(require("../../platform/cocos/cocos_main"));
const config_1 = __importDefault(require("../../core/config/config"));
const electron_1 = require("electron");
//@ts-ignore
window._tool = {
    cache: cache_1.default,
    build: cocos_main_1.default,
    shell: electron_1.shell,
    fs: fs_1.default,
    path: path_1.default,
    run_preview: () => {
        const s_index_path = path_1.default.join(cache_1.default.get().path, "../", "super-html/common", "index.html");
        electron_1.shell.openExternal(s_index_path);
    }
};
exports.style = `
:host { display: block; height: 100%; color: #d8d8d8; background: #242424; font-family: Arial, Helvetica, sans-serif; }
.super-html-panel { box-sizing: border-box; height: 100%; padding: 18px; overflow: auto; }
.toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
.path-input { flex: 1; min-width: 260px; height: 28px; padding: 0 8px; color: #eee; background: #1b1b1b; border: 1px solid #555; border-radius: 4px; }
button { height: 30px; padding: 0 12px; color: #eee; background: #3b3b3b; border: 1px solid #666; border-radius: 4px; cursor: pointer; }
button:hover { background: #474747; }
.options { display: flex; gap: 14px; align-items: center; margin: 0 0 14px; }
.build-table { width: 100%; border-collapse: collapse; background: #2d2d2d; border: 1px solid #444; }
.build-table th, .build-table td { padding: 7px 8px; border-bottom: 1px solid #444; text-align: left; }
.build-table th { color: #bbb; background: #333; font-weight: 600; }
.build-table input { box-sizing: border-box; width: 100%; height: 26px; padding: 0 8px; color: #eee; background: #1f1f1f; border: 1px solid #555; border-radius: 4px; }
.muted { color: #9a9a9a; }
.status { min-height: 20px; margin-top: 12px; color: #91d59c; }
`;
exports.template = `
<div class="super-html-panel">
  <div class="toolbar">
    <input id="buildPath" class="path-input" placeholder="Cocos web-mobile build folder" />
    <button id="save">Save</button>
    <button id="build">Build superHtml</button>
    <button id="preview">Preview common</button>
  </div>
  <label class="options">
    <input id="enableObfuscator" type="checkbox" />
    <span>Enable obfuscator</span>
  </label>
  <table class="build-table">
    <thead>
      <tr>
        <th>Build</th>
        <th>Output</th>
        <th>Custom final file name</th>
      </tr>
    </thead>
    <tbody id="buildNames"></tbody>
  </table>
  <div id="status" class="status"></div>
</div>`;
exports.$ = {
    buildPath: "#buildPath",
    enableObfuscator: "#enableObfuscator",
    buildNames: "#buildNames",
    save: "#save",
    build: "#build",
    preview: "#preview",
    status: "#status",
};
exports.ready = async function () {
    const getBuildKey = (d_channel) => {
        const s_channel_name = d_channel.s_name;
        const s_channel_config_name = d_channel.s_config_name || s_channel_name;
        const s_variant = d_channel.s_zip_name || d_channel.s_html_name || "";
        const s_type = d_channel.b_out_zip ? "zip" : "html";
        return [s_channel_config_name, s_variant, s_type].filter(Boolean).join("__");
    };
    const getDefaultName = (d_channel) => {
        const s_channel_name = d_channel.s_name;
        if (d_channel.b_out_zip) {
            return d_channel.s_zip_name ? `${s_channel_name}_${d_channel.s_zip_name}.zip` : `${s_channel_name}.zip`;
        }
        return d_channel.s_html_name ? `${s_channel_name}_${d_channel.s_html_name}.html` : `${s_channel_name}.html`;
    };
    const setStatus = (message) => {
        this.$.status.innerText = message || "";
    };
    const data = cache_1.default.get();
    this.$.buildPath.value = data.path || "";
    this.$.enableObfuscator.checked = !!data.enable_obfuscator;
    const buildNames = data.build_names || {};
    const rows = config_1.default.inject_channel_adapter.filter((item) => item.b_enable !== false).map((item) => {
        const key = getBuildKey(item);
        const defaultName = getDefaultName(item);
        const value = buildNames[key] || "";
        return `<tr>
            <td>${key}</td>
            <td class="muted">${defaultName}</td>
            <td><input data-build-key="${key}" placeholder="${defaultName}" value="${value}"></td>
        </tr>`;
    });
    this.$.buildNames.innerHTML = rows.join("");
    const collect = () => {
        const next = cache_1.default.get();
        next.path = this.$.buildPath.value.trim();
        next.enable_obfuscator = !!this.$.enableObfuscator.checked;
        next.build_names = {};
        this.$.buildNames.querySelectorAll("input[data-build-key]").forEach((input) => {
            const value = input.value.trim();
            if (value) {
                next.build_names[input.dataset.buildKey] = value;
            }
        });
        return next;
    };
    this.$.save.addEventListener("click", () => {
        cache_1.default.set(collect());
        setStatus("Saved settings/super-html.json");
    });
    this.$.build.addEventListener("click", () => {
        const next = collect();
        cache_1.default.set(next);
        if (!next.path) {
            setStatus("Set build folder path first");
            return;
        }
        setStatus("Building...");
        new cocos_main_1.default(cache_1.default.get_version(), next.path, () => setStatus("Build finished"));
    });
    this.$.preview.addEventListener("click", () => {
        cache_1.default.set(collect());
        window._tool.run_preview();
    });
};
