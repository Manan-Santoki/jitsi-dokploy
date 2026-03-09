// custom-config.js
// This file is APPENDED to the default config.js by Jitsi's entrypoint.
// Only put overrides here — no need to duplicate the full config.
// Docs: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-configuration

config.defaultLanguage = 'en';

// ─── Meeting defaults ───
config.startWithAudioMuted = true;
config.startWithVideoMuted = true;
config.requireDisplayName = true;
config.enableInsecureRoomNameWarning = false;

// ─── Disable obnoxious prompts ───
config.notifications = [];
config.disableThirdPartyRequests = true;
config.disableInviteFunctions = false;

// ─── Recording / streaming (if you enable Jibri later) ───
// config.fileRecordingsEnabled = true;
// config.liveStreamingEnabled = true;

// ─── Branding ───
config.brandingRoomAlias = null;

// ─── Quality ───
config.resolution = 720;
config.constraints = {
    video: {
        height: { ideal: 720, max: 1080, min: 180 }
    }
};
config.disableSimulcast = false;
config.enableLayerSuspension = true;

// ─── Reactions ───
config.disableReactions = false;
config.disablePolls = false;

// ─── Sounds ───
config.disableJoinLeaveSounds = false;
