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
    theme: string;
    themeDesc: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
    darkModeMessenger: string;
    darkModeMessengerDesc: string;
    toggle: string;

    // Privacy Section
    privacy: string;
    hideReadReceipts: string;
    hideReadReceiptsDesc: string;
    hideTypingIndicator: string;
    hideTypingIndicatorDesc: string;
    blockLinkTracking: string;
    blockLinkTrackingDesc: string;

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
}

export const translations: Record<Language, Translations> = {
    // English
    en: {
        settings: 'Settings',
        appearance: 'Appearance',
        theme: 'Theme',
        themeDesc: 'Choose your preferred color scheme',
        themeSystem: 'System',
        themeLight: 'Light',
        themeDark: 'Dark',
        darkModeMessenger: 'Dark Mode for Messenger',
        darkModeMessengerDesc: 'Apply dark filter to messenger.com',
        toggle: 'Toggle',
        privacy: 'Privacy',
        hideReadReceipts: 'Hide Read Receipts',
        hideReadReceiptsDesc: "Others won't see when you've read messages",
        hideTypingIndicator: 'Hide Typing Indicator',
        hideTypingIndicatorDesc: "Others won't see when you're typing",
        blockLinkTracking: 'Block Link Tracking',
        blockLinkTrackingDesc: "Remove Facebook's tracking from links",
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
        aboutDescription1: 'Replacement for Facebook Messenger Desktop - the official app was discontinued on December 15, 2025.',
        aboutDescription2: "With this app, you don't need to open a web browser to use Messenger. This is a lightweight, fast desktop app with enhanced privacy features.",
        disclaimer: '⚠️ This is an unofficial app, not affiliated with Meta/Facebook.',
    },

    // Vietnamese - Tiếng Việt
    vi: {
        settings: 'Cài đặt',
        appearance: 'Giao diện',
        theme: 'Chủ đề',
        themeDesc: 'Chọn giao diện màu sắc bạn thích',
        themeSystem: 'Hệ thống',
        themeLight: 'Sáng',
        themeDark: 'Tối',
        darkModeMessenger: 'Chế độ tối cho Messenger',
        darkModeMessengerDesc: 'Áp dụng bộ lọc tối cho messenger.com',
        toggle: 'Bật/Tắt',
        privacy: 'Quyền riêng tư',
        hideReadReceipts: 'Ẩn trạng thái đã xem',
        hideReadReceiptsDesc: 'Người khác sẽ không thấy khi bạn đã đọc tin nhắn',
        hideTypingIndicator: 'Ẩn trạng thái đang nhập',
        hideTypingIndicatorDesc: 'Người khác sẽ không thấy khi bạn đang nhập',
        blockLinkTracking: 'Chặn theo dõi liên kết',
        blockLinkTrackingDesc: 'Xóa tracking của Facebook khỏi các liên kết',
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
        aboutDescription1: 'Thay thế cho Messenger Desktop của Facebook - ứng dụng chính thức đã bị khai tử vào ngày 15/12/2025.',
        aboutDescription2: 'Với ứng dụng này, bạn không cần mở trình duyệt web để sử dụng Messenger. Đây là một desktop app nhẹ gọn, nhanh chóng, với các tính năng bảo mật nâng cao.',
        disclaimer: '⚠️ Đây là ứng dụng không chính thức, không liên kết với Meta/Facebook.',
    },

    // Japanese - 日本語
    ja: {
        settings: '設定',
        appearance: '外観',
        theme: 'テーマ',
        themeDesc: 'お好みの配色を選択してください',
        themeSystem: 'システム',
        themeLight: 'ライト',
        themeDark: 'ダーク',
        darkModeMessenger: 'Messengerのダークモード',
        darkModeMessengerDesc: 'messenger.comにダークフィルターを適用',
        toggle: '切り替え',
        privacy: 'プライバシー',
        hideReadReceipts: '既読を非表示',
        hideReadReceiptsDesc: 'メッセージを読んだことを他の人に表示しない',
        hideTypingIndicator: '入力中を非表示',
        hideTypingIndicatorDesc: '入力中であることを他の人に表示しない',
        blockLinkTracking: 'リンク追跡をブロック',
        blockLinkTrackingDesc: 'リンクからFacebookのトラッキングを削除',
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
        aboutDescription1: 'Facebook Messenger Desktopの代替 - 公式アプリは2025年12月15日に廃止されました。',
        aboutDescription2: 'このアプリを使えば、ウェブブラウザを開かずにMessengerを利用できます。軽量で高速なデスクトップアプリで、強化されたプライバシー機能を備えています。',
        disclaimer: '⚠️ これは非公式アプリであり、Meta/Facebookとは提携していません。',
    },

    // Korean - 한국어
    ko: {
        settings: '설정',
        appearance: '모양',
        theme: '테마',
        themeDesc: '원하는 색상 구성표를 선택하세요',
        themeSystem: '시스템',
        themeLight: '라이트',
        themeDark: '다크',
        darkModeMessenger: 'Messenger 다크 모드',
        darkModeMessengerDesc: 'messenger.com에 다크 필터 적용',
        toggle: '전환',
        privacy: '개인 정보',
        hideReadReceipts: '읽음 표시 숨기기',
        hideReadReceiptsDesc: '다른 사람이 메시지를 읽었는지 볼 수 없습니다',
        hideTypingIndicator: '입력 중 표시 숨기기',
        hideTypingIndicatorDesc: '다른 사람이 입력 중인지 볼 수 없습니다',
        blockLinkTracking: '링크 추적 차단',
        blockLinkTrackingDesc: '링크에서 Facebook 추적 제거',
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
        aboutDescription1: 'Facebook Messenger Desktop 대체 - 공식 앱은 2025년 12월 15일에 중단되었습니다.',
        aboutDescription2: '이 앱을 사용하면 웹 브라우저를 열지 않고도 Messenger를 사용할 수 있습니다. 향상된 개인 정보 보호 기능을 갖춘 가볍고 빠른 데스크톱 앱입니다.',
        disclaimer: '⚠️ 이것은 비공식 앱이며 Meta/Facebook과 관련이 없습니다.',
    },

    // Spanish - Español
    es: {
        settings: 'Configuración',
        appearance: 'Apariencia',
        theme: 'Tema',
        themeDesc: 'Elige tu esquema de color preferido',
        themeSystem: 'Sistema',
        themeLight: 'Claro',
        themeDark: 'Oscuro',
        darkModeMessenger: 'Modo oscuro para Messenger',
        darkModeMessengerDesc: 'Aplicar filtro oscuro a messenger.com',
        toggle: 'Alternar',
        privacy: 'Privacidad',
        hideReadReceipts: 'Ocultar confirmaciones de lectura',
        hideReadReceiptsDesc: 'Otros no verán cuando hayas leído los mensajes',
        hideTypingIndicator: 'Ocultar indicador de escritura',
        hideTypingIndicatorDesc: 'Otros no verán cuando estés escribiendo',
        blockLinkTracking: 'Bloquear seguimiento de enlaces',
        blockLinkTrackingDesc: 'Eliminar el rastreo de Facebook de los enlaces',
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
        aboutDescription1: 'Reemplazo de Facebook Messenger Desktop - la aplicación oficial fue descontinuada el 15 de diciembre de 2025.',
        aboutDescription2: 'Con esta aplicación, no necesitas abrir un navegador web para usar Messenger. Es una aplicación de escritorio ligera y rápida con funciones de privacidad mejoradas.',
        disclaimer: '⚠️ Esta es una aplicación no oficial, no afiliada a Meta/Facebook.',
    },

    // French - Français
    fr: {
        settings: 'Paramètres',
        appearance: 'Apparence',
        theme: 'Thème',
        themeDesc: 'Choisissez votre palette de couleurs préférée',
        themeSystem: 'Système',
        themeLight: 'Clair',
        themeDark: 'Sombre',
        darkModeMessenger: 'Mode sombre pour Messenger',
        darkModeMessengerDesc: 'Appliquer un filtre sombre à messenger.com',
        toggle: 'Basculer',
        privacy: 'Confidentialité',
        hideReadReceipts: 'Masquer les confirmations de lecture',
        hideReadReceiptsDesc: 'Les autres ne verront pas quand vous avez lu les messages',
        hideTypingIndicator: "Masquer l'indicateur de saisie",
        hideTypingIndicatorDesc: 'Les autres ne verront pas quand vous tapez',
        blockLinkTracking: 'Bloquer le suivi des liens',
        blockLinkTrackingDesc: 'Supprimer le suivi Facebook des liens',
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
        aboutDescription1: "Remplacement de Facebook Messenger Desktop - l'application officielle a été abandonnée le 15 décembre 2025.",
        aboutDescription2: "Avec cette application, vous n'avez pas besoin d'ouvrir un navigateur web pour utiliser Messenger. C'est une application de bureau légère et rapide avec des fonctionnalités de confidentialité améliorées.",
        disclaimer: '⚠️ Ceci est une application non officielle, non affiliée à Meta/Facebook.',
    },

    // German - Deutsch
    de: {
        settings: 'Einstellungen',
        appearance: 'Erscheinungsbild',
        theme: 'Design',
        themeDesc: 'Wählen Sie Ihr bevorzugtes Farbschema',
        themeSystem: 'System',
        themeLight: 'Hell',
        themeDark: 'Dunkel',
        darkModeMessenger: 'Dunkelmodus für Messenger',
        darkModeMessengerDesc: 'Dunklen Filter auf messenger.com anwenden',
        toggle: 'Umschalten',
        privacy: 'Datenschutz',
        hideReadReceipts: 'Lesebestätigungen ausblenden',
        hideReadReceiptsDesc: 'Andere sehen nicht, wenn Sie Nachrichten gelesen haben',
        hideTypingIndicator: 'Tipp-Anzeige ausblenden',
        hideTypingIndicatorDesc: 'Andere sehen nicht, wenn Sie tippen',
        blockLinkTracking: 'Link-Tracking blockieren',
        blockLinkTrackingDesc: 'Facebook-Tracking aus Links entfernen',
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
        aboutDescription1: 'Ersatz für Facebook Messenger Desktop - die offizielle App wurde am 15. Dezember 2025 eingestellt.',
        aboutDescription2: 'Mit dieser App müssen Sie keinen Webbrowser öffnen, um Messenger zu nutzen. Es ist eine leichte, schnelle Desktop-App mit erweiterten Datenschutzfunktionen.',
        disclaimer: '⚠️ Dies ist eine inoffizielle App, nicht mit Meta/Facebook verbunden.',
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
