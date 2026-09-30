# TE·OS — Desktop Instrument

以 teenage engineering K.O. II 的硬件为设计灵感，把 Chrome 新标签页变成一台桌面仪器：银色面板、分段时钟屏、网站按键、天气推子与旋钮，以及点阵日历。

A Chrome new tab inspired by the teenage engineering K.O. II: a silver panel, a segment clock, website keys, weather faders and knobs, and a dot-matrix calendar.

[中文](#中文) · [English](#english) · [下载 / Download](https://github.com/RSK21X/TE-OS-Chrome-New-Tab/archive/refs/heads/main.zip)

## 预览 · Screenshots

### 银色面板 · Silver panel

![TE·OS 银色硬件面板 / Silver hardware panel](screenshots/hardware-light.png)

### 深色面板 · Dark panel

![TE·OS 深色硬件面板 / Dark hardware panel](screenshots/hardware-dark.png)

截图中的天气为演示数据，实际使用时从 Open-Meteo 获取。 · Screenshots show demonstration weather; the extension fetches weather from Open-Meteo during use.

## 中文

### 功能

- **硬件风格时钟**：分段数字显示本地时间，支持 12/24 小时制。
- **可自定义网站按键**：使用网站图标，支持添加、编辑、删除，最多 12 个；修改会同步到其他已打开的新标签页。
- **天气推子与旋钮**：查看六个预报时段，选择时段后更新屏幕读数；白色旋钮切换摄氏/华氏，橙色旋钮打开城市查询。
- **点阵日历**：浏览月份、选择日期、返回今天，并在跨午夜时更新当天日期。
- **搜索**：支持 Google 与 Bing，使用键盘快捷键快速搜索或打开网站。
- **中英文与明暗主题**：设置在本机保存；字体随扩展打包，无需在线加载字体。

### 安装

1. [下载主分支 ZIP](https://github.com/RSK21X/TE-OS-Chrome-New-Tab/archive/refs/heads/main.zip) 并解压。
2. 在 Chrome 地址栏打开 `chrome://extensions`。
3. 开启右上角的 **开发者模式**。
4. 点击 **加载已解压的扩展程序**，选择包含 `manifest.json` 的文件夹。下载主分支 ZIP 后通常为 `TE-OS-Chrome-New-Tab-main`。
5. 打开新标签页即可使用。

也可以克隆仓库后直接加载仓库文件夹。使用 Manifest V3，无需构建步骤。

更新时，替换原扩展文件夹中的文件，在 `chrome://extensions` 点击该扩展的重新加载按钮，然后打开新的标签页。保留原文件夹路径，方便沿用已保存的设置。

### 操作

| 部件 | 操作 |
| --- | --- |
| 网站按键 | 点击打开网站；点击“编辑”修改名称与网址，网址可省略 `https://`。 |
| 竖向天气推子 | 点击选择预报时段；位置表示这六个时段内的相对温度。 |
| 水平天气推子 | 拖动或使用方向键选择时段，屏幕显示对应的温度与天气。 |
| 白色旋钮 | 点击切换 °C / °F。 |
| 橙色旋钮 | 点击查询和选择城市。 |
| 日历按键 | `−` / `+` 切换月份，“今天”返回当天。 |
| 日历屏幕 | 点击选择日期；聚焦后使用方向键移动选择，`Home` 返回今天。 |

### 键盘快捷键

| 按键 | 功能 |
| --- | --- |
| `/` | 聚焦搜索框。 |
| `1`–`9` | 打开对应序号的网站按键；输入文字或编辑快捷方式时不触发。 |
| `Esc` | 关闭设置与城市查询。 |

### 数据与隐私

- 搜索词发送给所选的 Google 或 Bing 搜索引擎。
- 城市查询与天气使用 Open-Meteo；网站图标使用 Google Favicon 服务，获取失败时显示名称首字母。
- 设置与快捷方式保存在本机浏览器中，不包含分析追踪代码。
- 天气服务不可用时，同一页面中已获取的天气会标记为“缓存”；预设城市的示例数据会标记为“离线”；其他城市没有缓存时显示“无数据”。

## English

### Features

- **Hardware clock** — A segment display for local time with 12/24-hour formats.
- **Custom website keys** — Website favicons, editable names and URLs, and up to 12 shortcuts. Changes synchronize across open new tabs.
- **Weather faders and knobs** — Browse six forecast hours. Select an hour to update the display, use the light knob to change units, and use the orange knob to find a city.
- **Dot-matrix calendar** — Browse months, select dates, return to today, and update the current date after midnight.
- **Search** — Google and Bing, with keyboard shortcuts for search and websites.
- **Language and appearance** — Chinese and English, light and dark panels, locally saved preferences, and bundled fonts.

### Install

1. [Download the main branch ZIP](https://github.com/RSK21X/TE-OS-Chrome-New-Tab/archive/refs/heads/main.zip) and unzip it.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the folder containing `manifest.json`. For the main branch ZIP, this is usually `TE-OS-Chrome-New-Tab-main`.
5. Open a new tab.

You can also clone this repository and load its folder directly. The extension uses Manifest V3 and requires no build step.

To update, replace the files in the existing extension folder, click its reload button at `chrome://extensions`, and open a new tab. Keeping the same folder path helps retain your saved preferences.

### Controls

| Part | Action |
| --- | --- |
| Website keys | Open a website. Use **Edit** to change names and URLs; `https://` is optional. |
| Vertical weather faders | Select a forecast hour. Positions show relative temperatures within the six-hour forecast. |
| Horizontal weather fader | Drag or use arrow keys to select an hour and show its temperature and conditions. |
| Light knob | Switch between °C and °F. |
| Orange knob | Search for and select a city. |
| Calendar keys | Use `−` / `+` to change months, or **Today** to return to the current date. |
| Calendar screen | Click a date. When focused, use arrow keys to move the selection or `Home` to return to today. |

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` | Focus search. |
| `1`–`9` | Open the corresponding website key, except while typing or editing shortcuts. |
| `Esc` | Close settings and city lookup. |

### Data and privacy

- Search terms are sent to the selected Google or Bing search engine.
- City lookup and weather use Open-Meteo. Website icons use Google's Favicon service, with the name's initial as a fallback.
- Preferences and shortcuts stay in the local browser. No analytics tracking code is included.
- If weather requests fail, data already fetched in the same page is marked **CACHE**. Preset sample weather is marked **OFFLINE**. Other cities without cached data show **NO DATA**.

## 字体与设计参考 · Fonts and design reference

字体使用 IBM Plex Sans、IBM Plex Mono、Space Grotesk 和 Noto Sans SC，采用 SIL Open Font License。许可文件位于 [`assets/fonts/licenses/`](assets/fonts/licenses/)。

IBM Plex Sans, IBM Plex Mono, Space Grotesk, and Noto Sans SC are bundled under the SIL Open Font License. License texts are in [`assets/fonts/licenses/`](assets/fonts/licenses/).

设计参考 · Design reference: [teenage engineering EP–133 K.O. II](https://teenage.engineering/products/ep-133).
