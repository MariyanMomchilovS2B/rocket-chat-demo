import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [iframeUrl, setIframeUrl] = useState('');
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  const postMessageToIframe = () => {
    if (iframeRef.current) {
      const message = {
        event: 'login-with-token',
        loginToken: localStorage.getItem('chatAuthToken'),
      };
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('chatAuthToken')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:3030/roomUrl', {
      headers: {
        'X-Auth-Token': localStorage.getItem('chatAuthToken'),
        'X-User-Id': localStorage.getItem('chatUserId'),
      },
    })
      .then((response) => response.json())
      .then(({ url }) => setIframeUrl(url));
  }, [setIframeUrl]);

  useEffect(() => {
    if (!iframeUrl) {
      return;
    }

    const chatLoginOnIframeLoad = (event) => {
      if (event.data.eventName === 'startup') {
        postMessageToIframe();
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      window.addEventListener('message', chatLoginOnIframeLoad);
    }

    return () => {
      if (iframe) {
        window.addEventListener('message', chatLoginOnIframeLoad);
      }
    };
  }, [iframeUrl]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Brand Example</h1>
      <h2>Brand Content</h2>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        width="60%"
        height="600px"
        title="Chat"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      ></iframe>
    </div>
  );
}

export default Home;
