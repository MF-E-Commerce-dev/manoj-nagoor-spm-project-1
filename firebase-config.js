(() => {
  // Replace this config with your Firebase project values from console.firebase.google.com
  const firebaseConfig = {
    apiKey: "AIzaSyBl33aISH2kPwTIHRF-LeFZxn3YDPUXDU4",
    authDomain: "spm-project-1-9cc6a.firebaseapp.com",
    projectId: "spm-project-1-9cc6a",
    storageBucket: "spm-project-1-9cc6a.firebasestorage.app",
    messagingSenderId: "964448145896",
    appId: "1:964448145896:web:f49eefbcc59fc22d59d45d",
    measurementId: "G-8W2W4F0EM5"
  };

  const hasPlaceholderValues = Object.values(firebaseConfig).some((value) =>
    String(value).includes("YOUR_")
  );

  if (hasPlaceholderValues) {
    console.warn(
      "Firebase is not configured yet. Update firebase-config.js with real project credentials."
    );
    return;
  }

  if (!window.firebase) {
    console.error("Firebase SDK failed to load.");
    return;
  }

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }
})();
