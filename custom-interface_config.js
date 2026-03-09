// custom-interface_config.js
// This file is APPENDED to the default interface_config.js.
// Controls visual/UI elements. Only overrides needed here.
// Docs: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-configuration

// ─── Branding ───
interfaceConfig.APP_NAME = 'Manan Meet';
interfaceConfig.NATIVE_APP_NAME = 'Manan Meet';
interfaceConfig.PROVIDER_NAME = 'Manan Santoki';
interfaceConfig.DEFAULT_REMOTE_DISPLAY_NAME = 'Participant';
interfaceConfig.DEFAULT_LOCAL_DISPLAY_NAME = 'me';

// Show/hide watermark (your logo in top-left)
interfaceConfig.SHOW_BRAND_WATERMARK = true;
interfaceConfig.SHOW_WATERMARK_FOR_GUESTS = true;

// Link when clicking the watermark logo
interfaceConfig.BRAND_WATERMARK_LINK = 'https://manansantoki.com';
interfaceConfig.JITSI_WATERMARK_LINK = 'https://manansantoki.com';
interfaceConfig.SHOW_JITSI_WATERMARK = true;

// ─── Toolbar ───
// Available buttons: camera, chat, closedcaptions, desktop, download,
// embedmeeting, etherpad, feedback, filmstrip, fullscreen, hangup,
// help, highlight, invite, linktosalesforce, livestreaming, microphone,
// mute-everyone, mute-video-everyone, noisesuppression, participants-pane,
// profile, raisehand, recording, security, select-background, settings,
// shareaudio, sharedvideo, shortcuts, stats, tileview, toggle-camera,
// videoquality, whiteboard
interfaceConfig.TOOLBAR_BUTTONS = [
    'camera',
    'chat',
    'desktop',
    'filmstrip',
    'fullscreen',
    'hangup',
    'microphone',
    'participants-pane',
    'profile',
    'raisehand',
    'recording',
    'security',
    'select-background',
    'settings',
    'shareaudio',
    'sharedvideo',
    'tileview',
    'toggle-camera',
    'videoquality',
    'invite',
    'noisesuppression',
    'whiteboard',
];

// ─── UI tweaks ───
interfaceConfig.DISABLE_DOMINANT_SPEAKER_INDICATOR = false;
interfaceConfig.DISABLE_FOCUS_INDICATOR = false;
interfaceConfig.DISABLE_VIDEO_BACKGROUND = false;
interfaceConfig.FILM_STRIP_MAX_HEIGHT = 120;
interfaceConfig.VERTICAL_FILMSTRIP = true;
interfaceConfig.CLOSE_PAGE_GUEST_HINT = false;
interfaceConfig.SHOW_PROMOTIONAL_CLOSE_PAGE = false;
interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE = true;
interfaceConfig.DISPLAY_WELCOME_FOOTER = false;
interfaceConfig.DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD = false;

// Hide "powered by Jitsi" on prejoin
interfaceConfig.SHOW_POWERED_BY = false;

// ─── Gravatar ───
interfaceConfig.SHOW_CHROME_EXTENSION_BANNER = false;
