# vpe-rn-demo

NAVER Cloud VPE React Native SDK(`vpe-react-native@2.1.3`)로 Live / VOD 를 재생하는 데모 앱.

- Expo SDK 54 (React Native 0.81.5, New Architecture) · TypeScript
- **Expo Go 미지원** (SDK가 네이티브 모듈 사용) → development build(`expo run:*`)로 실행
- `android/`, `ios/` 는 `app.json` 으로부터 자동 생성(CNG)되며 git 에 포함하지 않음

## 1. 환경변수

```bash
cp .env.example .env
```

`.env` 는 git 에 커밋되지 않는다. 값 변경 후에는 Metro 를 재시작한다(`npx expo start --dev-client --clear`).

| 변수 | 설명 |
|---|---|
| `EXPO_PUBLIC_VPE_ACCESS_KEY` | NCP 콘솔 > VPE > Player 관리에서 발급한 Access Key |
| `EXPO_PUBLIC_VPE_PLATFORM` | `pub`(민간, 기본) / `gov`(공공) |
| `EXPO_PUBLIC_VPE_APP_ID` | (선택) 개발 빌드에서 키 검증에 사용할 앱 ID. 기본값은 실제 앱 ID |
| `EXPO_PUBLIC_VOD_URL`, `EXPO_PUBLIC_LIVE_URL` | (선택) 재생 URL. 비우면 샘플 스트림 |

> Access Key 는 앱 ID 에 묶여 있다. 콘솔에서 플레이어 생성 시 Android/iOS 앱 ID 를 **`com.vpe.rndemo`** 로 등록한다
> (변경하려면 `app.json` 의 `android.package`, `ios.bundleIdentifier` 수정 후 `npm run prebuild`).
> `EXPO_PUBLIC_*` 값은 JS 번들에 그대로 포함되므로 서버 비밀값은 넣지 않는다.

## 2. Android (Windows 11)

사전 준비 (최초 1회)

1. [Android Studio](https://developer.android.com/studio) 설치 → SDK Manager 에서 Android SDK Platform 36, Build-Tools, Platform-Tools, Emulator 설치
2. JDK 17 또는 21 사용 (Gradle 8.14 는 JDK 25 미지원). Android Studio 내장 JBR 을 쓰면 된다
3. 사용자 환경변수 설정 후 터미널 재시작
   - `JAVA_HOME` = `C:\Program Files\Android\Android Studio\jbr`
   - `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
   - `Path` 에 `%ANDROID_HOME%\platform-tools` 추가

실행

```bash
npm install
npm run android
```

- 에뮬레이터: Android Studio > Device Manager 에서 가상 기기를 먼저 켜 둔다
- 실기기: 개발자 옵션 > USB 디버깅 켜고 USB 연결(`adb devices` 로 확인). `npm run android -- --device` 로 기기 선택
- 이후에는 `npm start` 로 Metro 만 띄우고 설치된 앱을 열면 된다

## 3. iOS

iOS 빌드는 macOS + Xcode 가 필요하다 (Windows 에서는 불가).

```bash
npm install
npm run ios                 # 시뮬레이터
npm run ios -- --device     # 실기기 (Xcode 에서 Signing Team 지정 필요)
```

## 참고

- `package.json` 의 `overrides`: VPE 2.1.3 이 SDK 53 계열 `expo-dev-client`/`expo-constants`/`expo-modules-autolinking` 을 요구해서 SDK 54 버전으로 통일 (공식 데모 앱과 동일한 처리)
- `vpe-react-native.d.ts`: 2.1.3 패키지에 타입 선언이 빠져 있어 any 로 선언
- 전체화면 이벤트 이름은 2.1.3 기준 `events.fullscreen` (문서의 `fullScreen` 아님)
- 개발 가이드: https://developer.vpe.naverncp.com/docs/rn/intro/
