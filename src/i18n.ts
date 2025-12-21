// Internationalization (i18n) support

export type Language = 'en' | 'vi' | 'ja' | 'ko' | 'es' | 'fr' | 'de';

export const languageNames: Record<Language, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
};

export interface Translations {
    // Settings Header
    settings: string;

    // Appearance Section
    appearance: string;
    // Theme keys removed as per PRD (System Sync Only)
    toggle: string;

    // Privacy Section
    privacy: string;
    hideReadReceipts: string;
    hideReadReceiptsDesc: string;
    hideTypingIndicator: string;
    hideTypingIndicatorDesc: string;
    blockLinkTracking: string;
    blockLinkTrackingDesc: string;
    minimizeToTray: string; // Added for Settings UI
    minimizeToTrayDesc: string;

    // Keyboard Shortcuts Section
    keyboardShortcuts: string;
    openSettings: string;
    toggleDarkMode: string;
    quitApp: string;

    // Notifications Section
    notifications: string;
    enableNotifications: string;
    enableNotificationsDesc: string;
    notificationSound: string;
    notificationSoundDesc: string;
    showMessagePreview: string;
    showMessagePreviewDesc: string;

    // Language Section
    language: string;
    languageDesc: string;

    // About Section
    about: string;
    version: string;
    aboutTitle: string;
    aboutDescription1: string;
    aboutDescription2: string;
    disclaimer: string;
    visitWebsite: string;

    // Auto Update
    checkForUpdates: string;
    checkingForUpdates: string;
    updateAvailable: string;
    updateNotAvailable: string;
    updateError: string;
    downloadManually: string;
    updateDownloaded: string;
    restartApp: string;
    closeBtn: string;
}

