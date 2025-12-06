use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use uuid::Uuid;

const GA_MEASUREMENT_ID: &str = "G-JHJ6L73YNP"; 
const GA_API_SECRET: &str = "ffMA3nPYSQy8hjxNehcvJA";

#[derive(Serialize)]
struct Event {
    name: String,
    params: serde_json::Value,
}

#[derive(Serialize)]
struct Payload {
    client_id: String,
    events: Vec<Event>,
}

pub struct Analytics {
    client_id: String,
}

impl Analytics {
    pub fn new(app_handle: &tauri::AppHandle) -> Self {
        let client_id = get_or_create_client_id(app_handle);
        Self { client_id }
    }

    pub fn track_event(&self, name: &str, params: serde_json::Value) {
        let client_id = self.client_id.clone();
        let name = name.to_string();
        
        // Spawn async task to avoid blocking main thread
        tauri::async_runtime::spawn(async move {
            let payload = Payload {
                client_id,
                events: vec![Event { name, params }],
            };

            let url = format!(
                "https://www.google-analytics.com/mp/collect?measurement_id={}&api_secret={}",
                GA_MEASUREMENT_ID, GA_API_SECRET
            );

            let client = reqwest::Client::new();
            let _ = client.post(&url)
                .json(&payload)
                .send()
                .await;
        });
    }

    pub fn start_heartbeat(&self) {
        let client_id = self.client_id.clone();
        
        tauri::async_runtime::spawn(async move {
            let mut interval = tokio::time::interval(std::time::Duration::from_secs(300)); // 5 minutes
            loop {
                interval.tick().await;
                
                let payload = Payload {
                    client_id: client_id.clone(),
                    events: vec![Event { 
                        name: "app_active".to_string(), 
                        params: serde_json::json!({
                            "engagement_time_msec": 300000 // 5 minutes engagement
                        })
                    }],
                };

                let url = format!(
                    "https://www.google-analytics.com/mp/collect?measurement_id={}&api_secret={}",
                    GA_MEASUREMENT_ID, GA_API_SECRET
                );

                let client = reqwest::Client::new();
                let _ = client.post(&url)
                    .json(&payload)
                    .send()
                    .await;
            }
        });
    }
}

fn get_or_create_client_id(app_handle: &tauri::AppHandle) -> String {
    let app_dir = app_handle.path().app_data_dir().unwrap_or_else(|_| PathBuf::from("."));
    if !app_dir.exists() {
        let _ = fs::create_dir_all(&app_dir);
    }
    
    let id_file = app_dir.join("client_id");
    
    if let Ok(id) = fs::read_to_string(&id_file) {
        return id;
    }

    let new_id = Uuid::new_v4().to_string();
    let _ = fs::write(id_file, &new_id);
    new_id
}
