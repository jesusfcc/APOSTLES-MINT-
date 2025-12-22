import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      console.log("Initializing Farcaster SDK...");
      try {
        await sdk.actions.ready();
        console.log("Farcaster SDK Ready");
      } catch (e) {
        console.error("SDK Ready failed", e);
      }
      setIsSDKLoaded(true);
    };

    if (sdk) {
      load();
    }
  }, []);

  if (!isSDKLoaded) {
    return <SplashScreen />;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <MintScreen />
    </main>
  );
}
