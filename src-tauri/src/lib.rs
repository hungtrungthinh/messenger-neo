use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WebviewUrl, WebviewWindowBuilder,
};

mod analytics;

#[tauri::command]
fn open_settings(app: tauri::AppHandle) {
    // Check if settings window already exists
    if let Some(window) = app.get_webview_window("settings") {
        let _ = window.show();
        let _ = window.set_focus();
        return;
    }
    
    // Create settings window
    let _settings_window = WebviewWindowBuilder::new(
        &app,
        "settings",
        WebviewUrl::App("index.html".into()),
    )
    .title("Settings")
    .inner_size(550.0, 750.0)
    .resizable(true)
    .center()
    .build();
}

#[tauri::command]
fn toggle_dark_mode(window: tauri::WebviewWindow) {
    // Inject dark mode CSS into messenger.com
    let script = r#"
        (function() {
            const darkStyle = document.getElementById('custom-dark-mode');
            if (darkStyle) {
                darkStyle.remove();
            } else {
                const style = document.createElement('style');
                style.id = 'custom-dark-mode';
                style.textContent = `
                    html, body {
                        filter: invert(1) hue-rotate(180deg) !important;
                    }
                    img, video, [style*="background-image"] {
                        filter: invert(1) hue-rotate(180deg) !important;
                    }
                `;
                document.head.appendChild(style);
            }
        })();
    "#;
    let _ = window.eval(script);
}

#[tauri::command]
fn hide_read_receipts(window: tauri::WebviewWindow, hide: bool) {
    let script = if hide {
        r#"
            (function() {
                let style = document.getElementById('hide-seen');
                if (!style) {
                    style = document.createElement('style');
                    style.id = 'hide-seen';
                    style.textContent = '[data-testid*="seen"], [aria-label*="Seen"], [aria-label*="Đã xem"] { display: none !important; }';
                    document.head.appendChild(style);
                }
            })();
        "#
    } else {
        r#"
            (function() {
                const style = document.getElementById('hide-seen');
                if (style) style.remove();
            })();
        "#
    };
    let _ = window.eval(script);
}

#[tauri::command]
async fn show_native_notification(
    app: tauri::AppHandle,
    title: String,
    body: String,
    _icon: String,
) -> Result<(), String> {
    use tauri_plugin_notification::NotificationExt;
    
    app.notification()
        .builder()
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn request_notification_permission(app: tauri::AppHandle) -> bool {
    use tauri_plugin_notification::NotificationExt;
    
    match app.notification().request_permission() {
        Ok(perm) => perm == tauri_plugin_notification::PermissionState::Granted,
        Err(_) => false,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // Track App Start & Heartbeat
            let analytics = analytics::Analytics::new(app.handle());
            analytics.track_event("app_open", serde_json::json!({
                "platform": std::env::consts::OS,
                "version": app.package_info().version.to_string(),
            }));
            analytics.start_heartbeat();

            // Create app menu
            let settings_item = MenuItem::with_id(app, "settings", "Settings...", true, Some("CmdOrCtrl+,"))?;
            let dark_mode_item = MenuItem::with_id(app, "dark_mode", "Toggle Dark Mode", true, Some("CmdOrCtrl+D"))?;
            let hide_seen_item = MenuItem::with_id(app, "hide_seen", "Hide Read Receipts", true, None::<&str>)?;
            let separator = PredefinedMenuItem::separator(app)?;
            let quit_item = PredefinedMenuItem::quit(app, Some("Quit Messenger Neo"))?;
            
            let app_menu = Submenu::with_items(
                app,
                "Messenger Neo",
                true,
                &[&settings_item, &dark_mode_item, &hide_seen_item, &separator, &quit_item],
            )?;
            
            let menu = Menu::with_items(app, &[&app_menu])?;
            app.set_menu(menu)?;
            
            // Handle menu events
            app.on_menu_event(move |app, event| {
                match event.id.as_ref() {
                    "settings" => {
                        if let Some(window) = app.get_webview_window("settings") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        } else {
                            let _ = WebviewWindowBuilder::new(
                                app,
                                "settings",
                                WebviewUrl::App("index.html".into()),
                            )
                            .title("Settings")
                            .inner_size(450.0, 600.0)
                            .resizable(false)
                            .center()
                            .build();
                        }
                    }
                    "dark_mode" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let script = r#"
                                (function() {
                                    const darkStyle = document.getElementById('custom-dark-mode');
                                    if (darkStyle) {
                                        darkStyle.remove();
                                    } else {
                                        const style = document.createElement('style');
                                        style.id = 'custom-dark-mode';
                                        style.textContent = `
                                            html, body {
                                                filter: invert(1) hue-rotate(180deg) !important;
                                            }
                                            img, video, [style*="background-image"], svg {
                                                filter: invert(1) hue-rotate(180deg) !important;
                                            }
                                        `;
                                        document.head.appendChild(style);
                                    }
                                })();
                            "#;
                            let _ = window.eval(script);
                        }
                    }
                    "hide_seen" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let script = r#"
                                (function() {
                                    let style = document.getElementById('hide-seen');
                                    if (style) {
                                        style.remove();
                                    } else {
                                        style = document.createElement('style');
                                        style.id = 'hide-seen';
                                        style.textContent = '[data-testid*="seen"], [aria-label*="Seen"], [aria-label*="Đã xem"] { display: none !important; }';
                                        document.head.appendChild(style);
                                    }
                                })();
                            "#;
                            let _ = window.eval(script);
                        }
                    }
                    _ => {}
                }
            });

            // Create tray menu
            let quit_i = MenuItem::with_id(app, "quit", "Quit Messenger", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Hide Window", true, None::<&str>)?;
            let settings_i = MenuItem::with_id(app, "tray_settings", "Settings...", true, None::<&str>)?;
            
            let tray_menu = Menu::with_items(app, &[&show_i, &hide_i, &settings_i, &quit_i])?;

            // Build tray icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    "tray_settings" => {
                        if let Some(window) = app.get_webview_window("settings") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        } else {
                            let _ = WebviewWindowBuilder::new(
                                app,
                                "settings",
                                WebviewUrl::App("index.html".into()),
                            )
                            .title("Settings")
                            .inner_size(450.0, 600.0)
                            .resizable(false)
                            .center()
                            .build();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_settings, 
            toggle_dark_mode, 
            hide_read_receipts,
            show_native_notification,
            request_notification_permission
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