export const translations: Record<Language, Translations> = {
    // English
    en: {
        settings: 'Settings',
        appearance: 'Appearance',

        toggle: 'Toggle',
        privacy: 'Privacy',
        hideReadReceipts: 'Hide Read Receipts',
        hideReadReceiptsDesc: "Others won't see when you've read messages",
        hideTypingIndicator: 'Hide Typing Indicator',
        hideTypingIndicatorDesc: "Others won't see when you're typing",
        blockLinkTracking: 'Block Link Tracking',
        blockLinkTrackingDesc: "Remove Facebook's tracking from links",
        minimizeToTray: 'Minimize to Tray',
        minimizeToTrayDesc: 'Minimize window to system tray instead of closing',
        keyboardShortcuts: 'Keyboard Shortcuts',
        openSettings: 'Open Settings',
        toggleDarkMode: 'Toggle Dark Mode',
        quitApp: 'Quit App',
        notifications: 'Notifications',
        enableNotifications: 'Enable Notifications',
        enableNotificationsDesc: 'Show native desktop notifications for new messages',
        notificationSound: 'Notification Sound',
        notificationSoundDesc: 'Play sound when receiving notifications',
        showMessagePreview: 'Show Message Preview',
        showMessagePreviewDesc: 'Display message content in notifications',
        language: 'Language',
        languageDesc: 'Select your preferred language',
        about: 'About',
        version: 'Version',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: "This is a desktop interface application replacing Meta's discontinued Messenger Desktop.",
        aboutDescription2: 'It securely utilizes the full features of messenger.com.',
        disclaimer: 'This is an unofficial app, not affiliated with Meta/Facebook.',
        visitWebsite: 'Visit Website',

        checkForUpdates: 'Check for Updates',
        checkingForUpdates: 'Checking for updates...',
        updateAvailable: 'Update available. Downloading...',
        updateNotAvailable: 'No updates available.',
        updateError: 'Update error: ',
        downloadManually: 'Download Manually',
        updateDownloaded: 'Update downloaded. Restart to install?',
        restartApp: 'Restart & Install',
        closeBtn: 'Close',
    },

    // Vietnamese - Tiếng Việt
    vi: {
        settings: 'Cài đặt',
        appearance: 'Giao diện',

        toggle: 'Bật/Tắt',
        privacy: 'Quyền riêng tư',
        hideReadReceipts: 'Ẩn trạng thái đã xem',
        hideReadReceiptsDesc: 'Người khác sẽ không thấy khi bạn đã đọc tin nhắn',
        hideTypingIndicator: 'Ẩn trạng thái đang nhập',
        hideTypingIndicatorDesc: 'Người khác sẽ không thấy khi bạn đang nhập',
        blockLinkTracking: 'Chặn theo dõi liên kết',
        blockLinkTrackingDesc: 'Xóa tracking của Facebook khỏi các liên kết',
        minimizeToTray: 'Thu nhỏ xuống khay hệ thống',
        minimizeToTrayDesc: 'Thu nhỏ cửa sổ xuống khay thay vì đóng',
        keyboardShortcuts: 'Phím tắt',
        openSettings: 'Mở Cài đặt',
        toggleDarkMode: 'Bật/Tắt chế độ tối',
        quitApp: 'Thoát ứng dụng',
        notifications: 'Thông báo',
        enableNotifications: 'Bật thông báo',
        enableNotificationsDesc: 'Hiển thị thông báo desktop khi có tin nhắn mới',
        notificationSound: 'Âm thanh thông báo',
        notificationSoundDesc: 'Phát âm thanh khi nhận thông báo',
        showMessagePreview: 'Xem trước tin nhắn',
        showMessagePreviewDesc: 'Hiển thị nội dung tin nhắn trong thông báo',
        language: 'Ngôn ngữ',
        languageDesc: 'Chọn ngôn ngữ bạn muốn sử dụng',
        about: 'Giới thiệu',
        version: 'Phiên bản',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: 'Đây là ứng dụng dùng giao diện desktop thay thế cho Messenger Desktop của Meta đã khai tử.',
        aboutDescription2: 'Với cơ chế dùng trọn vẹn các tính năng của messenger.com và an toàn.',
        disclaimer: 'Đây là ứng dụng không chính thức, không liên kết với Meta/Facebook.',
        visitWebsite: 'Ghé thăm Website',

        checkForUpdates: 'Kiểm tra cập nhật',
        checkingForUpdates: 'Đang kiểm tra cập nhật...',
        updateAvailable: 'Có bản cập nhật mới. Đang tải xuống...',
        updateNotAvailable: 'Không có bản cập nhật nào.',
        updateError: 'Lỗi cập nhật: ',
        downloadManually: 'Tải thủ công',
        updateDownloaded: 'Đã tải xong. Khởi động lại để cài đặt?',
        restartApp: 'Khởi động & Cài đặt',
        closeBtn: 'Đóng',
    },

    // Japanese - 日本語
    ja: {
        settings: '設定',
        appearance: '外観',

        toggle: '切り替え',
        privacy: 'プライバシー',
        hideReadReceipts: '既読を非表示',
        hideReadReceiptsDesc: 'メッセージを読んだことを他の人に表示しない',
        hideTypingIndicator: '入力中を非表示',
        hideTypingIndicatorDesc: '入力中であることを他の人に表示しない',
        blockLinkTracking: 'リンク追跡をブロック',
        blockLinkTrackingDesc: 'リンクからFacebookのトラッキングを削除',
        minimizeToTray: 'トレイに最小化',
        minimizeToTrayDesc: '閉じる代わりにシステムトレイに最小化',
        keyboardShortcuts: 'キーボードショートカット',
        openSettings: '設定を開く',
        toggleDarkMode: 'ダークモード切り替え',
        quitApp: 'アプリを終了',
        notifications: '通知',
        enableNotifications: '通知を有効にする',
        enableNotificationsDesc: '新しいメッセージのデスクトップ通知を表示',
        notificationSound: '通知音',
        notificationSoundDesc: '通知を受信したときに音を再生',
        showMessagePreview: 'メッセージプレビューを表示',
        showMessagePreviewDesc: '通知にメッセージ内容を表示',
        language: '言語',
        languageDesc: 'ご希望の言語を選択してください',
        about: 'について',
        version: 'バージョン',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: 'これは、廃止されたMetaのMessenger Desktopに代わるデスクトップアプリです。',
        aboutDescription2: 'messenger.comの全機能を安全に利用する仕組みで動作します。',
        disclaimer: 'これは非公式アプリであり、Meta/Facebookとは提携していません。',
        visitWebsite: 'ウェブサイトへ',

        checkForUpdates: '更新を確認',
        checkingForUpdates: '更新を確認中...',
        updateAvailable: '更新があります。ダウンロード中...',
        updateNotAvailable: '更新はありません。',
        updateError: '更新エラー: ',
        downloadManually: '手動でダウンロード',
        updateDownloaded: 'ダウンロード完了。再起動してインストールしますか？',
        restartApp: '再起動してインストール',
        closeBtn: '閉じる',
    },

    // Korean - 한국어
    ko: {
        settings: '설정',
        appearance: '모양',

        toggle: '전환',
        privacy: '개인 정보',
        hideReadReceipts: '읽음 표시 숨기기',
        hideReadReceiptsDesc: '다른 사람이 메시지를 읽었는지 볼 수 없습니다',
        hideTypingIndicator: '입력 중 표시 숨기기',
        hideTypingIndicatorDesc: '다른 사람이 입력 중인지 볼 수 없습니다',
        blockLinkTracking: '링크 추적 차단',
        blockLinkTrackingDesc: '링크에서 Facebook 추적 제거',
        minimizeToTray: '트레이로 최소화',
        minimizeToTrayDesc: '닫는 대신 시스템 트레이로 최소화',
        keyboardShortcuts: '키보드 단축키',
        openSettings: '설정 열기',
        toggleDarkMode: '다크 모드 전환',
        quitApp: '앱 종료',
        notifications: '알림',
        enableNotifications: '알림 활성화',
        enableNotificationsDesc: '새 메시지에 대한 데스크톱 알림 표시',
        notificationSound: '알림 소리',
        notificationSoundDesc: '알림 수신 시 소리 재생',
        showMessagePreview: '메시지 미리보기 표시',
        showMessagePreviewDesc: '알림에 메시지 내용 표시',
        language: '언어',
        languageDesc: '원하는 언어를 선택하세요',
        about: '정보',
        version: '버전',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: '중단된 Meta의 Messenger Desktop을 대체하는 데스크톱 인터페이스 앱입니다.',
        aboutDescription2: 'messenger.com의 모든 기능을 안전하게 사용하는 메커니즘으로 작동합니다.',
        disclaimer: '이것은 비공식 앱이며 Meta/Facebook과 관련이 없습니다.',
        visitWebsite: '웹사이트 방문',

        checkForUpdates: '업데이트 확인',
        checkingForUpdates: '업데이트 확인 중...',
        updateAvailable: '업데이트를 사용할 수 있습니다. 다운로드 중...',
        updateNotAvailable: '사용 가능한 업데이트가 없습니다.',
        updateError: '업데이트 오류: ',
        downloadManually: '수동 다운로드',
        updateDownloaded: '업데이트 다운로드 완료. 다시 시작하여 설치하시겠습니까?',
        restartApp: '다시 시작 및 설치',
        closeBtn: '닫기',
    },

    // Spanish - Español
    es: {
        settings: 'Configuración',
        appearance: 'Apariencia',

        toggle: 'Alternar',
        privacy: 'Privacidad',
        hideReadReceipts: 'Ocultar confirmaciones de lectura',
        hideReadReceiptsDesc: 'Otros no verán cuando hayas leído los mensajes',
        hideTypingIndicator: 'Ocultar indicador de escritura',
        hideTypingIndicatorDesc: 'Otros no verán cuando estés escribiendo',
        blockLinkTracking: 'Bloquear seguimiento de enlaces',
        blockLinkTrackingDesc: 'Eliminar el rastreo de Facebook de los enlaces',
        minimizeToTray: 'Minimizar a la bandeja',
        minimizeToTrayDesc: 'Minimizar ventana a la bandeja en lugar de cerrar',
        keyboardShortcuts: 'Atajos de teclado',
        openSettings: 'Abrir Configuración',
        toggleDarkMode: 'Alternar modo oscuro',
        quitApp: 'Salir de la aplicación',
        notifications: 'Notificaciones',
        enableNotifications: 'Habilitar notificaciones',
        enableNotificationsDesc: 'Mostrar notificaciones de escritorio para nuevos mensajes',
        notificationSound: 'Sonido de notificación',
        notificationSoundDesc: 'Reproducir sonido al recibir notificaciones',
        showMessagePreview: 'Mostrar vista previa del mensaje',
        showMessagePreviewDesc: 'Mostrar contenido del mensaje en las notificaciones',
        language: 'Idioma',
        languageDesc: 'Selecciona tu idioma preferido',
        about: 'Acerca de',
        version: 'Versión',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: 'Esta es una interfaz de escritorio que reemplaza al descontinuado Messenger Desktop de Meta.',
        aboutDescription2: 'Funciona utilizando de forma segura todas las características de messenger.com.',
        disclaimer: 'Esta es una aplicación no oficial, no afiliada a Meta/Facebook.',
        visitWebsite: 'Visitar sitio web',

        checkForUpdates: 'Buscar actualizaciones',
        checkingForUpdates: 'Buscando actualizaciones...',
        updateAvailable: 'Actualización disponible. Descargando...',
        updateNotAvailable: 'No hay actualizaciones disponibles.',
        updateError: 'Error de actualización: ',
        downloadManually: 'Descargar manualmente',
        updateDownloaded: 'Actualización descargada. ¿Reiniciar para instalar?',
        restartApp: 'Reiniciar e instalar',
        closeBtn: 'Cerrar',
    },

    // French - Français
    fr: {
        settings: 'Paramètres',
        appearance: 'Apparence',

        toggle: 'Basculer',
        privacy: 'Confidentialité',
        hideReadReceipts: 'Masquer les confirmations de lecture',
        hideReadReceiptsDesc: 'Les autres ne verront pas quand vous avez lu les messages',
        hideTypingIndicator: "Masquer l'indicateur de saisie",
        hideTypingIndicatorDesc: 'Les autres ne verront pas quand vous tapez',
        blockLinkTracking: 'Bloquer le suivi des liens',
        blockLinkTrackingDesc: 'Supprimer le suivi Facebook des liens',
        minimizeToTray: 'Réduire dans la barre d\'état',
        minimizeToTrayDesc: 'Réduire la fenêtre dans la barre d\'état au lieu de fermer',
        keyboardShortcuts: 'Raccourcis clavier',
        openSettings: 'Ouvrir les paramètres',
        toggleDarkMode: 'Basculer le mode sombre',
        quitApp: "Quitter l'application",
        notifications: 'Notifications',
        enableNotifications: 'Activer les notifications',
        enableNotificationsDesc: 'Afficher les notifications de bureau pour les nouveaux messages',
        notificationSound: 'Son de notification',
        notificationSoundDesc: 'Jouer un son lors de la réception de notifications',
        showMessagePreview: 'Afficher l\'aperçu du message',
        showMessagePreviewDesc: 'Afficher le contenu du message dans les notifications',
        language: 'Langue',
        languageDesc: 'Sélectionnez votre langue préférée',
        about: 'À propos',
        version: 'Version',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: "Ceci est une interface de bureau remplaçant Messenger Desktop de Meta, désormais abandonné.",
        aboutDescription2: "Elle fonctionne en utilisant intégralement et en toute sécurité les fonctionnalités de messenger.com.",
        disclaimer: 'Ceci est une application non officielle, non affiliée à Meta/Facebook.',
        visitWebsite: 'Visiter le site web',

        checkForUpdates: 'Vérifier les mises à jour',
        checkingForUpdates: 'Recherche de mises à jour...',
        updateAvailable: 'Mise à jour disponible. Téléchargement...',
        updateNotAvailable: 'Aucune mise à jour disponible.',
        updateError: 'Erreur de mise à jour: ',
        downloadManually: 'Télécharger manuellement',
        updateDownloaded: 'Mise à jour téléchargée. Redémarrer pour installer ?',
        restartApp: 'Redémarrer & Installer',
        closeBtn: 'Fermer',
    },

    // German - Deutsch
    de: {
        settings: 'Einstellungen',
        appearance: 'Erscheinungsbild',

        toggle: 'Umschalten',
        privacy: 'Datenschutz',
        hideReadReceipts: 'Lesebestätigungen ausblenden',
        hideReadReceiptsDesc: 'Andere sehen nicht, wenn Sie Nachrichten gelesen haben',
        hideTypingIndicator: 'Tipp-Anzeige ausblenden',
        hideTypingIndicatorDesc: 'Andere sehen nicht, wenn Sie tippen',
        blockLinkTracking: 'Link-Tracking blockieren',
        blockLinkTrackingDesc: 'Facebook-Tracking aus Links entfernen',
        minimizeToTray: 'In System-Tray minimieren',
        minimizeToTrayDesc: 'Fenster in System-Tray minimieren statt schließen',
        keyboardShortcuts: 'Tastaturkürzel',
        openSettings: 'Einstellungen öffnen',
        toggleDarkMode: 'Dunkelmodus umschalten',
        quitApp: 'App beenden',
        notifications: 'Benachrichtigungen',
        enableNotifications: 'Benachrichtigungen aktivieren',
        enableNotificationsDesc: 'Desktop-Benachrichtigungen für neue Nachrichten anzeigen',
        notificationSound: 'Benachrichtigungston',
        notificationSoundDesc: 'Ton beim Empfang von Benachrichtigungen abspielen',
        showMessagePreview: 'Nachrichtenvorschau anzeigen',
        showMessagePreviewDesc: 'Nachrichteninhalt in Benachrichtigungen anzeigen',
        language: 'Sprache',
        languageDesc: 'Wählen Sie Ihre bevorzugte Sprache',
        about: 'Über',
        version: 'Version',
        aboutTitle: 'Messenger Neo',
        aboutDescription1: 'Dies ist eine Desktop-Oberfläche, die den eingestellten Messenger Desktop von Meta ersetzt.',
        aboutDescription2: 'Sie nutzt sicher den vollen Funktionsumfang von messenger.com.',
        disclaimer: 'Dies ist eine inoffizielle App, nicht mit Meta/Facebook verbunden.',
        visitWebsite: 'Website besuchen',

        checkForUpdates: 'Nach Updates suchen',
        checkingForUpdates: 'Suche nach Updates...',
        updateAvailable: 'Update verfügbar. Wird heruntergeladen...',
        updateNotAvailable: 'Keine Updates verfügbar.',
        updateError: 'Update-Fehler: ',
        downloadManually: 'Manuell herunterladen',
        updateDownloaded: 'Update heruntergeladen. Zum Installieren neu starten?',
        restartApp: 'Neu starten & installieren',
        closeBtn: 'Schließen',
    },
};

// Detect system language
export function getSystemLanguage(): Language {
    const lang = navigator.language || (navigator as any).userLanguage || 'en';
    const langCode = lang.split('-')[0].toLowerCase();

    const supportedLanguages: Language[] = ['en', 'vi', 'ja', 'ko', 'es', 'fr', 'de'];

    if (supportedLanguages.includes(langCode as Language)) {
        return langCode as Language;
    }
    return 'en';
}

// Get translation
export function useTranslation(language: Language): Translations {
    return translations[language];
}

// Get all supported languages
export function getSupportedLanguages(): { code: Language; name: string }[] {
    return Object.entries(languageNames).map(([code, name]) => ({
        code: code as Language,
        name,
    }));
}
