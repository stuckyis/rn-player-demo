import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';
import { VpePlayer } from 'vpe-react-native';

// EXPO_PUBLIC_* 값은 `process.env.EXPO_PUBLIC_XXX` 형태로 직접 참조해야 빌드 시 인라인된다.
const SOURCES = {
  VOD: {
    file:
      process.env.EXPO_PUBLIC_VOD_URL ||
      'https://m4qgahqg2249.edge.naverncp.com/hls/a4oif2oPHP-HlGGWOFm29A__/endpoint/sample/221027_NAVER_Cloud_intro_Long_ver_AVC_,FHD_2Pass_30fps,HD_2Pass_30fps,SD_2Pass_30fps,.mp4.smil/master.m3u8',
    poster: 'https://2ardrvaj2252.edge.naverncp.com/endpoint/sample/221027_NAVER_Cloud_intro_Long_ver_01.jpg',
  },
  LIVE: {
    file: process.env.EXPO_PUBLIC_LIVE_URL || 'https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8',
  },
};

type Mode = keyof typeof SOURCES;

const ACCESS_KEY = process.env.EXPO_PUBLIC_VPE_ACCESS_KEY;
// 개발(__DEV__) 빌드에서 SDK는 실제 앱 ID 대신 devTestAppId로 키를 검증한다. 미지정 시 SDK 기본값이 쓰이므로 항상 넘긴다.
const APP_ID = process.env.EXPO_PUBLIC_VPE_APP_ID || Application.applicationId || undefined;

export default function App() {
  const [mode, setMode] = useState<Mode>('VOD');
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" hidden={isFullScreen} />
      <SafeAreaView style={styles.container} edges={isFullScreen ? [] : ['top', 'left', 'right']}>
        {!isFullScreen && (
          <View style={styles.header}>
            <Text style={styles.title}>VPE Player Demo</Text>
            <View style={styles.tabs}>
              {(Object.keys(SOURCES) as Mode[]).map((m) => (
                <Pressable key={m} onPress={() => setMode(m)} style={[styles.tab, mode === m && styles.tabActive]}>
                  <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>{m}</Text>
                </Pressable>
              ))}
            </View>
            {!ACCESS_KEY && <Text style={styles.warn}>.env 에 EXPO_PUBLIC_VPE_ACCESS_KEY 를 설정하세요.</Text>}
          </View>
        )}

        <VpePlayer
          key={mode}
          accessKey={ACCESS_KEY}
          devTestAppId={APP_ID}
          platform={process.env.EXPO_PUBLIC_VPE_PLATFORM === 'gov' ? 'gov' : 'pub'}
          options={{ playlist: [SOURCES[mode]], autostart: true }}
          events={{
            fullscreen: ({ isFullScreen }: { isFullScreen: boolean }) => setIsFullScreen(isFullScreen),
            error: (e: unknown) => console.warn('VPE error', e),
          }}
        />

        {!isFullScreen && (
          <Text style={styles.info}>
            {mode} · {SOURCES[mode].file}
            {'\n'}appId: {APP_ID}
          </Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999, backgroundColor: '#eee' },
  tabActive: { backgroundColor: '#222' },
  tabText: { color: '#222', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  warn: { color: '#d33' },
  info: { padding: 16, color: '#666', fontSize: 12 },
});
