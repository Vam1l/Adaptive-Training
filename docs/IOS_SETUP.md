# iOS Setup — Personal Signing & Rebranding

This document covers everything you need to do before building Adaptive Training
on a physical iPhone or submitting to the App Store.

The app chassis is derived from [Ischys](https://github.com/ischys-app/Ischys)
(MIT). Several native identifiers still reference `ischys` or the upstream
Apple Developer account. Replace them before signing.

---

## 1. Apple Developer Account

- Enrol in the [Apple Developer Program](https://developer.apple.com/programs/)
  (individual or organisation).
- Note your **Apple Team ID** (10-character string, e.g. `A1B2C3D4E5`).
  Find it at [developer.apple.com → Account → Membership](https://developer.apple.com/account/#/membership/).

---

## 2. Bundle Identifiers

Currently the app uses the Ischys upstream identifiers. Replace them with
identifiers registered under **your** Apple Developer account.

| Target | Current identifier | Where to change |
|---|---|---|
| Main app | `app.ischys.mobile` | `frontend/app.json` → `expo.ios.bundleIdentifier` |
| Android package | `app.ischys.mobile` | `frontend/app.json` → `expo.android.package` |
| App Group | `group.app.ischys.mobile` | `frontend/app.json` → `expo.ios.entitlements` + both target `generated.entitlements` |
| Live Activity widget | `app.ischys.mobile.ischys-widget` | `frontend/targets/ischys-widget/expo-target.config.js` |
| Apple Watch app | `app.ischys.mobile.ischys-watch` | `frontend/targets/ischys-watch/expo-target.config.js` |

**Keep all identifiers consistent.** The app group ID must match across the main
app, the widget, and the Watch app, or HealthKit / Live Activity sharing will
silently fail.

Example convention:
```
Main app:    com.yourname.adaptivetraining
App Group:   group.com.yourname.adaptivetraining
Widget:      com.yourname.adaptivetraining.widget
Watch:       com.yourname.adaptivetraining.watch
```

---

## 3. Apple Team ID

The upstream `appleTeamId` (`L3T79ZQ685`) has been removed from `frontend/app.json`
to prevent accidental use of the upstream account's certificates.

Add **your** Team ID when you're ready to build:

```json
// frontend/app.json → expo.ios
"appleTeamId": "YOUR_TEAM_ID_HERE"
```

Or pass it via EAS Build environment variables / `eas.json` profiles so it
stays out of version control.

---

## 4. App Group

The App Group (`group.app.ischys.mobile`) must be registered in **your** Apple
Developer account and associated with each of the three targets (main app,
widget, Watch).

Files to update once you choose your identifier:
- `frontend/app.json` → `expo.ios.entitlements["com.apple.security.application-groups"]`
- `frontend/targets/ischys-widget/generated.entitlements`
- `frontend/targets/ischys-watch/generated.entitlements`

---

## 5. HealthKit Capability

HealthKit is already configured in `frontend/app.json`:
```json
"com.apple.developer.healthkit": true,
"com.apple.developer.healthkit.access": []
```

Enable the **HealthKit** capability for your App ID in the Apple Developer
portal and include it in your provisioning profile.

---

## 6. URL Scheme

The URL scheme is `ischys` (`frontend/app.json → expo.scheme`). This is safe
to change to e.g. `adaptivetraining` — it is only used for deep links and does
not affect signing. Update it together with any deep-link handling in the app.

---

## 7. Live Activity (Widget) Target

- `frontend/targets/ischys-widget/` contains the Swift Live Activity extension.
- `expo-target.config.js` controls the Expo Prebuild target configuration.
- The three shared Swift files (`WorkoutAttributes.swift`, `LiveActivityActions.swift`,
  `WorkoutIntents.swift`) are **symlinks** into `modules/live-activity/ios/` —
  keep them as symlinks; do not copy them.
- After changing identifiers, run `npx expo prebuild --clean` to regenerate
  the Xcode project.

---

## 8. Apple Watch Target

- `frontend/targets/ischys-watch/` contains the WatchKit SwiftUI app.
- `expo-target.config.js` controls the Expo Prebuild target configuration.
- The Watch app communicates with the phone over WatchConnectivity; no extra
  signing entitlement is needed beyond a matching bundle ID and App Group.

---

## 9. Provisioning & Signing in Xcode

After running `npx expo prebuild`:
1. Open `frontend/ios/Adaptive Training.xcworkspace` (or the generated name) in Xcode.
2. In **Signing & Capabilities** for each target:
   - Set **Team** to your Apple Developer team.
   - Enable **Automatic Signing** (recommended for development) or manage
     provisioning profiles manually for distribution.
3. Ensure **App Groups** capability is added to the main app, widget, and Watch
   targets, all using the same group ID.
4. Ensure **HealthKit** capability is added to the main app target.

---

## 10. EAS Build (optional, recommended)

[Expo Application Services (EAS)](https://docs.expo.dev/eas/) can automate
signing and builds:
```bash
cd frontend
npx eas-cli build --platform ios --profile development
```

Store your Apple credentials securely in EAS secrets rather than committing
them to the repository.

---

## Deferred items summary

The following items intentionally retain Ischys upstream values until the
developer configures their own Apple account:

| Item | Current value | Status |
|---|---|---|
| Bundle ID | `app.ischys.mobile` | **Must replace** before device build |
| App Group | `group.app.ischys.mobile` | **Must replace** (match bundle ID) |
| Apple Team ID | removed from app.json | **Must add** your own |
| URL scheme | `ischys` | Safe to rename (cosmetic) |
| Widget target name | `ischys-widget` | Safe to rename |
| Watch target name | `ischys-watch` | Safe to rename |
