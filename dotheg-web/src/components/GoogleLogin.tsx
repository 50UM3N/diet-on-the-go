import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

export default function GoogleLogin({ onGoogleSignIn }: { onGoogleSignIn: any }) {
  const googleButton = useRef(null);

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";

    loadScript(src)
      .then(() => {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.APP_GOOGLE_CLIENT_ID,
          callback: onGoogleSignIn,
        });
        window.google.accounts.id.renderButton(googleButton.current!, {
          theme: "outline",
          size: "medium",
          type: "icon",
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, [onGoogleSignIn]);

  return <div ref={googleButton}></div>;
}
GoogleLogin.propTypes = {
  onGoogleSignIn: PropTypes.any.isRequired,
};
